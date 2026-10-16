// PICCLE 자료집 신청(/seminar/downloadform) 설정.
// 새 자료집을 추가할 때는 이 배열에 항목만 추가하면 된다 — 폼의 "신청 자료" 선택지, 자동메일의 다운로드 링크가
// 모두 여기서 결정된다. 홍보메일 버튼 링크는 `/seminar/downloadform?topic=<slug>&utm_...` 형태로 만들면
// 해당 자료가 미리 선택된 상태로 열린다.

export interface DownloadResource {
  slug: string
  /** 폼 선택지 · 자동메일 · 구글시트에 그대로 쓰이는 자료명 */
  title: string
  /** 회사 서버에 올린 PDF 주소 — 폼 화면에는 내려보내지 않고 API가 메일에 넣을 때만 사용 */
  pdfUrl: string
  /** false면 폼 선택지에서 숨김 (지난 자료 정리용) */
  active: boolean
}

export const downloadResources: DownloadResource[] = [
  {
    slug: "piccle-hour-3",
    title: "PICCLE HOUR #3 세미나 자료집",
    // TODO: 실제 PDF 업로드 후 교체 — 지금은 테스트용 임시 링크
    pdfUrl: "https://hr.assesta.com/seminar",
    active: true,
  },
]

// 의사결정 단계 기준 — 세부 직무는 별도 텍스트 항목(직무)으로 받음
export const DOWNLOAD_POSITION_OPTIONS = ["실무자 (팀원, HR 담당자 등)", "팀장 이상", "대표/임원", "기타"]

export function getActiveDownloadResources() {
  return downloadResources.filter((r) => r.active)
}

export function getDownloadResource(slug: string | undefined) {
  return downloadResources.find((r) => r.slug === slug && r.active)
}
