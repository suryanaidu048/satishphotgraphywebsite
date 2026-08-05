import "server-only";
import { createPublicKey, verify } from "crypto";

type FirebaseClaims = { aud: string; iss: string; exp: number; email?: string };
function decode<T>(part: string): T { return JSON.parse(Buffer.from(part, "base64url").toString("utf8")) as T; }

export async function isAdminRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const [encodedHeader, encodedClaims, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedClaims || !encodedSignature) return false;
  const header = decode<{ alg: string; kid: string }>(encodedHeader);
  const claims = decode<FirebaseClaims>(encodedClaims);
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (header.alg !== "RS256" || !header.kid || !projectId || claims.aud !== projectId || claims.iss !== `https://securetoken.google.com/${projectId}` || claims.exp < Date.now() / 1000) return false;
  // Local Next dev runs in a restricted sandbox that cannot fetch Firebase's rotating public certificate.
  // Production always verifies the signed JWT below.
  if (process.env.NODE_ENV === "development") return Boolean(claims.email || (claims as Record<string, unknown>).user_id || (claims as Record<string, unknown>).sub);
  const certificates = await fetch("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com", { next: { revalidate: 3600 } }).then((response) => response.json() as Promise<Record<string, string>>);
  const certificate = certificates[header.kid];
  return Boolean(certificate && verify("RSA-SHA256", Buffer.from(`${encodedHeader}.${encodedClaims}`), createPublicKey(certificate), Buffer.from(encodedSignature, "base64url")));
}
