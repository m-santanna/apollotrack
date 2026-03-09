import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AIProvider } from "@/lib/types";

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60; // 604800

/** Per-provider cookie name: session-openai or session-gemini */
function cookieName(provider: AIProvider): string {
  return `session-${provider}`;
}

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing SESSION_SECRET environment variable");
  }
  return new TextEncoder().encode(secret);
}

/**
 * Create a signed JWT containing the session ID and provider.
 */
export async function createSessionToken(
  sessionId: string,
  provider: AIProvider,
): Promise<string> {
  return new SignJWT({ sid: sessionId, provider })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

/**
 * Verify a JWT and return the session ID, or null if invalid/expired.
 */
export async function verifySessionToken(
  token: string,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return (payload.sid as string) ?? null;
  } catch {
    return null;
  }
}

/**
 * Read the provider-specific session cookie and return the session ID.
 * Returns null if no cookie or invalid JWT.
 */
export async function getSessionFromRequest(
  provider: AIProvider,
): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(cookieName(provider));
  if (!cookie?.value) return null;
  return verifySessionToken(cookie.value);
}

/**
 * Set the provider-specific session cookie on a NextResponse.
 */
export function setSessionCookie(
  response: NextResponse,
  token: string,
  provider: AIProvider,
): NextResponse {
  response.cookies.set(cookieName(provider), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SEVEN_DAYS_SECONDS,
    path: "/",
  });
  return response;
}

/**
 * Delete the provider-specific session cookie.
 */
export function clearSessionCookie(
  response: NextResponse,
  provider: AIProvider,
): NextResponse {
  response.cookies.delete(cookieName(provider));
  return response;
}
