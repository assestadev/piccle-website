"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// 숫자만 입력해도 010-0000-0000 형태로 자동 정렬 — 사용자가 하이픈을 직접 넣을 필요 없음
function formatPhone(raw: string) {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

// form에 noValidate가 걸려 있어 <input type="email">의 브라우저 기본 검증이 동작하지 않으므로 직접 검사
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// "심리검사"를 검사 유형별 4개 옵션으로 분리(2026-09-14). GAS 웹앱/구글시트가 이 문자열들과
// 정확히 일치하는 고정 컬럼에 체크하는 방식이라면, 시트 쪽에도 동일한 4개 컬럼을 추가해야
// 응답이 누락되지 않음 — 시트 담당자 확인 필요.
const INTEREST_OPTIONS = [
  "인재육성, 교육",
  "조직문화",
  "성과보상",
  "웰니스, EAP",
  "심리검사 (MBTI)",
  "심리검사 (CPI)",
  "심리검사 (TKI)",
  "심리검사 (FIRO-B)",
  "코칭, 상담",
  "AI 교육",
  "플립러닝",
]

// TODO(GAS 연동 예정): 아래 안내 문구는 지금은 하드코딩돼 있음.
// 인계서 06번 marketing_consent_notice 시트 연동 시, 이 컴포넌트가 시트에서 읽어온
// 문구를 props로 받도록 바꿔야 함 (법무 검토로 문구가 바뀔 때 코드 배포 없이 반영하기 위함).
const MARKETING_CONSENT_NOTICE = {
  purpose:
    "Piccle 서비스 관련 정보(서비스 설명, 업데이트 소식, 혜택 등) 전송\nPiccle 서비스 관련 이벤트(웨비나, 워크숍, 세미나 등) 소식 전송",
  items: "이름, 회사명, 회사 이메일, 연락처",
  channel: "이메일(전자우편), 문자",
  retention: '신청일로부터 "1년" 혹은 "수신 거부" 요청 시까지',
  refusal:
    "정보주체는 마케팅 정보 수신 동의에 거부할 권리가 있습니다. 단, 동의를 거부할 경우, Piccle 서비스 및 이벤트에 관한 정보를 받으실 수 없습니다.",
  withdrawal: '본 수신동의를 철회하고자 할 경우, 수신된 메일 및 문자 내 "수신거부"를 클릭해 주시기 바랍니다.',
}

interface RegistrationFormProps {
  slug: string
  categoryTag: string
  title: string
  listDate: string
  listTime: string
  durationSummary?: string
  seminarType: string
  eventDate: string
  speaker: string
  location: string
  audience: string
  closingDate: string
  emailHeading: string
}

export function RegistrationForm({
  slug,
  categoryTag,
  title,
  listDate,
  listTime,
  durationSummary,
  seminarType,
  eventDate,
  speaker,
  location,
  audience,
  closingDate,
  emailHeading,
}: RegistrationFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    hrIssue: "",
    expectation: "",
  })
  const [interest, setInterest] = useState<string[]>([])
  const [interestError, setInterestError] = useState(false)
  const [consent, setConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [marketingDetailOpen, setMarketingDetailOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const firstInterestRef = useRef<HTMLInputElement>(null)

  const toggleInterest = (value: string) => {
    setInterest((prev) => {
      const next = prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      if (next.length > 0) setInterestError(false)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (!form.name || !form.company || !form.email || !form.phone || !form.hrIssue || !form.expectation) {
      setSubmitError("필수 항목을 모두 입력해주세요.")
      return
    }
    if (!isValidEmail(form.email)) {
      setSubmitError("올바른 이메일 주소를 입력해주세요.")
      return
    }
    if (interest.length === 0) {
      setInterestError(true)
      firstInterestRef.current?.focus()
      return
    }
    if (!consent) {
      setSubmitError("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/webinar-registration", {
        method: "POST",
        // charset=utf-8를 명시 — 한글 등 비ASCII 문자가 확실히 UTF-8로 전달되도록 고정
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          interests: interest,
          hrIssue: form.hrIssue,
          motivation: form.expectation,
          privacyAgreed: consent,
          marketingAgreed: marketingConsent,
          seminarTitle: title,
          seminarType,
          category: categoryTag,
          eventDate,
          speaker,
          location,
          audience,
          closingDate,
          emailHeading,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "제출 중 오류가 발생했습니다.")
      }

      router.push(`/webinar/${slug}/complete`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "제출 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <aside className="flex flex-col gap-5 border-t-8 border-[#f4f4f4] px-4 py-8 min-[900px]:px-6 min-[1100px]:w-[380px] min-[1100px]:shrink-0 min-[1100px]:rounded-2xl min-[1100px]:border min-[1100px]:border-[#e3e5f0] min-[1100px]:p-6 min-[1100px]:shadow-[0_8px_24px_-12px_rgba(18,25,63,0.15)]">
      <div className="flex flex-col gap-2.5 border-b border-[#e3e5f0] pb-4">
        <span className="inline-flex w-fit items-center justify-center whitespace-nowrap rounded-full bg-[#eef1fb] px-3 py-1 text-xs font-bold text-[#2f5eff]">
          {categoryTag}
        </span>
        <h2 className="m-0 text-lg font-bold text-[#15172b]">{title}</h2>
        <div className="flex items-center gap-1.5 text-sm text-[#6d7180]">
          <Image src="/webinar-assets/icon-calendar.svg" alt="" width={14} height={14} />
          <span>
            {listDate} {listTime}
          </span>
        </div>
        {durationSummary && <p className="m-0 text-sm text-[#6d7180]">{durationSummary}</p>}
      </div>

      <form className="flex flex-col gap-3.5" onSubmit={handleSubmit} noValidate>
        <Field label="이름" required htmlFor="regName">
          <input
            id="regName"
            required
            placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="회사명" required htmlFor="regCompany">
          <input
            id="regCompany"
            required
            placeholder="픽클 주식회사"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className={inputClass}
          />
        </Field>

        <Field label="이메일" required htmlFor="regEmail">
          <input
            id="regEmail"
            type="email"
            required
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-[#e0453c]">회사이메일로 작성해주시기 바랍니다.</p>
        </Field>

        <Field label="연락처" required htmlFor="regPhone">
          <input
            id="regPhone"
            type="tel"
            inputMode="numeric"
            required
            pattern="01[0-9]-\d{3,4}-\d{4}"
            title="010-0000-0000 형식으로 저장됩니다. 숫자만 입력해주세요."
            placeholder="010-0000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
            className={inputClass}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-[#15172b]">
            관심주제 (중복체크 가능) <span className="text-[#2f5eff]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {INTEREST_OPTIONS.map((opt, i) => (
              <label key={opt} className="flex cursor-pointer items-start gap-2 text-[13px] font-medium text-[#6d7180]">
                <input
                  ref={i === 0 ? firstInterestRef : undefined}
                  type="checkbox"
                  checked={interest.includes(opt)}
                  onChange={() => toggleInterest(opt)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border border-[#e3e5f0] accent-[#2f5eff]"
                />
                {opt}
              </label>
            ))}
          </div>
          {interestError && <p className="mt-1 text-xs text-[#e0453c]">관심주제를 1개 이상 선택해주세요.</p>}
        </div>

        <Field label="현재 사내 HR 이슈" required htmlFor="regHrIssue">
          <textarea
            id="regHrIssue"
            required
            placeholder="현재 사내 HR 업무 또는 조직 운영에서 가장 고민되는 이슈가 있다면 편하게 남겨주세요."
            value={form.hrIssue}
            onChange={(e) => setForm({ ...form, hrIssue: e.target.value })}
            className={`${inputClass} min-h-[72px] resize-y`}
          />
        </Field>

        <Field label="참가 계기 및 Q&A" required htmlFor="regExpectation">
          <textarea
            id="regExpectation"
            required
            placeholder="이번 세미나에 참석하게 된 가장 큰 계기나 연사에게 궁금하신 점은 무엇인가요?"
            value={form.expectation}
            onChange={(e) => setForm({ ...form, expectation: e.target.value })}
            className={`${inputClass} min-h-[72px] resize-y`}
          />
        </Field>

        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="consent"
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border border-[#e3e5f0] accent-[#2f5eff]"
          />
          <label htmlFor="consent" className="cursor-pointer text-xs font-normal leading-relaxed text-[#6d7180]">
            (필수) 입력하신 개인정보(이름, 회사명, 이메일, 연락처)는 온라인/오프라인 세미나 안내 및 소식지 발송을 위해서 사용됩니다. (보관기간 최대 2년)
          </label>
        </div>

        <div className="flex items-start gap-2.5">
          <input
            id="marketingConsent"
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border border-[#e3e5f0] accent-[#2f5eff]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="marketingConsent" className="cursor-pointer text-xs text-[#6d7180]">
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

        {submitError && (
          <p className="rounded-lg bg-[#fdecea] px-3 py-2.5 text-xs text-[#e0453c]">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full cursor-pointer rounded-[10px] bg-[#222] px-5 py-3.5 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "제출 중..." : "신청 완료하기"}
        </button>
      </form>
    </aside>
  )
}

const inputClass =
  "w-full rounded-lg border border-[#e3e5f0] px-3 py-2.5 text-sm text-[#222] placeholder:text-[#9296a6] focus:outline-none focus:border-[#2f5eff]"

function Field({
  label,
  required,
  htmlFor,
  children,
}: {
  label: string
  required?: boolean
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-[#15172b]">
        {label} {required && <span className="text-[#2f5eff]">*</span>}
      </label>
      {children}
    </div>
  )
}
