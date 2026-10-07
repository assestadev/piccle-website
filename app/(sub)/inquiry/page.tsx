"use client"

import { useState } from "react"

/* ── 질문 데이터 ── */
const STEP1_OPTIONS = [
  "공공기관/공기업",
  "대기업 (300인 이상)",
  "중견기업 (100~300인 미만)",
  "중소기업 (10~100인 미만)",
  "스타트업",
  "기타",
]

const STEP2_OPTIONS = [
  "신규 도입 검토",
  "기존 프로그램 개편/교체",
  "예산 편성을 위한 견적 확인",
  "내부 보고용 자료 수집",
  "단순 정보 탐색",
]

const STEP3_CATEGORIES = [
  {
    title: "1. 평가 / 채용 / 선발",
    items: ["채용, 선발 도구", "역량 관리 (역량 모델링)", "AC (평가센터)", "다면진단", "채용 인터뷰"],
  },
  {
    title: "2. 육성 / 개발 / 코칭",
    items: ["역량개발", "DC (개발센터)", "AI 시뮬레이션 코칭", "리더십 개발", "팀빌딩 / 조직개발", "코칭 / 상담"],
  },
  {
    title: "3. 심리 검사",
    items: [
      "성격유형검사 (MBTI)",
      "인성검사 (CPI)",
      "대인관계검사 (FIRO-B)",
      "갈등관리유형검사 (TKI)",
      "웰빙/회복탄력성 검사",
      "조직/업무 몰입검사",
      "AI역량준비도(Readiness) 검사",
    ],
  },
  {
    title: "4. 웰니스 & 조직문화",
    items: ["웰니스, EAP", "조직문화", "조직진단"],
  },
  {
    title: "5. HR Tech (AI / 데이터)",
    items: ["HR-AI 플랫폼 도입", "HR 데이터 분석", "AI 에이전트 도입", "커스텀 AI 기능 도입"],
  },
]

const STEP4_OPTIONS = [
  "3개월 이내",
  "6개월 이내",
  "1년 이내",
  "빠른 시일 내 협의 필요",
  "도입 시기 미정",
]

const STEP5_OPTIONS = [
  "웹 검색 (네이버, 구글 등)",
  "SNS / 디지털 광고 (링크드인, 페이스북 등)",
  "블로그 / 콘텐츠 / 뉴스레터",
  "세미나 / 웨비나 / 오프라인 행사",
  "지인 추천 / 사내 추천 / 파트너 소개",
  "기타",
]

const STEP6_MAX_LENGTH = 1000

const PRIVACY_TEXT = `제1조 (수집하는 개인정보 항목)
피클(Piccle)은 상세 제안서 발송 및 상담 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.
- 필수 항목: 이름, 회사명, 연락처(전화번호), 이메일 주소

제2조 (개인정보의 수집 및 이용 목적)
① Piccle 서비스 상세 제안서 발송 및 도입 상담 안내
② 고객 문의 응대 및 서비스 관련 정보 제공

제3조 (개인정보의 보유 및 이용 기간)
수집된 개인정보는 수집일로부터 1년간 보유 후 지체 없이 파기합니다. 단, 관계 법령(전자상거래 등에서의 소비자보호에 관한 법률 등)에 의해 보존이 필요한 경우 해당 기간 동안 보관합니다.

제4조 (개인정보 제공 및 위탁)
수집된 개인정보는 제3자에게 제공되지 않으며, 서비스 운영 목적 이외에 사용하지 않습니다.

제5조 (개인정보 제공 거부 권리)
귀하는 개인정보 제공에 동의하지 않을 권리가 있습니다. 다만, 동의 거부 시 제안서 발송 및 상담 서비스 이용이 제한될 수 있습니다.

제6조 (개인정보 처리 문의)
개인정보 처리와 관련한 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
- 이메일: assesta@assesta.com
- 개인정보 관리자: 손성훈`

