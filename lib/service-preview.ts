const servicePreviewFlag = process.env.NEXT_PUBLIC_SERVICE_PREVIEW === "true"

export function isServicePreviewEnabledForHost(_hostname?: string | null) {
  return servicePreviewFlag
}
