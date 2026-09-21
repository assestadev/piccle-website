interface SeminarConfirmationEmailInput {
  applicantName: string
  seminarTitle: string
  speaker: string
  eventDate: string
  location: string
  audience: string
  /** "10월 15일 목요일 오후 2시" 형태로 이미 포맷된 마지막 인사말용 일시 (lib/seminars.ts의 getSeminarEmailFields 참고) */
  closingDate: string
  /** "PICCLE HOUR #1 신청 완료 안내" 형태로 이미 계산된 제목 문구 (lib/seminars.ts의 getSeminarEmailFields 참고) */
  emailHeading: string
}

// PICCLE 로고. Outlook 데스크톱은 인라인 SVG를 렌더링하지 못하므로 인라인 SVG 대신 CDN PNG를 <img>로 사용.
const PICCLE_LOGO_URL = "https://img.assesta.com/piccle/logo.png"

// XSS/레이아웃 깨짐 방지 — 신청자 입력값(이름 등)이 그대로 HTML에 삽입되므로 이스케이프 필수.
function escapeHtml(value: string) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function buildSeminarConfirmationEmail({
  applicantName,
  seminarTitle,
  speaker,
  eventDate,
  location,
  audience,
  closingDate,
  emailHeading,
}: SeminarConfirmationEmailInput) {
  const subject = `[PICCLE 세미나] ${seminarTitle} 신청이 완료되었습니다`

  const name = escapeHtml(applicantName)
  const title = escapeHtml(seminarTitle)
  const speakerText = escapeHtml(speaker)
  const dateText = escapeHtml(eventDate)
  const locationText = escapeHtml(location)
  const audienceText = escapeHtml(audience)
  const closingDateText = escapeHtml(closingDate)
  const headingText = escapeHtml(emailHeading)

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${headingText}</title>
<link rel="preconnect" href="https://fonts.gstatic.com">
<link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />
<style>
    body, input, textarea, select {font-family: "Pretendard Variable", Pretendard, sans-serif;}
</style>
</head>
<body>
    <div style="width: 100%; margin: 0; padding: 0; background-color: #ffffff; font-family: 'Pretendard Variable', Pretendard, sans-serif;">
        <table cellpadding="0" cellspacing="0" style="width: 100%; max-width: 640px; margin: 0 auto; padding: 0; padding-bottom: 50px; table-layout: fixed; font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif; letter-spacing: -0.4px;">
            <tr>
                <td style="padding: 50px 20px 34px; line-height: 0;">
                    <img src="${PICCLE_LOGO_URL}" alt="PICCLE HOUR" width="180" style="image-rendering: -webkit-optimize-contrast; -webkit-user-drag: none; display: block; width: 180px; max-width: 100%; border: 0;" />
                </td>
            </tr>
            <tr>
                <td style="background-color: #fff; padding: 0 20px;">
                    <table cellpadding="0" cellspacing="0" style="width: 100% !important; max-width: 640px; margin: 0; padding: 0;">
                        <tr><td style="padding-bottom: 20px; font-size: 20px; font-weight: 700; color: #222222; line-height: 140%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">${headingText}</td></tr>
                        <tr><td style="padding-bottom: 30px; line-height: 0; font-size: 0;"><div style="height: 0; line-height: 0; font-size: 0; border-top: 1px solid #ececec;">&nbsp;</div></td></tr>
                        <tr><td style="padding-bottom: 4px; font-size: 16px; font-weight: 400; color: #222222; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">${name}님의, 웨비나 신청이 정상적으로 완료되었습니다.</td></tr>
                        <tr><td style="padding-bottom: 30px; font-size: 16px; font-weight: 400; color: #222222; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">아래 일정을 확인해 주세요.</td></tr>
                        <tr>
                            <td style="padding-bottom: 30px;">
                                <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f2f9fd; border-radius: 12px;">
                                    <tr>
                                        <td style="padding: 22px 24px; font-size: 15px; font-weight: 400; color: #222222; line-height: 180%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">
                                            <table cellpadding="0" cellspacing="0" style="width:100%;">
                                                <tr>
                                                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 14px;">·</td>
                                                    <td style="padding: 2px 0;"><b>주제</b>&nbsp;ㅣ&nbsp;${title}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 14px;">·</td>
                                                    <td style="padding: 2px 0;"><b>연사</b>&nbsp;ㅣ&nbsp;${speakerText}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 14px;">·</td>
                                                    <td style="padding: 2px 0;"><b>일시</b>&nbsp;ㅣ&nbsp;${dateText}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 14px;">·</td>
                                                    <td style="padding: 2px 0;"><b>장소</b>&nbsp;ㅣ&nbsp;${locationText}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 2px 8px 2px 0; vertical-align: top; width: 14px;">·</td>
                                                    <td style="padding: 2px 0;"><b>대상</b>&nbsp;ㅣ&nbsp;${audienceText}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr><td style="padding-bottom: 4px; font-size: 14px; font-weight: 400; color: #999999; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">※ 접속 링크는 웨비나 D-1에 메일과 문자로 다시 안내드릴 예정입니다.</td></tr>
                        <tr><td style="padding-bottom: 30px; font-size: 14px; font-weight: 400; color: #999999; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">※ 본인이 아닌 경우, 입장에 제한이 있을 수 있습니다.</td></tr>
                        <tr><td style="padding-bottom: 4px; font-size: 16px; font-weight: 400; color: #222222; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">${closingDateText}, 웨비나에서 뵙겠습니다.</td></tr>
                        <tr><td style="padding-bottom: 30px; font-size: 16px; font-weight: 400; color: #222222; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">PICCLE 팀 드림</td></tr>
                        <tr><td style="padding-bottom: 30px; font-size: 14px; font-weight: 400; color: #999999; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">문의 | 오경민 책임 연구원(kmoh@assesta.com)</td></tr>
                        <tr><td style="padding-bottom: 50px; text-align: center; font-size: 13px; font-weight: 400; color: #999999; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">PICCLE 웨비나 사전 등록 신청자분들께 발송 드리는 메시지입니다.</td></tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
`.trim()

  return { subject, html }
}
