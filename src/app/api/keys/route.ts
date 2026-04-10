import { NextRequest, NextResponse } from "next/server";
import {
  storeAPIKey,
  getAPIKey,
  deleteAPIKey,
  hasAPIKey,
  refreshAPIKeyTTL,
} from "@/lib/redis";
import {
  createSessionToken,
  getSessionFromRequest,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/session";
import type { AIProvider } from "@/lib/types";

const PROVIDERS: AIProvider[] = ["openai"];

// GET /api/keys
// Returns key status for the openai provider.
// Auto-refreshes the Redis TTL and cookie for any active key found.
export async function GET() {
  const openaiSessionId = await getSessionFromRequest("openai");
  const openaiExists = openaiSessionId
    ? await hasAPIKey(openaiSessionId, "openai")
    : false;

  const openaiKey = openaiExists
    ? await Promise.all([
        getAPIKey(openaiSessionId!, "openai"),
        refreshAPIKeyTTL(openaiSessionId!, "openai"),
      ]).then(([key]) => key)
    : null;

  const responseBody = {
    openai: {
      exists: openaiExists,
      keyPreview: openaiKey ? `...${openaiKey.slice(-4)}` : null,
    },
  };

  let response: NextResponse = NextResponse.json(responseBody);

  if (openaiExists && openaiSessionId) {
    const token = await createSessionToken(openaiSessionId, "openai");
    response = setSessionCookie(response, token, "openai");
  }

  return response;
}

// POST /api/keys
// Stores an API key. Creates a per-provider session if none exists.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, apiKey } = body;

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "provider and apiKey are required" },
        { status: 400 },
      );
    }

    if (!PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { error: "Provider must be 'openai'" },
        { status: 400 },
      );
    }

    // Check for existing session for THIS provider, or create a new one
    let sessionId = await getSessionFromRequest(provider);
    let needsNewCookie = false;

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      needsNewCookie = true;
    }

    await storeAPIKey(sessionId, provider, apiKey);

    const responseBody = {
      success: true,
      keyPreview: `...${apiKey.slice(-4)}`,
    };

    // Always set/refresh the cookie (new session or refreshed expiration)
    const token = await createSessionToken(sessionId, provider);
    const response = NextResponse.json(responseBody);
    return setSessionCookie(response, token, provider);
  } catch {
    return NextResponse.json(
      { error: "Failed to store API key" },
      { status: 500 },
    );
  }
}

// DELETE /api/keys
// Deletes an API key and clears the provider-specific session cookie.
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider } = body;

    if (!provider || !PROVIDERS.includes(provider)) {
      return NextResponse.json(
        { error: "Valid provider is required" },
        { status: 400 },
      );
    }

    const sessionId = await getSessionFromRequest(provider);

    if (!sessionId) {
      return NextResponse.json(
        { error: "Unauthorized. No valid session for this provider." },
        { status: 401 },
      );
    }

    await deleteAPIKey(sessionId, provider);

    // Clear the provider-specific cookie
    const response = NextResponse.json({ success: true });
    return clearSessionCookie(response, provider);
  } catch {
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 },
    );
  }
}
