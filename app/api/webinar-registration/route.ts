import { NextResponse } from "next/server"
import { Resend } from "resend"
import { createSupabaseClient } from "@/lib/supabase"
import { buildWebinarConfirmationEmail } from "@/lib/webinar-confirmation-email"

// Google Apps Script 웹앱(doPost) 주소와 공유 시크릿 — 둘 다 서버 환경변수로만 보관.
// 클라이언트(registration-form.tsx)는 이 값들을 절대 직접 알지 못하고, 이 API route를 통해서만 호출함.
const GAS_URL = process.env.GAS_WEBINAR_WEBAPP_URL
const GAS_SECRET = process.env.GAS_WEBINAR_SHARED_SECRET
const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@mail.piccle.ai"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      company,
      email,
      phone,
      interests,
      hrIssue,
      motivation,
      privacyAgreed,
      marketingAgreed,
      seminarTitle,
      seminarType,
      category,
      eventDate,
      speaker,
      location,
      audience,
      closingDate,
      emailHeading,
    } = body

    if (!name || !company || !email || !phone || !hrIssue || !motivation) {
      return NextResponse.json({ error: "필수 항목을 모두 입력해주세요." }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "올바른 이메일 주소를 입력해주세요." }, { status: 400 })
    }
    if (!Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json({ error: "관심주제를 1개 이상 선택해주세요." }, { status: 400 })
    }
    if (!privacyAgreed) {
      return NextResponse.json({ error: "개인정보 수집 및 이용에 동의해주세요." }, { status: 400 })
    }

    if (!GAS_URL || !GAS_SECRET) {
      console.error("GAS_WEBINAR_WEBAPP_URL / GAS_WEBINAR_SHARED_SECRET 환경변수가 설정되지 않았습니다.")
      return NextResponse.json({ error: "서버 설정 오류입니다. 잠시 후 다시 시도해주세요." }, { status: 500 })
    }

    const gasRes = await fetch(GAS_URL, {
      method: "POST",
      // charset=utf-8를 명시 — 한글 등 비ASCII 문자가 확실히 UTF-8로 전달되도록 고정
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        secret: GAS_SECRET,
        name,
        company,
        email,
        phone,
        interests,
        hrIssue,
        motivation,
        privacyAgreed: Boolean(privacyAgreed),
        marketingAgreed: Boolean(marketingAgreed),
        seminarTitle,
        seminarType,
        category,
        eventDate,
      }),
    })

    if (!gasRes.ok) {
      console.error("GAS 호출 실패:", gasRes.status, await gasRes.text())
      return NextResponse.json({ error: "신청 저장 중 오류가 발생했습니다." }, { status: 502 })
    }

    const gasData = await gasRes.json()

    if (gasData.status === "duplicate") {
      return NextResponse.json({ error: gasData.message || "이미 신청하신 이메일입니다." }, { status: 409 })
    }
    if (gasData.status !== "success") {
      console.error("GAS 저장 실패:", gasData)
      return NextResponse.json({ error: "신청 저장 중 오류가 발생했습니다." }, { status: 502 })
    }

    // 이중 저장: 구글시트(GAS, 메인/어드민용)가 이미 성공했으므로 같은 데이터를 Supabase에도
    // 백업으로 복사한다. 여기서 실패해도 신청 자체는 이미 성공 처리된 뒤이므로 사용자에게
    // 에러를 보여주지 않고 서버 로그만 남긴다 — 구글시트가 진실의 원천(source of truth), Supabase는 이중화용.
    try {
      const supabase = createSupabaseClient()
      const { error: supabaseError } = await supabase.from("webinar_registrations").insert([
        {
          application_id: gasData.id,
          seminar_title: seminarTitle,
          seminar_type: seminarType,
          category,
          event_date: eventDate,
          name,
          company,
          email,
          phone,
          interests: Array.isArray(interests) ? interests.join("; ") : interests,
          hr_issue: hrIssue,
          motivation,
          privacy_agreed: Boolean(privacyAgreed),
          marketing_agreed: Boolean(marketingAgreed),
        },
      ])
      if (supabaseError) {
        console.error("Supabase 이중 저장 실패(구글시트 저장은 성공함):", supabaseError)
      }
    } catch (supabaseErr) {
      console.error("Supabase 이중 저장 중 오류(구글시트 저장은 성공함):", supabaseErr)
    }

    // 안내 메일 발송 — 저장과 별도 단계. 발송이 실패해도 신청 자체는 이미 성공 처리된 뒤이므로
    // 사용자에게는 에러를 보여주지 않고, 결과만 GAS에 2차 전송해 메일발송상태 컬럼을 갱신한다(인계서 06·07번).
    let mailStatus: "발송" | "발송실패" = "발송실패"
    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY)
        const { subject, html } = buildWebinarConfirmationEmail({
          applicantName: name,
          seminarTitle,
          speaker,
          eventDate,
          location,
          audience,
          closingDate,
          emailHeading,
        })
        const { error: resendError } = await resend.emails.send({
          from: RESEND_FROM_EMAIL,
          to: email,
          subject,
          html,
        })
        if (resendError) {
          console.error("Resend 발송 실패:", resendError)
        } else {
          mailStatus = "발송"
        }
      } catch (resendErr) {
        console.error("Resend 발송 중 오류:", resendErr)
      }
    } else {
      console.error("RESEND_API_KEY 환경변수가 설정되지 않아 메일 발송을 건너뜁니다.")
    }

    try {
      const updateResponse = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          secret: GAS_SECRET,
          action: "updateMailStatus",
          applicationId: gasData.id,
          mailStatus,
        }),
      })
      const updateBody = await updateResponse.text()
      let updateStatus: unknown
      let updateMessage: unknown
      try {
        const result = JSON.parse(updateBody)
        updateStatus = result?.status
        updateMessage = result?.message
      } catch {
        // HTML login/error pages are not valid status-update responses.
      }
      if (!updateResponse.ok || updateStatus !== "success") {
        const knownMessages = [
          "unauthorized",
          "해당 신청ID를 찾을 수 없습니다.",
          "신청ID가 없습니다.",
          "registrations 시트를 찾을 수 없습니다.",
          "지원하지 않는 요청입니다.",
        ]
        console.error("메일발송상태 갱신 실패:", {
          httpStatus: updateResponse.status,
          reason: typeof updateMessage === "string" && knownMessages.includes(updateMessage)
            ? updateMessage
            : "Apps Script 응답이 성공 JSON이 아닙니다. 웹앱 배포 버전과 실행 기록을 확인하세요.",
        })
      }
    } catch (updateErr) {
      console.error("메일발송상태 갱신 실패:", updateErr)
    }

    return NextResponse.json({ success: true, applicationId: gasData.id })
  } catch (err) {
    console.error("webinar-registration API error:", err)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
