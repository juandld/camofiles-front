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
 * Prioritizes detecting Vite and skips further checks if true
 */
function isVite(): boolean {
    try {
      // @ts-ignore - Vite-specific check
      const hasImportMeta = typeof import.meta !== 'undefined';
      // @ts-ignore - Vite-specific check
      const hasViteEnv = hasImportMeta && !!import.meta.env;
  
      console.log('[Environment Detection] Vite environment check:', {
        hasImportMeta,
        hasViteEnv,
        // @ts-ignore - Log available env if possible
        envKeys: hasViteEnv ? Object.keys(import.meta.env) : 'N/A',
      });
  
      if (hasViteEnv) {
        console.log('[Environment Detection] Vite detected. Skipping other checks.');
        return true;
      }
    } catch (error) {
      console.log('[Environment Detection] Error checking Vite environment:', error);
    }
  
    return false;
  }
  
  /**
   * Type guard to check if we're in Deno environment
   * Only checks if Vite is not detected
   */
  function isDeno(): boolean {
    if (isVite()) {
      console.log('[Environment Detection] Skipping Deno check since Vite is detected.');
      return false;
    }
  
    const hasDeno = typeof Deno !== 'undefined' && typeof Deno.env !== 'undefined';
    console.log('[Environment Detection] Checking for Deno runtime:', {
      hasDeno,
      scope: typeof window !== 'undefined' ? 'window' : 'not window',
    });
  
    return hasDeno;
  }
  
  /**
   * Determines the current runtime environment
   * Prioritizes Vite over other environments
   */
  function detectRuntime(): { type: string; details: Record<string, unknown> } {
    console.log('[Runtime Detection] Starting runtime environment detection...');
  
    const isViteEnv = isVite();
    const isDenoEnv = !isViteEnv && isDeno(); // Only check Deno if Vite is false
  
    const details: Record<string, unknown> = {
      isVite: isViteEnv,
      isDeno: isDenoEnv,
      hasWindow: typeof window !== 'undefined',
    };
  
    const type = isViteEnv ? 'Vite' : isDenoEnv ? 'Deno' : 'Unknown';
  
    console.log('[Runtime Detection] Detected runtime:', { type, details });
    return { type, details };
  }
  
  /**
   * Gets a required environment variable
   * Prioritizes Vite environment if available
   */
  export function getRequiredEnv(key: keyof RequiredEnvVars): string {
    console.log(`[Environment Lookup] Starting lookup for env var: ${key}`);
  
    const runtime = detectRuntime();
    let value: string | undefined;
    let source: string = 'unknown';
  
    if (runtime.type === 'Vite') {
      console.log('[Environment Lookup] Using Vite environment...');
      try {
        // @ts-ignore - Vite-specific environment lookup
        value = import.meta.env[key];
        source = 'import.meta.env';
      } catch (error) {
        console.error('[Environment Lookup] Error in Vite env lookup:', error);
      }
    } else if (runtime.type === 'Deno') {
      console.log('[Environment Lookup] Using Deno environment...');
      try {
        value = Deno.env.get(key);
        source = 'Deno.env';
      } catch (error) {
        console.error('[Environment Lookup] Error in Deno env lookup:', error);
      }
    }
  
    if (!value) {
      const error = new Error(
        `Environment variable ${key} is not set.\n` +
        `Runtime: ${runtime.type}\n` +
        `Attempted sources: ${source}\n` +
        `Runtime details: ${JSON.stringify(runtime.details, null, 2)}\n` +
        `Make sure the variable is defined in your .env file and that the file is being loaded.`
      );
      console.error('[Environment Lookup] Failed to find environment variable:', error);
      throw error;
    }
  
    console.log(`[Environment Lookup] Successfully found ${key} in ${source}`);
    return value;
  }
  