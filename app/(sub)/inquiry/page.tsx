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
  "없다 (사람마다 기준이 제각각이다)",
  "말로는 있지만 구체적으로 문서화되어 있지 않다",
  "과거에 만들었지만 업데이트가 필요하다",
  "실제 업무 현장의 모습과 잘 맞지 않는다",
  "기준이 명확하고 실제 제도에 잘 활용되고 있다",
]

const STEP3_OPTIONS = [
  "방법론이 막막하다",
  "비용과 시간이 너무 많이 소요된다",
  "직무별 특성 반영이 어렵다",
  "상황 변화 속도를 따라가지 못하는 속도",
  "실제 인사 제도와 연결하기 어렵다",
  "아직 시도해 본 적 없다",
]

const STEP4_OPTIONS = [
  "객관적이고 공정한 기준 확립",
  "고성과자의 '성공 DNA' 추출",
  "구성원 설득 및 수용성 제고",
  "시간과 비용의 획기적 절감",
  "실시간 기준 업데이트",
  "특별히 기대되는 점 없음",
]

const STEP5_OPTIONS = [
  "데이터 보안 유출 우려",
  "결과의 신뢰성 부족",
  "결과물 수정/관리의 어려움",
  "기존 인사 체계와의 연결성 확보",
  "특별히 우려되는 점 없음",
]

const STEP6_OPTIONS = [
  "채용 (면접 질문 및 선별 기준 수립)",
  "평가 (성과 지표 수립 및 피드백)",
  "교육/육성 (1:1 AI 롤플레이 등 실전형 개발)",
  "HR 데이터 통합 관리",
  "현재로서는 없음",
]

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

/* ── 메인 컴포넌트 ── */
// step 1: 연락처 정보  |  step 2~7: 설문 1~6  |  step 8: 완료
export default function InquiryPage() {
  const [step, setStep] = useState(1)

  const [step1, setStep1] = useState("")
  const [step2, setStep2] = useState("")
  const [step3, setStep3] = useState<string[]>([])
  const [step4, setStep4] = useState<string[]>([])
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
    step === 3 ? !!step2 :
    step === 4 ? step3.length > 0 :
    step === 5 ? step4.length > 0 :
    step === 6 ? step5.length > 0 :
    step === 7 ? !!step6 :
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
            competency_model: step2,
            difficulties: step3,
            ai_expectations: step4,
            ai_concerns: step5,
            hr_task: step6,
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

  const isMultiple = step === 4 || step === 5 || step === 6

  const STEP_TITLES: Record<number, string> = {
    1: "어떤 유형의 조직에 속해 계신가요?",
    2: "현재 우리 조직에는 '일 잘하는 기준(역량 모델)'이 정리되어 있나요?",
    3: "우리 조직에서 '일 잘하는 기준'을 정의하거나 관리할 때, 가장 어려운 점은 무엇인가요?",
    4: "만약 AI가 조직 내부 데이터를 기반으로 '일 잘하는 기준'을 3초 만에 도출해준다면, 가장 기대되는 점은 무엇인가요?",
    5: "한편, HR에 AI 도입을 검토할 때 가장 고민(우려)되는 점은 무엇인가요?",
    6: "도출된 '일 잘하는 기준'을 바탕으로 가장 먼저 해결하고 싶은 HR 과제는 무엇인가요?",
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
      <div className={`w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 ${step === 8 ? "mt-14 sm:mt-16" : ""}`}>

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

        {/* ── Step 3 ── */}
        {step === 3 && (
          <div className="flex flex-col gap-2.5">
            {STEP2_OPTIONS.map((opt) => (
              <RadioOption key={opt} label={opt} selected={step2 === opt} onChange={() => { setStep2(opt); autoNext() }} />
            ))}
          </div>
        )}

        {/* ── Step 4 (복수) ── */}
        {step === 4 && (
          <div className="flex flex-col gap-2.5">
            {STEP3_OPTIONS.map((opt) => (
              <CheckOption key={opt} label={opt} selected={step3.includes(opt)}
                onChange={() => setStep3(toggle(step3, opt))} />
            ))}
          </div>
        )}

        {/* ── Step 5 (복수) ── */}
        {step === 5 && (
          <div className="flex flex-col gap-2.5">
            {STEP4_OPTIONS.map((opt) => (
              <CheckOption key={opt} label={opt} selected={step4.includes(opt)}
                onChange={() => setStep4(toggle(step4, opt))} />
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

        {/* ── Step 7 ── */}
        {step === 7 && (
          <div className="flex flex-col gap-2.5">
            {STEP6_OPTIONS.map((opt) => (
              <RadioOption key={opt} label={opt} selected={step6 === opt} onChange={() => setStep6(opt)} />
            ))}
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
