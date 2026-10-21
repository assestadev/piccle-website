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
 * 6. setupResourcesSheet 함수를 한 번 실행 (resources 탭 = 자료 목록 생성)
 * ※ 코드를 수정하면 배포 관리 > 편집(연필) > 버전: 새 버전 으로 재배포해야 반영됨
 *   ("새 배포"를 누르면 URL이 바뀌어 Vercel 값을 다시 등록해야 하므로 주의)
 *
 * 자료 목록(resources 탭) 관리 — 담당자가 직접 편집
 *   slug     : 자료명을 입력하면 doc-001 형식으로 자동 생성 (직접 입력·수정하지 말 것)
 *   신청 링크 : slug로 자동 완성되는 신청 페이지 주소 — 여기에 UTM을 붙여 단축링크를 만든다
 *   자료명   : 폼 선택지 · 자동메일 · 신청 DB에 표시되는 이름
 *   pdfUrl   : 자동메일 다운로드 버튼 링크 (https:// 로 시작)
 *   노출     : Y = 폼에 표시, N = 숨김
 *   사이트에는 최대 1분 뒤 반영됨
 */

const SHEET_NAME = "downloads"
const RESOURCES_SHEET_NAME = "resources"
const RESOURCES_HEADERS = ["slug", "자료명", "pdfUrl", "노출", "메모", "신청 링크"]
const FORM_BASE_URL = "https://hr.assesta.com/seminar/downloadform"

// 자료명을 입력하면 slug를 자동으로 채운다 (간단 트리거 — 별도 설치 불필요)
function onEdit(e) {
  const range = e && e.range
  if (!range || range.getSheet().getName() !== RESOURCES_SHEET_NAME) return
  const sheet = range.getSheet()
  ensureLinkFormula(sheet)
  for (let row = range.getRow(); row < range.getRow() + range.getNumRows(); row++) {
    if (row < 2) continue
    const slugCell = sheet.getRange(row, 1)
    const title = String(sheet.getRange(row, 2).getValue()).trim()
    const slug = String(slugCell.getValue()).trim()
    if (title && !slug) {
      slugCell.setValue(nextSlug(sheet))
    } else if (slug && countSlug(sheet, slug) > 1) {
      // 줄을 복사·붙여넣기 하면 입력 규칙을 거치지 않고 slug가 그대로 복제됨 — 방금 고친 줄에 새 번호를 붙인다
      const fresh = nextSlug(sheet)
      slugCell.setValue(fresh).setNote("다른 줄과 slug(" + slug + ")가 겹쳐서 " + fresh + " 로 자동 변경했습니다.")
    }
  }
}

function countSlug(sheet, slug) {
  const lastRow = Math.max(sheet.getLastRow(), 2)
  return sheet.getRange(2, 1, lastRow - 1, 1).getValues().filter(function (r) { return String(r[0]).trim() === slug }).length
}

// 시트에 남아 있는 doc- 번호 중 가장 큰 번호 + 1 (위에서부터 1, 2, 3… 순서로 매겨짐)
function nextSlug(sheet) {
  // 이전 버전이 남긴 '기억해 둔 번호'가 있으면 지운다 — 번호는 시트에 보이는 값만 기준으로 한다
  sheet.getDeveloperMetadata().forEach(function (m) { if (m.getKey() === 'lastSlugNo') m.remove() })
  const lastRow = Math.max(sheet.getLastRow(), 2)
  const max = sheet.getRange(2, 1, lastRow - 1, 1).getValues().reduce(function (acc, r) {
    const m = String(r[0]).match(/^doc-(\d+)$/)
    return m ? Math.max(acc, Number(m[1])) : acc
  }, 0)
  return 'doc-' + String(max + 1).padStart(3, '0')
}

// 신청 링크 칸(F열)은 F2 한 칸의 수식이 아래 줄까지 채운다 — 셀 정리 중 지워졌으면 다시 넣는다
function ensureLinkFormula(sheet) {
  const cell = sheet.getRange("F2")
  if (!cell.getFormula()) {
    cell.setFormula('=ARRAYFORMULA(IF(A2:A="","","' + FORM_BASE_URL + '?topic="&A2:A))')
  }
}
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

// resources 탭(자료 목록) + 사용방법 탭 생성. 여러 번 실행해도 기존 데이터는 지워지지 않음
function setupResourcesSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName(RESOURCES_SHEET_NAME) || ss.insertSheet(RESOURCES_SHEET_NAME)
  sheet.getRange(1, 1, 1, RESOURCES_HEADERS.length).setValues([RESOURCES_HEADERS]).setFontWeight("bold").setBackground("#eef1fb")
  sheet.setFrozenRows(1)
  if (sheet.getLastRow() < 2) {
    sheet.getRange(2, 1, 1, 5).setValues([[
      "piccle-hour-3", "PICCLE HOUR #3 세미나 자료집", "https://hr.assesta.com/seminar", "Y", "pdfUrl은 실제 PDF 주소로 교체",
    ]])
  }

  // 머리글에 마우스를 올리면 보이는 설명
  sheet.getRange("A1").setNote("자료명을 입력하면 자동으로 채워집니다 (doc-001 형식)\n직접 입력하거나 수정하지 마세요")
  sheet.getRange("F1").setNote("자동 완성되는 신청 페이지 주소\n이 주소에 UTM을 붙여 단축링크를 만드세요")
  // 신청 링크 칸은 수식으로 자동 완성
  ensureLinkFormula(sheet)
  sheet.getRange(2, 6, sheet.getMaxRows() - 1, 1).setFontColor("#2f5eff")
  sheet.getRange("B1").setNote("폼 선택지·자동메일·신청 DB에 보이는 이름. 언제든 수정 가능")
  sheet.getRange("C1").setNote("자동메일 다운로드 버튼 링크. https:// 로 시작해야 함\n수정 후에는 반드시 테스트 신청 1건으로 링크 확인")
  sheet.getRange("D1").setNote("Y = 신청 가능, N = 마감\n여러 자료를 동시에 Y로 둬도 각 신청 링크는 자기 자료만 보여 줍니다")

  // 입력 규칙 — 규칙에 맞지 않는 값은 저장 자체가 거부됨
  const rows = sheet.getMaxRows() - 1
  const reject = function (builder, help) { return builder.setAllowInvalid(false).setHelpText(help).build() }
  sheet.getRange(2, 1, rows, 1).setDataValidation(reject(
    SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=AND(REGEXMATCH(A2,"^[a-z0-9-]+$"),COUNTIF($A$2:$A,A2)=1)'),
    "영문 소문자·숫자·하이픈(-)만 쓸 수 있고, 다른 줄과 겹치면 안 됩니다."))
  sheet.getRange(2, 3, rows, 1).setDataValidation(reject(
    SpreadsheetApp.newDataValidation().requireFormulaSatisfied('=REGEXMATCH(C2,"^https://[^ ]+$")'),
    "https:// 로 시작하는 주소만 입력할 수 있습니다 (띄어쓰기 불가)."))
  sheet.getRange(2, 4, rows, 1).setDataValidation(reject(
    SpreadsheetApp.newDataValidation().requireValueInList(["Y", "N"], true),
    "Y 또는 N만 선택할 수 있습니다."))

  // slug 칸을 고치려 하면 경고창이 뜸 (이미 발송된 링크가 깨지는 것을 방지)
  sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) { if (p.getDescription() === "slug") p.remove() })
  sheet.getRange(2, 1, rows, 1).protect().setDescription("slug").setWarningOnly(true)

  // 신청 링크 칸은 수식이 들어 있으므로 덮어쓰지 않도록 경고
  sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) { if (p.getDescription() === "신청 링크") p.remove() })
  sheet.getRange(2, 6, rows, 1).protect().setDescription("신청 링크").setWarningOnly(true)

  sheet.setColumnWidth(1, 110); sheet.setColumnWidth(2, 260); sheet.setColumnWidth(3, 320); sheet.setColumnWidth(4, 60); sheet.setColumnWidth(5, 200); sheet.setColumnWidth(6, 420)
  setupGuideSheet()
}

function setupGuideSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = ss.getSheetByName("사용방법") || ss.insertSheet("사용방법")
  sheet.clear()
  const lines = [
    ["PICCLE 자료집 신청 DB 사용방법"],
    [""],
    ["■ 탭 구성"],
    ["downloads : 신청자 DB (자동 저장). 직접 수정하지 마세요. 정렬·필터는 괜찮습니다."],
    ["resources : 자료 목록. 이 탭만 담당자가 수정합니다."],
    [""],
    ["■ 새 자료집으로 바꾸는 순서"],
    ["1. PDF를 회사 서버에 올리고 https:// 로 시작하는 주소를 확인 (브라우저에서 열리는지 확인)"],
    ["2. resources 탭 빈 줄에 자료명 / pdfUrl / 노출 = Y 입력 (slug·신청 링크는 자동으로 채워짐)"],
    ["3. 기존 자료를 더 이상 받지 않을 때만 노출을 N 으로 변경 (줄은 지우지 말 것. N이 되면 그 자료의 옛 링크는 마감 안내가 뜸)"],
    ["4. 1분 기다린 뒤, 신청 페이지에서 본인 메일로 테스트 신청 1건"],
    ["5. 받은 메일의 다운로드 버튼이 맞는 PDF를 여는지 확인"],
    ["6. 확인 후 '신청 링크' 칸의 주소를 복사 → UTM을 붙여 단축링크로 만들어 발송"],
    [""],
    ["■ 꼭 지켜 주세요"],
    ["- slug 와 신청 링크 칸은 자동입니다. 직접 입력하거나 고치지 마세요. 이름을 바꾸고 싶으면 자료명만 고치세요."],
    ["- 신청 링크 칸(F열)에는 아무것도 입력하지 마세요. 값이 들어가면 링크가 멈춥니다. 비어 있으면 아무 자료명이나 다시 입력하면 복구됩니다."],
    ["- slug 번호는 시트에 남아 있는 doc- 번호 다음부터 매겨집니다. 홍보메일에 쓴 자료 줄을 지우면 그 번호가 새 자료에 다시 쓰일 수 있으니, 발송한 자료는 지우지 말고 노출 = N 으로만 숨기세요."],
    ["- 줄을 복사해 붙여넣어 slug 가 겹치면, 붙여넣은 줄에 새 번호가 자동으로 붙고 메모가 남습니다."],
    ["- 자료 줄은 삭제하지 말고 노출 = N 으로 숨기세요. (지난 신청 기록과 연결됩니다)"],
    ["- 여러 자료를 동시에 Y로 둬도 됩니다. 각 신청 링크는 자기 자료만 보여 줍니다."],
    ["- pdfUrl 을 바꾼 뒤에는 반드시 테스트 신청 1건으로 링크를 확인하세요."],
    ["- 이 파일은 개인정보가 들어 있습니다. '링크가 있는 모든 사용자' 공유는 금지, 담당자만 편집자로 추가하세요."],
    [""],
    ["■ 잘못 나갔을 때"],
    ["- resources 탭을 올바르게 고치면 1분 안에 이후 신청자부터 바로 반영됩니다."],
    ["- 이미 발송된 메일은 회수할 수 없습니다. downloads 탭에서 해당 시간대 신청자를 필터해 정정 메일을 보내세요."],
    ["- 실수로 고친 내용은 '파일 > 버전 기록'에서 이전 상태를 확인·복원할 수 있습니다."],
    [""],
    ["■ 반영 규칙 (자동)"],
    ["- 형식이 틀린 줄(slug 규칙 위반, 중복 slug, https 가 아닌 주소)은 신청 페이지에 나타나지 않습니다."],
    ["- 신청 링크(topic 포함)로 들어오면 그 자료만 고정으로 표시되고 다른 자료로 바꿀 수 없습니다."],
    ["- 그 자료가 N(마감)이면 다른 자료로 바뀌지 않고 마감 안내가 뜹니다."],
    ["- 링크 하나로 여러 자료를 보여 주려면 topic=doc-001,doc-002 처럼 쉼표로 이어 쓰세요. 신청자가 원하는 것을 골라 메일 한 통으로 받습니다."],
    ["- topic 없이 들어오면 노출 = Y 인 자료 중에서 고르게 됩니다 (1개면 그 자료만 표시)."],
    ["- 노출 칸이 비어 있으면 N 과 똑같이 숨김 처리됩니다. 신청을 받으려면 반드시 Y 를 선택하세요."],
    ["- 시트를 잠시 못 읽으면 마지막으로 정상이었던 목록을 계속 사용합니다."],
  ]
  sheet.getRange(1, 1, lines.length, 1).setValues(lines)
  sheet.getRange("A1").setFontSize(14).setFontWeight("bold")
  // ■ 로 시작하는 소제목만 굵게 (문구를 추가해도 위치가 어긋나지 않도록 내용으로 찾음)
  lines.forEach(function (line, i) { if (String(line[0]).indexOf("■") === 0) sheet.getRange(i + 1, 1).setFontWeight("bold") })
  sheet.setColumnWidth(1, 820)
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET")
    if (!secret || data.secret !== secret) return json({ status: "error", message: "unauthorized" })

    if (data.action === "listResources") return listResources()

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

function listResources() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RESOURCES_SHEET_NAME)
  if (!sheet) return json({ status: "error", message: "resources 시트를 찾을 수 없습니다." })
  const lastRow = sheet.getLastRow()
  const rows = lastRow < 2 ? [] : sheet.getRange(2, 1, lastRow - 1, 4).getDisplayValues()
  const resources = rows
    .filter(function (r) { return String(r[0]).trim() })
    .map(function (r) {
      return {
        slug: String(r[0]).trim(),
        title: String(r[1]).trim(),
        pdfUrl: String(r[2]).trim(),
        // Y일 때만 노출 — 빈칸·오타는 숨김 처리 (입력 중인 줄이 실수로 노출되지 않도록)
        active: String(r[3]).trim().toUpperCase() === "Y",
      }
    })
  return json({ status: "success", resources: resources })
}

// 입력값이 =, +, -, @ 로 시작하면 시트가 수식으로 실행하므로 앞에 ' 를 붙여 텍스트로 저장
function safe(value) {
  const text = value == null ? "" : String(value)
  return /^[=+\-@]/.test(text) ? "'" + text : text
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
