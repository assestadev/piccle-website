/**
 * PICCLE 자료집 신청 → 구글시트 저장용 Apps Script (웨비나 신청 스크립트와 별개)
 *
 * 설치 방법
 * 1. 새 구글 스프레드시트 생성 → 확장 프로그램 > Apps Script → 이 코드 전체 붙여넣기
 * 2. 프로젝트 설정 > 스크립트 속성 > SHARED_SECRET 추가 (임의의 긴 문자열)
 * 3. 편집기에서 setupSheet 함수를 한 번 실행 (downloads 탭 + 헤더 생성, 권한 승인)
 * 4. 배포 > 새 배포 > 유형: 웹 앱 / 실행: 나 / 액세스: 모든 사용자 → /exec URL 복사
 * 5. Vercel(및 .env.local)에 환경변수 등록
 *      GAS_DOWNLOAD_WEBAPP_URL   = 4번의 /exec URL
 *      GAS_DOWNLOAD_SHARED_SECRET = 2번의 SHARED_SECRET 값
 * ※ 코드를 수정하면 배포 관리 > 편집 > 버전: 새 버전으로 재배포해야 반영됨
 */

const SHEET_NAME = "downloads"
const HEADERS = [
  "신청ID", "신청일시", "신청자료", "이름", "회사명", "이메일", "연락처", "직무", "직책",
  "관심주제", "HR이슈", "개인정보동의", "마케팅동의",
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "메일발송상태",
]
const MAIL_STATUS_COL = HEADERS.indexOf("메일발송상태") + 1

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold")
  sheet.setFrozenRows(1)
  // 연락처(010...) 앞자리 0이 숫자로 바뀌지 않도록 전체를 일반 텍스트로
  sheet.getRange(1, 1, sheet.getMaxRows(), HEADERS.length).setNumberFormat("@")
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET")
    if (!secret || data.secret !== secret) return json({ status: "error", message: "unauthorized" })

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    if (!sheet) return json({ status: "error", message: "downloads 시트를 찾을 수 없습니다." })

    if (data.action === "append") return append(sheet, data)
    if (data.action === "updateMailStatus") return updateMailStatus(sheet, data)
    return json({ status: "error", message: "지원하지 않는 요청입니다." })
  } catch (err) {
    return json({ status: "error", message: String(err) })
  }
}

function append(sheet, d) {
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const now = new Date()
    const id = "D" + Utilities.formatDate(now, "Asia/Seoul", "yyMMddHHmmss") + Math.floor(Math.random() * 1000).toString().padStart(3, "0")
    const row = [
      id,
      Utilities.formatDate(now, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
      d.resourceTitle, d.name, d.company, d.email, d.phone, d.jobRole, d.position,
      d.interests, d.hrIssue,
      d.privacyAgreed ? "Y" : "N",
      d.marketingAgreed ? "Y" : "N",
      d.utm_source, d.utm_medium, d.utm_campaign, d.utm_content,
      "대기",
    ].map(safe)
    sheet.appendRow(row)
    return json({ status: "success", id: id })
  } finally {
    lock.releaseLock()
  }
}

function updateMailStatus(sheet, d) {
  if (!d.requestId) return json({ status: "error", message: "신청ID가 없습니다." })
  const cell = sheet.getRange("A:A").createTextFinder(d.requestId).matchEntireCell(true).findNext()
  if (!cell) return json({ status: "error", message: "해당 신청ID를 찾을 수 없습니다." })
  sheet.getRange(cell.getRow(), MAIL_STATUS_COL).setValue(safe(d.mailStatus))
  return json({ status: "success" })
}

// 입력값이 =, +, -, @ 로 시작하면 시트가 수식으로 실행하므로 앞에 ' 를 붙여 텍스트로 저장
function safe(value) {
  const text = value == null ? "" : String(value)
  return /^[=+\-@]/.test(text) ? "'" + text : text
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
