import { Redis } from "@upstash/redis";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

// ==================== Encryption ====================

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16;
const ENCRYPTION_SALT = "apollotrack-key-encryption";

/** Derive a 32-byte AES key from SESSION_SECRET using scrypt (cached). */
let derivedKey: Buffer | null = null;
function getEncryptionKey(): Buffer {
  if (!derivedKey) {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("Missing SESSION_SECRET environment variable");
    }
    derivedKey = scryptSync(secret, ENCRYPTION_SALT, 32);
  }
  return derivedKey;
}

/** Encrypt plaintext → "iv:authTag:ciphertext" (hex-encoded). */
function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

/** Decrypt "iv:authTag:ciphertext" (hex-encoded) → plaintext. */
function decrypt(data: string): string {
  const parts = data.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }
  const [ivHex, authTagHex, ciphertextHex] = parts;
  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const ciphertext = Buffer.from(ciphertextHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");
}

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN environment variables",
      );
    }

    redis = new Redis({ url, token });
  }
  return redis;
}

// Key format: apollotrack:{sessionId}:{provider}
function buildKey(sessionId: string, provider: string): string {
  return `apollotrack:${sessionId}:${provider}`;
}

export async function storeAPIKey(
  sessionId: string,
  provider: string,
  apiKey: string,
): Promise<void> {
  const r = getRedis();
  await r.set(buildKey(sessionId, provider), encrypt(apiKey), {
    ex: SEVEN_DAYS_SECONDS,
  });
}

export async function getAPIKey(
  sessionId: string,
  provider: string,
): Promise<string | null> {
  const r = getRedis();
  const encrypted = await r.get<string>(buildKey(sessionId, provider));
  if (!encrypted) return null;
  return decrypt(encrypted);
}

export async function deleteAPIKey(
  sessionId: string,
  provider: string,
): Promise<void> {
  const r = getRedis();
  await r.del(buildKey(sessionId, provider));
}

export async function hasAPIKey(
  sessionId: string,
  provider: string,
): Promise<boolean> {
  const r = getRedis();
  return (await r.exists(buildKey(sessionId, provider))) === 1;
}

/**
 * Refresh the TTL of an existing API key in Redis without modifying its value.
 * Returns true if the key exists and the TTL was refreshed, false otherwise.
 */
export async function refreshAPIKeyTTL(
  sessionId: string,
  provider: string,
): Promise<boolean> {
  const r = getRedis();
  // expire returns 1 if the timeout was set, 0 if the key does not exist
  return (
    (await r.expire(buildKey(sessionId, provider), SEVEN_DAYS_SECONDS)) === 1
  );
}
