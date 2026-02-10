/**
 * Rewrites HTTP image URLs to go through the backend proxy,
 * avoiding mixed content issues on HTTPS sites.
 */
export function getImageUrl(url: string | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://')) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`
  }
  return url
}
