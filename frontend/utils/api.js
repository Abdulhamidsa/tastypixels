export const getApiUrl = (path) => {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/tastypixels";
  return `${base}${path.startsWith("/") ? path : "/" + path}`;
};
