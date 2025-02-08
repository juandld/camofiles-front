// src/lib/server/util/getEnv.ts

/**
 * Type for required environment variables
 */
export type RequiredEnvVars = {
  VITE_APPWRITE_ENDPOINT: string;
  VITE_APPWRITE_PROJECT_ID: string;
  VITE_APPWRITE_DATABASE_ID: string;
  VITE_APPWRITE_USERS_COLLECTION_ID: string;
  // Add other required env vars here
};

/**
 * Type guard to check if we're in Vite environment
 */
function isVite(): boolean {
  try {
    // @ts-ignore - Vite-specific check
    return typeof import.meta !== 'undefined' && !!import.meta.env;
  } catch (error) {
    return false;
  }
}

/**
 * Type guard to check if we're in Deno environment
 */
function isDeno(): boolean {
  if (isVite()) return false;

  return typeof Deno !== 'undefined' && typeof Deno.env !== 'undefined';
}

/**
 * Determines the current runtime environment
 */
function detectRuntime(): { type: string; details: Record<string, unknown> } {
  const isViteEnv = isVite();
  const isDenoEnv = !isViteEnv && isDeno();

  const details: Record<string, unknown> = {
    isVite: isViteEnv,
    isDeno: isDenoEnv,
    hasWindow: typeof window !== 'undefined',
  };

  return { type: isViteEnv ? 'Vite' : isDenoEnv ? 'Deno' : 'Unknown', details };
}

/**
 * Gets a required environment variable
 */
export function getRequiredEnv(key: keyof RequiredEnvVars): string {
  const runtime = detectRuntime();
  let value: string | undefined;

  if (runtime.type === 'Vite') {
    try {
      // @ts-ignore - Vite-specific environment lookup
      value = import.meta.env[key];
    } catch (error) {
      throw new Error(
        `Environment variable ${key} is not set.\n` +
        `Runtime: ${runtime.type}\n` +
        `Attempted sources: import.meta.env\n` +
        `Runtime details: ${JSON.stringify(runtime.details, null, 2)}`
      );
    }
  } else if (runtime.type === 'Deno') {
    try {
      value = Deno.env.get(key);
    } catch (error) {
      throw new Error(
        `Environment variable ${key} is not set.\n` +
        `Runtime: ${runtime.type}\n` +
        `Attempted sources: Deno.env\n` +
        `Runtime details: ${JSON.stringify(runtime.details, null, 2)}`
      );
    }
  }

  if (!value) {
    throw new Error(
      `Environment variable ${key} is not set.\n` +
      `Runtime: ${runtime.type}\n` +
      `Attempted sources: ${value ? 'unknown' : ''}\n` +
      `Runtime details: ${JSON.stringify(runtime.details, null, 2)}`
    );
  }

  return value;
}