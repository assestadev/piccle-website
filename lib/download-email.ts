import { PICCLE_LOGO_URL, escapeHtml } from "@/lib/seminar-confirmation-email"

interface DownloadEmailInput {
  applicantName: string
  /** 신청한 자료 목록 — 여러 개면 메일 한 통에 자료마다 다운로드 버튼이 하나씩 들어간다 */
  resources: { title: string; pdfUrl: string }[]
}

// Outlook에서도 깨지지 않도록 배경색을 <td>에 준 테이블 버튼
function buttonRow(url: string, label: string, paddingBottom: number) {
  return `
                        <tr>
                            <td style="padding-bottom: ${paddingBottom}px;">
                                <table cellpadding="0" cellspacing="0" style="width: 100%;">
                                    <tr>
                                        <td align="center" bgcolor="#222222" style="border-radius: 10px; background-color: #222222;">
                                            <a href="${url}" target="_blank" style="display: block; padding: 16px 20px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">${label}</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>`
}

// 자료집 신청 자동메일 — 웨비나 신청완료 메일(seminar-confirmation-email.ts)과 같은 레이아웃에
// 일정 박스 대신 다운로드 버튼만 넣었다.
export function buildDownloadEmail({ applicantName, resources }: DownloadEmailInput) {
  const single = resources.length === 1
  const subject = single
    ? `[PICCLE] 신청하신 ${resources[0].title}을 보내드려요`
    : `[PICCLE] 신청하신 자료집 ${resources.length}종을 보내드려요`

  const name = escapeHtml(applicantName)
  const guide = single
    ? `아래 버튼을 눌러 <b>${escapeHtml(resources[0].title)}</b>을 다운로드해 주세요.`
    : "아래 버튼을 눌러 신청하신 자료집을 각각 다운로드해 주세요."
  const buttons = single
    ? buttonRow(escapeHtml(resources[0].pdfUrl), "PICCLE 자료집 보기", 30)
    : resources
        .map(
          (r, i) => `
                        <tr><td style="padding-bottom: 8px; font-size: 15px; font-weight: 700; color: #222222; line-height: 150%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">${escapeHtml(r.title)}</td></tr>${buttonRow(escapeHtml(r.pdfUrl), "자료집 보기", i === resources.length - 1 ? 30 : 20)}`,
        )
        .join("")

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PICCLE 자료집 신청 완료 안내</title>
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
                    <img src="${PICCLE_LOGO_URL}" alt="PICCLE" width="180" style="image-rendering: -webkit-optimize-contrast; -webkit-user-drag: none; display: block; width: 180px; max-width: 100%; border: 0;" />
                </td>
            </tr>
            <tr>
                <td style="background-color: #fff; padding: 0 20px;">
                    <table cellpadding="0" cellspacing="0" style="width: 100% !important; max-width: 640px; margin: 0; padding: 0;">
                        <tr><td style="padding-bottom: 20px; font-size: 20px; font-weight: 700; color: #222222; line-height: 140%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">PICCLE 자료집 신청 완료 안내</td></tr>
                        <tr><td style="padding-bottom: 30px; line-height: 0; font-size: 0;"><div style="height: 0; line-height: 0; font-size: 0; border-top: 1px solid #ececec;">&nbsp;</div></td></tr>
                        <tr><td style="padding-bottom: 4px; font-size: 16px; font-weight: 400; color: #222222; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">${name}님, PICCLE 자료집을 신청해주셔서 감사합니다.</td></tr>
                        <tr><td style="padding-bottom: 30px; font-size: 16px; font-weight: 400; color: #222222; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">${guide}</td></tr>
${buttons}
                        <tr><td style="padding-bottom: 30px; font-size: 16px; font-weight: 400; color: #222222; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">감사합니다.</td></tr>
                        <tr><td style="padding-bottom: 30px; font-size: 14px; font-weight: 400; color: #999999; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">문의 | 오경민 책임 연구원(kmoh@assesta.com)</td></tr>
                        <tr><td style="padding-bottom: 50px; text-align: center; font-size: 13px; font-weight: 400; color: #999999; line-height: 160%; font-family: 'Pretendard Variable', Pretendard, sans-serif!important;">PICCLE 자료집 신청자분들께 발송 드리는 메시지입니다.</td></tr>
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
