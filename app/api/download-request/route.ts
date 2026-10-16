import { NextResponse } from "next/server"
import { Resend } from "resend"
import { buildDownloadEmail } from "@/lib/download-email"
import { DOWNLOAD_POSITION_OPTIONS, getDownloadResource } from "@/lib/download-resources"

// 자료집 신청은 웨비나 신청 시트와 따로 관리하기 위해 별도 Apps Script 웹앱(개발일지/download-form/gas-download.gs)을 쓴다.
const GAS_URL = process.env.GAS_DOWNLOAD_WEBAPP_URL
const GAS_SECRET = process.env.GAS_DOWNLOAD_SHARED_SECRET
const RESEND_API_KEY = process.env.RESEND_API_KEY
// Resend에 인증된 발신 도메인은 hr.assesta.com (개발일지/webinar/2026-09-11.md 참고)
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@hr.assesta.com"

const UTM_KEYS = ["source", "medium", "campaign", "content"] as const

async function postToGas(payload: Record<string, unknown>) {
  const res = await fetch(GAS_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ secret: GAS_SECRET, ...payload }),
  })
  const text = await res.text()
  try {
    return { ok: res.ok, data: JSON.parse(text) }
  } catch {
    // 배포 권한 문제 등으로 HTML 로그인/오류 페이지가 돌아온 경우
    return { ok: false, data: { status: "error", message: text.slice(0, 200) } }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topics, topic, name, company, email, phone, jobRole, position, interests, hrIssue, privacyAgreed, marketingAgreed, utm } = body

    // 여러 자료를 한 번에 신청할 수 있다 (topics 배열). 예전 화면(캐시)이 보내는 단일 topic도 받아준다
    const requestedSlugs: string[] = [...new Set<string>((Array.isArray(topics) ? topics : [topic]).map((t: unknown) => String(t ?? "").trim()).filter(Boolean))]

    // 중복 신청은 막지 않는다 — 다시 신청하면 매번 저장 + 메일 재발송
    if (requestedSlugs.length === 0 || requestedSlugs.length > 10 || !name || !company || !email || !phone || !jobRole || !position) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 })
    }
    if (!/^01[0-9]-\d{3,4}-\d{4}$/.test(phone)) {
      return NextResponse.json({ error: "연락처를 올바르게 입력해주세요." }, { status: 400 })
    }
    if (!DOWNLOAD_POSITION_OPTIONS.includes(position)) {
      return NextResponse.json({ error: "직책을 선택해주세요." }, { status: 400 })
    }
    if (!privacyAgreed) {
      return NextResponse.json({ error: "개인정보 수집 및 이용에 동의해주세요." }, { status: 400 })
    }

    // 하나라도 마감·삭제된 자료가 섞여 있으면 신청 전체를 거절 — 일부만 조용히 빠진 채 메일이 나가지 않도록
    const resources = await Promise.all(requestedSlugs.map((slug) => getDownloadResource(slug)))
    if (resources.some((r) => !r)) {
      return NextResponse.json({ error: "신청할 수 없는 자료입니다. 페이지를 새로고침해 주세요." }, { status: 400 })
    }

    if (!GAS_URL || !GAS_SECRET) {
      console.error("GAS_DOWNLOAD_WEBAPP_URL / GAS_DOWNLOAD_SHARED_SECRET 환경변수가 설정되지 않았습니다.")
      return NextResponse.json({ error: "서버 설정 오류입니다. 잠시 후 다시 시도해주세요." }, { status: 500 })
    }

    // 유입 경로가 없으면(직접 접속) direct로 남겨 시트에서 빈칸과 구분되게 한다
    const utmValues = Object.fromEntries(
      UTM_KEYS.map((key) => [`utm_${key}`, String(utm?.[key] ?? "").slice(0, 100)]),
    )
    if (!utmValues.utm_source) utmValues.utm_source = "direct"

    const saved = await postToGas({
      action: "append",
      resourceTitle: resources.map((r) => r!.title).join("; "),
      name,
      company,
      email,
      phone,
      jobRole,
      position,
      interests: Array.isArray(interests) ? interests.join("; ") : "",
      hrIssue: hrIssue ?? "",
      privacyAgreed: Boolean(privacyAgreed),
      marketingAgreed: Boolean(marketingAgreed),
      ...utmValues,
    })
    if (!saved.ok || saved.data.status !== "success") {
      console.error("자료집 신청 GAS 저장 실패:", saved.data)
      return NextResponse.json({ error: "신청 저장 중 오류가 발생했습니다." }, { status: 502 })
    }

    // 메일 발송 실패는 사용자에게 에러로 보여주지 않고 시트의 메일발송상태 컬럼으로만 남긴다 (웨비나 신청과 동일 정책)
    let mailStatus: "발송" | "발송실패" = "발송실패"
    if (RESEND_API_KEY) {
      try {
        const { subject, html } = buildDownloadEmail({
          applicantName: name,
          resources: resources.map((r) => ({ title: r!.title, pdfUrl: r!.pdfUrl })),
        })
        const { error } = await new Resend(RESEND_API_KEY).emails.send({ from: RESEND_FROM_EMAIL, to: email, subject, html })
        if (error) console.error("자료집 메일 발송 실패:", error)
        else mailStatus = "발송"
      } catch (err) {
        console.error("자료집 메일 발송 중 오류:", err)
      }
    } else {
      console.error("RESEND_API_KEY 환경변수가 설정되지 않아 메일 발송을 건너뜁니다.")
    }

    try {
      const updated = await postToGas({ action: "updateMailStatus", requestId: saved.data.id, mailStatus })
      if (!updated.ok || updated.data.status !== "success") console.error("자료집 메일발송상태 갱신 실패:", updated.data)
    } catch (err) {
      console.error("자료집 메일발송상태 갱신 실패:", err)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("download-request API error:", err)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
