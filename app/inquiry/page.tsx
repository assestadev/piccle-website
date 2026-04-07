"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"

const STEP1_OPTIONS = [
  "역량 모델링을 새로 도입하고 싶어서",
  "기존 역량 체계를 개선하고 싶어서",
  "HR 담당자/구성원 교육이 필요해서",
  "AI 기반 HR 플랫폼에 관심이 있어서",
  "기타",
]

export default function InquiryPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [step1Value, setStep1Value] = useState("")
  const [step2Value, setStep2Value] = useState("")
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "" })

  const progress = Math.round((step / 3) * 100)

  const canNext =
    step === 1 ? !!step1Value :
    step === 2 ? !!step2Value :
    !!(form.name && form.company && form.email && form.phone)

  const handleSubmit = () => {
    router.push("/")
  }

  return (
    <div
      className="min-h-screen bg-[#f7f9fd] flex flex-col items-center justify-center px-4 pt-28 pb-16"
      style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" }}
    >
      <SiteHeader />
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold tracking-widest text-[#1e4fa8] uppercase mb-3">Inquiry</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3">빠른 상담 접수</h1>
        <p className="text-slate-500 text-base">3단계만 입력하면 전문가가 빠르게 연락드립니다.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[#1e4fa8]">Step {step} of 3</span>
            <span className="text-sm text-slate-400">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1e4fa8] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">상담을 신청한 이유가 무엇인가요?</h2>
            <div className="flex flex-col gap-3">
              {STEP1_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200 ${
                    step1Value === opt
                      ? "border-[#1e4fa8] bg-[#eff6ff]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      step1Value === opt ? "border-[#1e4fa8]" : "border-slate-300"
                    }`}
                  >
                    {step1Value === opt && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1e4fa8]" />
                    )}
                  </span>
                  <input
                    type="radio"
                    className="sr-only"
                    name="step1"
                    value={opt}
                    checked={step1Value === opt}
                    onChange={() => setStep1Value(opt)}
                  />
                  <span className="text-sm font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">상담 신청이 처음이신가요?</h2>
            <div className="flex flex-col gap-3">
              {["예", "아니오"].map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer flex items-center gap-3 px-5 py-4 rounded-xl border transition-all duration-200 ${
                    step2Value === opt
                      ? "border-[#1e4fa8] bg-[#eff6ff]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      step2Value === opt ? "border-[#1e4fa8]" : "border-slate-300"
                    }`}
                  >
                    {step2Value === opt && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1e4fa8]" />
                    )}
                  </span>
                  <input
                    type="radio"
                    className="sr-only"
                    name="step2"
                    value={opt}
                    checked={step2Value === opt}
                    onChange={() => setStep2Value(opt)}
                  />
                  <span className="text-sm font-medium text-slate-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">회사의 정보를 알려주세요.</h2>
            <div className="flex flex-col gap-3">
              {[
                { key: "name",    placeholder: "이름" },
                { key: "company", placeholder: "회사명" },
                { key: "email",   placeholder: "이메일" },
                { key: "phone",   placeholder: "전화번호" },
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1e4fa8] focus:ring-2 focus:ring-[#1e4fa8]/10 transition-all"
                />
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="cursor-pointer px-6 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            이전
          </button>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
              className="cursor-pointer px-8 py-3 rounded-xl bg-[#1e4fa8] hover:bg-[#0f2d6e] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canNext}
              className="cursor-pointer px-8 py-3 rounded-xl bg-[#1e4fa8] hover:bg-[#0f2d6e] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              무료 상담 신청하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
