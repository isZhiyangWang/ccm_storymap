export function isUsableStoryMapUrl(url = "") {
  return /^https?:\/\//i.test(String(url).trim());
}

export function normalizeStoryMapUrl(url, defaults = {}) {
  if (!isUsableStoryMapUrl(url)) {
    return "";
  }

  const normalized = new URL(url);

  if (defaults.hideHeader && !normalized.searchParams.has("header")) {
    normalized.searchParams.set("header", "false");
  }

  if (defaults.hideCover && !normalized.searchParams.has("cover")) {
    normalized.searchParams.set("cover", "false");
  }

  return normalized.toString();
}
