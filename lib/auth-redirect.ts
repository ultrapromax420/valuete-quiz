const SAFE_NEXT_PATHS = [
  "/participate",
  "/vote",
  "/referrals",
  "/rewards",
];

export function getSafeNextPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/participate";
  }

  if (SAFE_NEXT_PATHS.includes(value)) {
    return value;
  }

  return "/participate";
}
