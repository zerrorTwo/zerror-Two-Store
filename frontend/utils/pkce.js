import { sha256 } from "js-sha256";

// Hàm mã hóa base64url (đã đúng trong code của bạn)
function base64urlEncode(input) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(input)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const base64String = btoa(String.fromCharCode(...array));
  return base64urlEncode(base64String);
}

export async function generateCodeChallenge(verifier) {
  // Chuyển verifier thành ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  // Tạo hash SHA-256 dưới dạng ArrayBuffer
  const hashed = sha256.arrayBuffer(data);
  // Mã hóa base64url
  return base64urlEncode(hashed);
}
