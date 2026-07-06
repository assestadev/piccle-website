const servicePreviewEnabled = process.env.NEXT_PUBLIC_SERVICE_PREVIEW === "true"
const servicePreviewMode = process.env.SERVICE_PREVIEW_MODE === "preview"

export function isServicePreviewEnabled() {
  return servicePreviewEnabled
}

export function isServicePreviewEnabledForHost(_hostname?: string | null) {
  return isServicePreviewEnabled()
}

export function isServicePreviewEnabledOnServer() {
  return servicePreviewMode || servicePreviewEnabled
}
