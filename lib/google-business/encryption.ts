
import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const encodedKey = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;

  if (!encodedKey) {
    throw new Error("Google token encryption key is not configured.");
  }

  const key = Buffer.from(encodedKey, "base64");

  if (
    key.length !== KEY_LENGTH ||
    key.toString("base64") !== encodedKey
  ) {
    throw new Error(
      "Google token encryption key must be a valid base64-encoded 32-byte key."
    );
  }

  return key;
}

export interface EncryptedToken {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export function encryptGoogleToken(
  plaintext: string
): EncryptedToken {
  if (!plaintext) {
    throw new Error("Cannot encrypt an empty Google token.");
  }

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

export function decryptGoogleToken(
  encryptedToken: EncryptedToken
): string {
  const key = getEncryptionKey();

  const iv = Buffer.from(encryptedToken.iv, "base64");
  const ciphertext = Buffer.from(
    encryptedToken.ciphertext,
    "base64"
  );
  const authTag = Buffer.from(
    encryptedToken.authTag,
    "base64"
  );

  if (
    iv.length !== IV_LENGTH ||
    authTag.length !== AUTH_TAG_LENGTH
  ) {
    throw new Error("Invalid encrypted Google token format.");
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
