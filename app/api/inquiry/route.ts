import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, company, phone, email, privacy_agreed, org_type, purposes, programs, timeline, referral_sources, message } = body

    if (!name || !company || !phone || !email) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name,
          company,
          phone,
          email,
          privacy_agreed: privacy_agreed ?? true,
          org_type,
          purposes,
          programs,
          timeline,
          referral_sources,
          message: message || null,
          // 운영(Vercel production) 외 환경(devpage, 로컬)에서 제출된 문의는 테스트로 표기
          is_test: process.env.VERCEL_ENV !== 'production',
        },
      ])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: '데이터 저장 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
