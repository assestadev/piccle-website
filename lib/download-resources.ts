// PICCLE 자료집 신청(/seminar/downloadform) 자료 목록.
// 목록은 코드가 아니라 신청 DB 스프레드시트의 `resources` 탭에서 관리한다 — 담당자가 시트에 한 줄 추가/수정하면
// 폼의 "신청 자료" 선택지와 자동메일의 다운로드 링크가 함께 바뀐다 (Apps Script: 개발일지/download-form/gas-download.gs).
// 홍보메일 버튼 링크는 `/seminar/downloadform?topic=<slug>&utm_...` 형태로 만들면 해당 자료가 미리 선택된다.
// 신청 저장과 같은 Apps Script 웹앱·시크릿을 쓰므로 환경변수 추가는 없다. 서버 전용 모듈 — 클라이언트에서 import 금지.

export interface DownloadResource {
  slug: string
  /** 폼 선택지 · 자동메일 · 구글시트에 그대로 쓰이는 자료명 */
  title: string
  /** 회사 서버에 올린 PDF 주소 — 폼 화면에는 내려보내지 않고 API가 메일에 넣을 때만 사용 */
  pdfUrl: string
  /** false면 폼 선택지에서 숨김 (시트의 노출 = N) */
  active: boolean
}

// 의사결정 단계 기준 — 세부 직무는 별도 텍스트 항목(직무)으로 받음
export const DOWNLOAD_POSITION_OPTIONS = ["실무자 (팀원, HR 담당자 등)", "팀장 이상", "대표/임원", "기타"]

// 매 요청마다 시트를 읽으면 페이지가 느려지므로 1분간 재사용. 시트를 못 읽으면 마지막으로 성공한 목록을 계속 쓴다.
const CACHE_TTL_MS = 60_000
let cache: { fetchedAt: number; resources: DownloadResource[] } | null = null

// 시트의 입력 규칙과 같은 기준으로 한 번 더 거른다 — 규칙을 우회해 들어온 값(붙여넣기 등)이 메일로 나가지 않도록
function sanitize(raw: unknown): DownloadResource[] {
  if (!Array.isArray(raw)) return []
  const rows = raw.map((r) => ({
    slug: String(r?.slug ?? "").trim(),
    title: String(r?.title ?? "").trim(),
    pdfUrl: String(r?.pdfUrl ?? "").trim(),
    active: r?.active !== false,
  }))
  const slugCount = new Map<string, number>()
  rows.forEach((r) => slugCount.set(r.slug, (slugCount.get(r.slug) ?? 0) + 1))

  return rows.filter((r) => {
    // 오타 행(slug 규칙 위반, 빈 자료명, https가 아닌 링크)과 slug가 겹치는 행은 어느 쪽이 맞는지 알 수 없으므로 모두 제외
    const valid = /^[a-z0-9-]+$/.test(r.slug) && r.title && /^https:\/\/\S+$/.test(r.pdfUrl) && slugCount.get(r.slug) === 1
    if (!valid) console.error("자료 목록에서 형식이 맞지 않거나 중복된 행을 건너뜁니다:", { slug: r.slug, title: r.title })
    return valid
  })
}

async function loadResources(): Promise<DownloadResource[]> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) return cache.resources

  const url = process.env.GAS_DOWNLOAD_WEBAPP_URL
  const secret = process.env.GAS_DOWNLOAD_SHARED_SECRET
  if (!url || !secret) {
    console.error("GAS_DOWNLOAD_WEBAPP_URL / GAS_DOWNLOAD_SHARED_SECRET 환경변수가 없어 자료 목록을 불러오지 못했습니다.")
    return cache?.resources ?? []
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ secret, action: "listResources" }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    const data = await res.json()
    if (data?.status !== "success") throw new Error(data?.message ?? `HTTP ${res.status}`)
    const resources = sanitize(data.resources)
    cache = { fetchedAt: Date.now(), resources }
    return resources
  } catch (err) {
    console.error("자료 목록(resources 탭) 불러오기 실패 — 이전 목록을 사용합니다:", err)
    return cache?.resources ?? []
  }
}

export async function getActiveDownloadResources() {
  return (await loadResources()).filter((r) => r.active)
}

export async function getDownloadResource(slug: string | undefined) {
  return (await loadResources()).find((r) => r.slug === slug && r.active)
}