/* ── 라디오 옵션 ── */
function RadioOption({ label, selected, onChange }: {
  label: string; selected: boolean; onChange: () => void
}) {
  return (
    <label
      onClick={onChange}
      className={`cursor-pointer flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "border-[#1e4fa8] bg-[#eff6ff]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? "border-[#1e4fa8]" : "border-slate-300"
      }`}>
        {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#1e4fa8]" />}
      </span>
      <span className="text-sm font-medium text-slate-700 leading-snug">{label}</span>
    </label>
  )
}

/* ── 체크박스 옵션 ── */
function CheckOption({ label, selected, onChange }: {
  label: string; selected: boolean; onChange: () => void
}) {
  return (
    <label
      onClick={onChange}
      className={`cursor-pointer flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "border-[#1e4fa8] bg-[#eff6ff]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
        selected ? "border-[#1e4fa8] bg-[#1e4fa8]" : "border-slate-300 bg-white"
      }`}>
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 6l3 3 5-5" />
          </svg>
        )}
      </span>
      <span className="text-sm font-medium text-slate-700 leading-snug">{label}</span>
    </label>
  )
}

/* ── 칩 옵션 (관심 프로그램) ── */
function ChipOption({ label, selected, onChange }: {
  label: string; selected: boolean; onChange: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onChange}
      className={`cursor-pointer px-3.5 py-2 rounded-lg border text-[13px] font-medium leading-snug transition-all duration-200 ${
        selected
          ? "border-[#1e4fa8] bg-[#1e4fa8] text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  )
}

/* ── 메인 컴포넌트 ── */
// step 1: 연락처 정보  |  step 2~7: 설문 1~6  |  step 8: 완료
export default function InquiryPage() {
  const [step, setStep] = useState(1)

  const [step1, setStep1] = useState("")
  const [step2, setStep2] = useState<string[]>([])
  const [step3, setStep3] = useState<string[]>([])
  const [step4, setStep4] = useState("")
  const [step5, setStep5] = useState<string[]>([])
  const [step6, setStep6] = useState("")

  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "" })
  const [privacyAgreed, setPrivacyAgreed] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  /* 진행률: 설문 2~7 기준 */
  const progressPct = step >= 2 && step <= 7 ? Math.round(((step - 1) / 6) * 100) : 100
  const surveyStep = step - 1 // 1~6

  /* 다음 버튼 활성 조건 */
  const canNext =
    step === 1 ? !!(form.name && form.company && form.phone && form.email && privacyAgreed) :
    step === 2 ? !!step1 :
    step === 3 ? step2.length > 0 :
    step === 4 ? step3.length > 0 :
    step === 5 ? !!step4 :
    step === 6 ? step5.length > 0 :
    step === 7 ? true : // 자유 문의는 선택 사항
    false

  const toggle = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]

  const handleNext = async () => {
    if (step === 7) {
      setSubmitting(true)
      setSubmitError("")
      try {
        const res = await fetch("/api/inquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            company: form.company,
            phone: form.phone,
            email: form.email,
            privacy_agreed: privacyAgreed,
            org_type: step1,
            purposes: step2,
            programs: step3,
            timeline: step4,
            referral_sources: step5,
            message: step6.trim(),
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "제출 중 오류가 발생했습니다.")
        }
        setStep(8)
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "제출 중 오류가 발생했습니다.")
      } finally {
        setSubmitting(false)
      }
    } else if (step < 7) {
      setStep((s) => s + 1)
    }
  }

  const autoNext = () => {
    setTimeout(() => setStep((s) => s + 1), 300)
  }

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1)
  }

  const isMultiple = step === 3 || step === 4 || step === 6

  const STEP_TITLES: Record<number, string> = {
    1: "어떤 유형의 조직에 속해 계신가요?",
    2: "도입 목적 및 현황을 선택해 주세요.",
    3: "관심 프로그램을 선택해 주세요.",
    4: "도입 희망 시기를 선택해 주세요.",
    5: "유입 경로를 선택해 주세요.",
    6: "추가로 논의하고 싶으신 사항이나 문의사항이 있다면 자유롭게 적어주세요.",
  }

  return (
    <div
      className="min-h-screen bg-[#f7f9fd] flex flex-col items-center px-4 pt-24 pb-16"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      {/* ── 상단 타이틀 (완료 전만 표시) ── */}
      {step < 8 && (
        <div className="text-center mt-6 mb-8 sm:mb-10">
          <p className="text-xs font-bold tracking-widest text-[#1e4fa8] uppercase mb-2">Contact</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">문의하기</h1>
          <p className="text-slate-500 text-sm sm:text-base">6가지 질문에 답변하면 맞춤 제안서를 보내드립니다.</p>
        </div>
      )}

      {/* ── 카드 ── */}
      <div className={`w-full ${step === 4 ? "max-w-3xl" : "max-w-lg"} bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 ${step === 8 ? "mt-14 sm:mt-16" : ""}`}>

        {/* ── 진행바 (step 2~7) ── */}
        {step >= 2 && step <= 7 && (
          <div className="mb-7">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-[#1e4fa8]">질문 {surveyStep} / 6</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1e4fa8] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {isMultiple && (
              <p className="text-xs text-slate-400 mt-2">복수 선택 가능</p>
            )}
          </div>
        )}

        {/* ── 질문 제목 (step 2~7) ── */}
        {step >= 2 && step <= 7 && (
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-5 leading-snug">
            {STEP_TITLES[surveyStep]}
          </h2>
        )}

        {/* ── Step 1: 연락처 정보 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1 leading-snug">
                연락처 정보
              </h2>
              <p className="text-sm text-slate-400">피클(Piccle)의 상세 제안서를 받아보세요</p>
            </div>

            <div className="w-full h-px bg-slate-100" />

            <div className="flex flex-col gap-3">
              {/* 이름 */}
              <input
                type="text"
                placeholder="이름"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1e4fa8] focus:ring-2 focus:ring-[#1e4fa8]/10 transition-all"
              />
              {/* 회사명 */}
              <input
                type="text"
                placeholder="회사명"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1e4fa8] focus:ring-2 focus:ring-[#1e4fa8]/10 transition-all"
              />
              {/* 연락처 — 숫자만 허용 */}
              <input
                type="tel"
                inputMode="numeric"
                placeholder="연락처 (숫자만 입력)"
                value={form.phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, "")
                  setForm({ ...form, phone: digits })
                }}
                maxLength={11}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1e4fa8] focus:ring-2 focus:ring-[#1e4fa8]/10 transition-all"
              />
              {/* 이메일 — 형식 검증 */}
              <div>
                <input
                  type="email"
                  inputMode="email"
                  placeholder="이메일"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value })
                    if (emailError) setEmailError("")
                  }}
                  onBlur={() => {
                    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                      setEmailError("올바른 이메일 형식을 입력해주세요.")
                    } else {
                      setEmailError("")
                    }
                  }}
                  className={`w-full px-4 py-3.5 rounded-xl border bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    emailError
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                      : "border-slate-200 focus:border-[#1e4fa8] focus:ring-[#1e4fa8]/10"
                  }`}
                />
                <p className="text-xs text-slate-400 mt-1.5 ml-1">회사 이메일로 작성해주시기 바랍니다.</p>
                {emailError && (
                  <p className="text-xs text-red-500 mt-1.5 ml-1">{emailError}</p>
                )}
              </div>
            </div>

            {/* 개인정보 동의 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className="flex items-center gap-2.5 cursor-pointer group"
                  onClick={() => setPrivacyAgreed((v) => !v)}
                >
                  <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    privacyAgreed ? "border-[#1e4fa8] bg-[#1e4fa8]" : "border-slate-300 bg-white group-hover:border-slate-400"
                  }`}>
                    {privacyAgreed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    개인정보 수집 및 이용 동의
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => setPrivacyOpen((v) => !v)}
                  className="cursor-pointer flex items-center gap-1 text-xs text-[#1e4fa8] font-medium hover:text-[#0f2d6e] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1e4fa8]/40 rounded transition-colors flex-shrink-0 ml-2"
                >
                  {privacyOpen ? "접기" : "내용 보기"}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${privacyOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {privacyOpen && (
                <div className="w-full h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {PRIVACY_TEXT}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 2 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-2.5">
            {STEP1_OPTIONS.map((opt) => (
              <RadioOption key={opt} label={opt} selected={step1 === opt} onChange={() => { setStep1(opt); autoNext() }} />
            ))}
          </div>
        )}

        {/* ── Step 3 (복수) ── */}
        {step === 3 && (
          <div className="flex flex-col gap-2.5">
            {STEP2_OPTIONS.map((opt) => (
              <CheckOption key={opt} label={opt} selected={step2.includes(opt)}
                onChange={() => setStep2(toggle(step2, opt))} />
            ))}
          </div>
        )}

        {/* ── Step 4 (복수, 분류형) ── */}
        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {STEP3_CATEGORIES.map((category, idx) => (
              <div
                key={category.title}
                className={`rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${
                  idx === STEP3_CATEGORIES.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <p className="text-sm font-bold text-[#1e4fa8] mb-3">{category.title}</p>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((opt) => (
                    <ChipOption key={opt} label={opt} selected={step3.includes(opt)}
                      onChange={() => setStep3(toggle(step3, opt))} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 5 ── */}
        {step === 5 && (
          <div className="flex flex-col gap-2.5">
            {STEP4_OPTIONS.map((opt) => (
              <RadioOption key={opt} label={opt} selected={step4 === opt} onChange={() => { setStep4(opt); autoNext() }} />
            ))}
          </div>
        )}

        {/* ── Step 6 (복수) ── */}
        {step === 6 && (
          <div className="flex flex-col gap-2.5">
            {STEP5_OPTIONS.map((opt) => (
              <CheckOption key={opt} label={opt} selected={step5.includes(opt)}
                onChange={() => setStep5(toggle(step5, opt))} />
            ))}
          </div>
        )}

        {/* ── Step 7 (자유 입력, 선택) ── */}
        {step === 7 && (
          <div>
            <textarea
              placeholder="내용을 입력해 주세요. (선택)"
              value={step6}
              onChange={(e) => setStep6(e.target.value)}
              maxLength={STEP6_MAX_LENGTH}
              rows={6}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 leading-relaxed resize-none focus:outline-none focus:border-[#1e4fa8] focus:ring-2 focus:ring-[#1e4fa8]/10 transition-all"
            />
            <p className="text-xs text-slate-400 mt-1.5 text-right">{step6.length} / {STEP6_MAX_LENGTH}</p>
          </div>
        )}

        {/* ── Step 8: 완료 ── */}
        {step === 8 && (
          <div className="text-center py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-[#eff6ff] flex items-center justify-center">
                <svg className="w-10 h-10 text-[#1e4fa8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-xs font-bold tracking-widest text-[#1e4fa8] uppercase mb-3">Complete</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">제출이 완료되었습니다</h2>
            <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 text-left mb-6">
              PICCLE(Pick &amp; Circle)은 AI의 속도와 데이터 기반 객관성에 어세스타 HR 전문가 설계를 더해 채용부터 육성까지 연결되는 역량 기준을 제공합니다. AI의 한계까지 고려해 설계된 방식이 궁금하시다면, 제안서를 통해 확인해보세요.
            </p>
            <div className="w-full h-px bg-slate-100 mb-6" />
            <a
              href="/"
              className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#0f2d6e] hover:bg-[#1e4fa8] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-colors w-full"
            >
              홈으로 돌아가기
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}

        {/* ── 에러 메시지 ── */}
        {submitError && step <= 7 && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* ── 이전 / 다음 버튼 (step 1~7만 표시) ── */}
        {step >= 1 && step <= 7 && (
          <div className={`flex items-center mt-7 ${step === 1 ? "justify-end" : "justify-between"}`}>
            {step > 1 && (
              <button
                onClick={handlePrev}
                disabled={submitting}
                className="cursor-pointer px-5 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                이전
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!canNext || submitting}
              className="cursor-pointer px-7 py-3 rounded-xl text-white text-sm font-semibold bg-[#1e4fa8] hover:bg-[#0f2d6e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? "제출 중..." : step === 7 ? "제출하기" : "다음"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
