export function publicAssetUrl(path = "") {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:")) {
    return path;
  }

  const basePath = import.meta.env.BASE_URL || "/";
  return `${basePath}${String(path).replace(/^\/+/, "")}`;
}
