/** Decode the HTML entities the Carbon ad server is known to return.
 *  This is intentionally not a full HTML decoder — only the entities
 *  that actually appear in ad copy are handled.
 */
export function htmlDecode(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

/** Ensure a URL uses HTTPS */
export function ensureHttps(url: string): string {
  return url.replace(/^http:\/\//i, "https://");
}

/** Replace [timestamp] token in URLs */
export function applyTimestamp(url: string): string {
  return url.replace(/\[timestamp\]/g, String(Date.now()));
}
