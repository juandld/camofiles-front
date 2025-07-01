import { Client, Account, Databases, ID, type Models, Users } from "node-appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv.ts";

// --- Re-export Appwrite models and utilities for convenience ---
export { ID };
export type { Models};

// --- Base Client Configuration ---
const client: Client = new Client();
client
  .setEndpoint(getRequiredEnv("VITE_APPWRITE_ENDPOINT")!)
  .setProject(getRequiredEnv("VITE_APPWRITE_PROJECT_ID")!);

export const expClient = client;
export const database: Databases = new Databases(client);

// --- Client Creation Helpers ---

/**
 * Creates an Admin Client.
 * This client has administrative privileges granted by the API key
 * and should only be used for tasks like user creation.
 * @returns {Account: Account, Databases: Databases, Users: Users}
 */
export const createAdminClient = () => {
    const adminClient = new Client()
       .setEndpoint(getRequiredEnv("VITE_APPWRITE_ENDPOINT")!)
       .setProject(getRequiredEnv("VITE_APPWRITE_PROJECT_ID")!)
        .setKey(getRequiredEnv("VITE_APPWRITE_API_KEY")!)
       // Note: Appwrite's JS SDK does not support setKey; use server-side SDKs for admin actions.

    return {
        get account() {
            return new Account(adminClient);
        },
        get databases() {
            return new Databases(adminClient);
        },
        get users() {
            return new Users(adminClient);
        }
    };
};

/**
 * Creates a Session Client.
 * This client is authenticated with a user's session secret and acts on their behalf.
 * Used for validating sessions and generating JWTs.
 * @param {string} sessionSecret - The user's session secret from the cookie.
 * @returns {Account: Account, Databases: Databases}
 */
export const createSessionClient = (sessionSecret: string) => {
    const sessionClient = new Client()
       .setEndpoint(getRequiredEnv("VITE_APPWRITE_ENDPOINT")!)
       .setProject(getRequiredEnv("VITE_APPWRITE_PROJECT_ID")!)
       .setSession(sessionSecret);

    return {
        get account() {
            return new Account(sessionClient);
        },
        get databases() {
            return new Databases(sessionClient);
        }
    };
};

/**
 * Creates a JWT Client.
 * This client is authenticated with a short-lived JWT for delegated,
 * permission-aware requests.
 * @param {string} jwt - The JSON Web Token.
 * @returns {Account: Account, Databases: Databases}
 */
export const createJWTClient = (jwt: string) => {
    const jwtClient = new Client()
       .setEndpoint(getRequiredEnv("VITE_APPWRITE_ENDPOINT")!)
       .setProject(getRequiredEnv("VITE_APPWRITE_PROJECT_ID")!)
       .setJWT(jwt);

    return {
        get account() {
            return new Account(jwtClient);
        },
        get databases() {
            return new Databases(jwtClient);
        }
    };
};
