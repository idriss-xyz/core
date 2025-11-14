/* eslint-disable unicorn/no-document-cookie */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = new RegExp(`(^| )${name}=([^;]+)`).exec(document.cookie);
  return match?.[2] ? decodeURIComponent(match[2]) : null;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`;
}

export function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; max-age=${maxAge}; path=/; SameSite=Lax`;
}
