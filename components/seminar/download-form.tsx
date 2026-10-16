"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Field,
  INTEREST_OPTIONS,
  MARKETING_CONSENT_NOTICE,
  formatPhone,
  inputClass,
  isValidEmail,
  isValidPhone,
} from "@/components/seminar/registration-form"

export type DownloadUtm = Partial<Record<"source" | "medium" | "campaign" | "content", string>>

// 홍보메일 → 폼 페이지에서 다른 페이지를 들렀다 돌아와도 처음 유입된 UTM이 유지되도록 탭 단위로 보관
const UTM_STORAGE_KEY = "piccle-download-utm"

const checkboxClass = "mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border border-[#e3e5f0] accent-[#2f5eff]"

interface DownloadFormProps {
  resources: { slug: string; title: string }[]
  positions: string[]
  utm: DownloadUtm
}

export function DownloadForm({ resources, positions, utm }: DownloadFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    jobRole: "",
    position: "",
    hrIssue: "",
  })
  // 링크로 지정된(또는 노출 중인) 자료는 모두 선택된 상태로 시작 — 필요 없는 것만 해제
  const [topics, setTopics] = useState<string[]>(resources.map((r) => r.slug))
  const [interest, setInterest] = useState<string[]>([])
  const [consent, setConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [marketingDetailOpen, setMarketingDetailOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [trackedUtm, setTrackedUtm] = useState<DownloadUtm>(utm)
  // 봇 차단: 함정 칸 값과 페이지를 연 시각 (너무 빠른 제출 판별용)
  const [website, setWebsite] = useState("")
  const openedAt = useRef(0)
  useEffect(() => {
    openedAt.current = Date.now()
  }, [])

  useEffect(() => {
    try {
      if (Object.values(utm).some(Boolean)) {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm))
      } else {
        const saved = sessionStorage.getItem(UTM_STORAGE_KEY)
        if (saved) setTrackedUtm(JSON.parse(saved))
      }
    } catch {
      // 저장소 접근이 막힌 환경(시크릿 모드 등)에서는 URL에 있는 값만 사용
    }
  }, [utm])

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: key === "phone" ? formatPhone(e.target.value) : e.target.value })

  const toggleTopic = (slug: string) =>
    setTopics((prev) => (prev.includes(slug) ? prev.filter((v) => v !== slug) : [...prev, slug]))

  const toggleInterest = (value: string) =>
    setInterest((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (topics.length === 0) {
      setSubmitError("받으실 자료를 1개 이상 선택해주세요.")
      return
    }
    if (!form.name || !form.company || !form.email || !form.phone || !form.jobRole || !form.position) {
      setSubmitError("필수 항목을 모두 입력해주세요.")
      return
    }
    if (!isValidEmail(form.email)) {
      setSubmitError("올바른 이메일 주소를 입력해주세요.")
      return
    }
    if (!isValidPhone(form.phone)) {
      setSubmitError("연락처를 올바르게 입력해주세요. (예: 010-0000-0000)")
      return
    }
    if (!consent) {
      setSubmitError("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/download-request", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          ...form,
          topics,
          interests: interest,
          privacyAgreed: consent,
          marketingAgreed: marketingConsent,
          utm: trackedUtm,
          website,
          elapsedMs: Date.now() - openedAt.current,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "제출 중 오류가 발생했습니다.")
      }
      router.push("/seminar/downloadform/complete")
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "제출 중 오류가 발생했습니다.")
      setSubmitting(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
      {/* 함정 칸 — 화면 밖에 숨겨 사람은 보지도 채우지도 않는다. 자동 입력 봇만 채움 */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="dlWebsite">회사 웹사이트</label>
        <input id="dlWebsite" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {/* 자료가 1개면 고를 게 없으므로 고정 표시, 여러 개면 체크박스로 원하는 것만 골라 한 번에 받는다 */}
      {resources.length === 1 ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-[#15172b]">신청 자료</span>
          <p className="m-0 rounded-lg border border-[#e3e5f0] bg-[#f9f9f9] px-3 py-2.5 text-sm font-medium text-[#222]">
            {resources[0].title}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-[#15172b]">
            신청 자료 (중복 선택 가능) <span className="text-[#2f5eff]">*</span>
          </span>
          <div className="flex flex-col gap-2 rounded-lg border border-[#e3e5f0] px-3 py-3">
            {resources.map((r) => (
              <label key={r.slug} className="flex cursor-pointer items-start gap-2 text-sm font-medium text-[#222]">
                <input type="checkbox" checked={topics.includes(r.slug)} onChange={() => toggleTopic(r.slug)} className={checkboxClass} />
                {r.title}
              </label>
            ))}
          </div>
          <p className="m-0 text-xs text-[#9296a6]">선택한 자료의 다운로드 링크를 메일 한 통으로 보내드려요.</p>
        </div>
      )}

      <Field label="이름" required htmlFor="dlName">
        <input id="dlName" placeholder="성함을 입력해주세요" value={form.name} onChange={update("name")} className={inputClass} />
      </Field>

      <Field label="회사명" required htmlFor="dlCompany">
        <input id="dlCompany" placeholder="회사명을 입력해주세요" value={form.company} onChange={update("company")} className={inputClass} />
      </Field>

      <Field label="업무 메일 주소" required htmlFor="dlEmail">
        <input
          id="dlEmail"
          type="email"
          placeholder="name@company.com"
          value={form.email}
          onChange={update("email")}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-[#9296a6]">입력하신 메일로 자료집 다운로드 링크를 바로 보내드려요.</p>
      </Field>

      <Field label="연락처" required htmlFor="dlPhone">
        <input
          id="dlPhone"
          type="tel"
          inputMode="numeric"
          placeholder="010-0000-0000"
          value={form.phone}
          onChange={update("phone")}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 min-[600px]:grid-cols-2">
        <Field label="직무" required htmlFor="dlJobRole">
          <input id="dlJobRole" placeholder="예: 인사기획, 채용, HRD" value={form.jobRole} onChange={update("jobRole")} className={inputClass} />
        </Field>

        <Field label="직책" required htmlFor="dlPosition">
          <select
            id="dlPosition"
            value={form.position}
            onChange={update("position")}
            className={`${inputClass} bg-white ${form.position ? "" : "text-[#9296a6]"}`}
          >
            <option value="" disabled>
              직책을 선택해주세요
            </option>
            {positions.map((p) => (
              <option key={p} value={p} className="text-[#222]">
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-2 flex flex-col gap-4 rounded-xl bg-[#f9f9f9] p-4 min-[600px]:p-5">
        <p className="m-0 text-[13px] font-bold text-[#15172b]">
          더 맞는 자료를 추천해 드릴게요 <span className="font-normal text-[#9296a6]">(선택)</span>
        </p>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-[#15172b]">관심주제 (중복체크 가능)</span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 min-[600px]:grid-cols-3">
            {INTEREST_OPTIONS.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-start gap-2 text-[13px] font-medium text-[#6d7180]">
                <input type="checkbox" checked={interest.includes(opt)} onChange={() => toggleInterest(opt)} className={checkboxClass} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <Field label="현재 사내 HR 이슈" htmlFor="dlHrIssue">
          <textarea
            id="dlHrIssue"
            placeholder="요즘 가장 고민되는 HR·조직 이슈가 있다면 편하게 남겨주세요."
            value={form.hrIssue}
            onChange={update("hrIssue")}
            className={`${inputClass} min-h-[72px] resize-y bg-white`}
          />
        </Field>
      </div>

      <div className="flex items-start gap-2.5 pt-1">
        <input id="dlConsent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className={checkboxClass} />
        <label htmlFor="dlConsent" className="cursor-pointer text-xs font-normal leading-relaxed text-[#6d7180]">
          (필수) 입력하신 개인정보(이름, 회사명, 이메일, 연락처, 직무, 직책)는 자료집 발송 및 온라인/오프라인 세미나 안내, 소식지 발송을 위해서 사용됩니다. (보관기간 최대 2년)
        </label>
      </div>

      <div className="flex items-start gap-2.5">
        <input
          id="dlMarketingConsent"
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className={checkboxClass}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="dlMarketingConsent" className="cursor-pointer text-xs text-[#6d7180]">
              (선택) 마케팅 정보 수신 동의
            </label>
            <button
              type="button"
              aria-expanded={marketingDetailOpen}
              onClick={() => setMarketingDetailOpen((v) => !v)}
              className="cursor-pointer whitespace-nowrap text-xs font-semibold text-[#6d7180] underline"
            >
              {marketingDetailOpen ? "접기" : "자세히 보기"}
            </button>
          </div>
          {marketingDetailOpen && (
            <dl className="mt-2 rounded-lg bg-[#f9f9f9] p-3 text-[11px] leading-relaxed text-[#6d7180]">
              <dt className="font-bold text-[#15172b]">개인정보 수집 및 이용 목적</dt>
              <dd className="mt-0.5 whitespace-pre-line">{MARKETING_CONSENT_NOTICE.purpose}</dd>
              <dt className="mt-2 font-bold text-[#15172b]">개인정보 수집 항목</dt>
              <dd className="mt-0.5">{MARKETING_CONSENT_NOTICE.items}</dd>
              <dt className="mt-2 font-bold text-[#15172b]">마케팅 정보 전송 매체</dt>
              <dd className="mt-0.5">{MARKETING_CONSENT_NOTICE.channel}</dd>
              <dt className="mt-2 font-bold text-[#15172b]">보유 및 이용 기간</dt>
              <dd className="mt-0.5">{MARKETING_CONSENT_NOTICE.retention}</dd>
              <dt className="mt-2 font-bold text-[#15172b]">동의를 거부할 권리 및 동의 거부에 따른 불이익</dt>
              <dd className="mt-0.5">{MARKETING_CONSENT_NOTICE.refusal}</dd>
              <dt className="mt-2 font-bold text-[#15172b]">수신 동의 철회 방법</dt>
              <dd className="mt-0.5">{MARKETING_CONSENT_NOTICE.withdrawal}</dd>
            </dl>
          )}
        </div>
      </div>

      {submitError && <p className="m-0 rounded-lg bg-[#fdecea] px-3 py-2.5 text-xs text-[#e0453c]">{submitError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full cursor-pointer rounded-[10px] bg-[#222] px-5 py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "보내는 중..." : "자료집 메일로 받기"}
      </button>
    </form>
  )
}
