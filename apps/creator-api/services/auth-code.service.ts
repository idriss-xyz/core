import crypto from 'crypto';

interface AuthCodeData {
  token: string;
  name: string;
  displayName: string;
  pfp: string;
  email: string;
  callbackUrl: string;
  expiresAt: number;
}

const AUTH_CODE_TTL_MS = 60 * 1000; // 60 seconds
const CLEANUP_INTERVAL_MS = 30 * 1000; // Clean up every 30 seconds

class AuthCodeStore {
  private codes: Map<string, AuthCodeData> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanup();
  }

  generateCode(data: Omit<AuthCodeData, 'expiresAt'>): string {
    const code = crypto.randomBytes(32).toString('hex');
    this.codes.set(code, {
      ...data,
      expiresAt: Date.now() + AUTH_CODE_TTL_MS,
    });
    return code;
  }

  exchangeCode(code: string): Omit<AuthCodeData, 'expiresAt'> | null {
    const data = this.codes.get(code);

    if (!data) {
      return null;
    }

    // Delete immediately (single-use)
    this.codes.delete(code);

    // Check if expired
    if (Date.now() > data.expiresAt) {
      return null;
    }

    const { expiresAt: _, ...result } = data;
    return result;
  }

  private startCleanup() {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [code, data] of this.codes.entries()) {
        if (now > data.expiresAt) {
          this.codes.delete(code);
        }
      }
    }, CLEANUP_INTERVAL_MS);
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export const authCodeStore = new AuthCodeStore();
