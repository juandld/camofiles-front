import { createAdminClient, createSessionClient } from "$lib/server/util/appwrite.ts";
import { ID, Query } from "node-appwrite";
import { userQHandle } from "./userQHandle.ts";

const { account, users, databases } = createAdminClient();

export const authHandlers = {
	/**
	 * Handles user signup.
	 * Creates a user in Appwrite and adds them to a processing queue.
	 */
	signup: async (email: string, password: string, username: string, fullName: string) => {
		try {
			const user = await users.create(ID.unique(), email, undefined, password, fullName);
			await users.updateName(user.$id, fullName);
			await users.updatePrefs(user.$id, { username, fullName });

			// Directly create the user document in the database
			await userQHandle.createUser(user.$id, username, email, fullName);

			return { success: true, userId: user.$id };
		} catch (error) {
			console.error("Signup Error:", error);
			return { error: "Signup failed. Please try again." };
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
			console.log(`[Auth Handlers] Attempting login for email: ${email}`);
			const session = await account.createEmailPasswordSession(email, password);
			console.log("[Auth Handlers] Appwrite session created:", session);
			const user = await account.get();
			console.log("[Auth Handlers] Fetched user:", user);

			return {
				success: true,
				sessionSecret: session.secret,
				username: user.prefs.username
			};
		} catch (error) {
			console.error("Login Error:", error);
			return { error: "Invalid email or password." };
		}
	},

	/**
	 * Handles user logout.
	 * It uses the session secret from the user's cookie to delete the
	 * current session from Appwrite.
	 * @returns A success object or an error object.
	 */
	logout: async (session: string) => {
		try {
			const { account } = createSessionClient(session);
			await account.deleteSession("current");
			return { success: true };
		} catch (error) {
			console.error("Logout Error:", error);
			return { error: "Logout failed." };
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
