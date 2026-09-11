interface WebinarConfirmationEmailInput {
  applicantName: string
  seminarTitle: string
  seminarTypeLabel: string
  categoryTag: string
  eventDate: string
}

export function buildWebinarConfirmationEmail({
  applicantName,
  seminarTitle,
  seminarTypeLabel,
  categoryTag,
  eventDate,
}: WebinarConfirmationEmailInput) {
  const subject = `[PICCLE 세미나] ${seminarTitle} 신청이 완료되었습니다`

  const html = `
<div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #15172b;">
  <p style="font-size: 13px; font-weight: 700; color: #2f5eff; letter-spacing: 0.05em; margin: 0 0 12px;">PICCLE SEMINAR</p>
  <h1 style="font-size: 20px; font-weight: 700; margin: 0 0 16px; line-height: 1.4;">${applicantName}님, 신청이 완료되었습니다</h1>
  <p style="font-size: 14px; line-height: 1.6; color: #6d7180; margin: 0 0 24px;">
    요청하신 세미나 신청이 정상적으로 접수되었습니다. 웨비나 하루 전, 이 이메일 주소로 참여 링크를 보내드릴게요.
  </p>
  <table style="width: 100%; border-collapse: collapse; background: #f9f9f9; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
    <tr>
      <td style="padding: 16px 20px; font-size: 12px; font-weight: 700; color: #2f5eff; background: #eef1fb;">${categoryTag}</td>
      <td style="padding: 16px 20px; font-size: 12px; color: #6d7180; background: #eef1fb; text-align: right;">${seminarTypeLabel}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 16px 20px 4px; font-size: 16px; font-weight: 700; color: #15172b;">${seminarTitle}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding: 0 20px 16px; font-size: 14px; color: #6d7180;">${eventDate}</td>
    </tr>
  </table>
  <p style="font-size: 12px; line-height: 1.6; color: #9296a6; margin: 0;">
    본 메일은 PICCLE 세미나 신청 확인을 위해 발송되었습니다. 문의사항은 assesta@assesta.com으로 연락 주세요.
  </p>
</div>
`.trim()

  return { subject, html }
}
