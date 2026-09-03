const LOCAL_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"] as const;

const BITBIRR_ORIGINS = [
  "https://bitbirr.net",
  "https://www.bitbirr.net",
  "https://*.bitbirr.net",
] as const;

const BITBIRR_HOSTS = ["localhost:3000", "127.0.0.1:3000", "bitbirr.net", "www.bitbirr.net", "*.bitbirr.net"] as const;

export function envTrustedOrigins() {
  return (process.env.BETTER_AUTH_TRUSTED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

export function defaultTrustedOrigins() {
  return [...LOCAL_ORIGINS, ...BITBIRR_ORIGINS, ...envTrustedOrigins()];
}

export function allowedAuthHosts() {
  const extra = envTrustedOrigins()
    .map((origin) => {
      try {
        return new URL(origin).host;
      } catch {
        return origin.replace(/^https?:\/\//, "");
      }
    })
    .filter(Boolean);
  return [...BITBIRR_HOSTS, ...extra];
}

export function isAllowedAuthOrigin(origin: string) {
  if (!origin) return false;
  return defaultTrustedOrigins().some((trusted) => matchesOriginPattern(origin, trusted));
}

export function corsHeadersForOrigin(origin: string) {
  if (!isAllowedAuthOrigin(origin)) {
    return new Headers();
  }
  return new Headers({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    Vary: "Origin",
  });
}

function matchesOriginPattern(origin: string, pattern: string) {
  if (!pattern.includes("*")) {
    return origin === pattern;
  }
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^.]+");
  return new RegExp(`^${escaped}$`).test(origin);
}
