import { createAdminClient, createSessionClient } from "$lib/server/util/appwrite";
import { Client, Account, ID } from "node-appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv";
import { userQHandle } from "./userQHandle";

/**
 * A collection of handlers for authentication-related actions.
 */
export const authHandlers = {
	/**
	 * Handles user registration.
	 * It first checks for username availability, then creates a new Appwrite user
	 * and a corresponding user profile document in the database.
	 * @returns A success object or an error object.
	 */
	signup: async (email: string, password: string, username: string, fullName: string) => {
		try {
			const isUsernameAvailable = await userQHandle.isUserAvailable(username);
			if (!isUsernameAvailable) {
				return { error: `Username ${username} is already taken` };
			}

			// Use the admin client to create a new user in Appwrite Auth.
			const { account } = createAdminClient();
			const newUser = await account.create(ID.unique(), email, password, username);

			// Create a corresponding user profile in the database.
			await userQHandle.createUser(newUser.$id, username, email, fullName);

			return { success: true };
		} catch (error) {
			console.error("Signup Error:", error);
			return { error: `Signup failed: ${(error as Error).message}` };
		}
	},

	/**
	 * Handles user login.
	 * It creates an email/password session with Appwrite and returns the
	 * session secret for cookie creation.
	 * @returns An object containing the username and session secret, or an error object.
	 */
	login: async (email: string, password: string) => {
		try {
			const client = new Client()
				.setEndpoint(getRequiredEnv("VITE_APPWRITE_ENDPOINT")!)
				.setProject(getRequiredEnv("VITE_APPWRITE_PROJECT_ID")!);

			const account = new Account(client);
			const session = await account.createEmailPasswordSession(email, password);

			// Retrieve the user's profile to get their username.
			const username = await userQHandle.findUsernameByID(session.userId);

			if (username) {
				// The session secret will be used to set a secure, httpOnly cookie.
				return { username, sessionSecret: session.secret };
			} else {
				return { error: "User profile not found. Please contact support." };
			}
		} catch (error) {
			console.error("Login Error:", error);
			return { error: `Login failed: ${(error as Error).message}` };
		}
	},

	/**
	 * Handles user logout.
	 * It uses the session secret from the user's cookie to delete the
	 * current session from Appwrite.
	 * @returns A success object or an error object.
	 */
	logout: async (sessionSecret: string) => {
		try {
			const { account } = createSessionClient(sessionSecret);
			await account.deleteSession("current");
			return { success: true };
		} catch (error) {
			console.error("Logout Error:", error);
			return { error: `Logout failed: ${(error as Error).message}` };
		}
	},

	/**
	 * Checks the validity of a session.
	 * This is an admin-level check and not typically used in the user flow.
	 * @returns The session object if valid, otherwise null.
	 */
	check: async (sessionId: string) => {
		try {
			const { account } = createAdminClient();
			const session = await account.getSession(sessionId);
			return session;
		} catch (error) {
			console.error("Get Session Error:", error);
			return null;
		}
	}
};
