import { json, type RequestHandler } from "@sveltejs/kit";
import { authHandlers } from "$lib/server/util/auth/authHandlers";

/**
 * Handles POST requests to /api/auth.
 * This endpoint acts as a dispatcher for various authentication actions
 * like signup, login, and logout.
 */
export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { type, content } = await request.json();

		if (!type || !content) {
			return json({ error: "Invalid request body. 'type' and 'content' are required." }, { status: 400 });
		}

		switch (type) {
			// --- User Registration ---
			case "signup": {
				const { email, password, username, fullName } = content;
				if (!email || !password || !username || !fullName) {
					return json({ error: "Missing required fields for signup." }, { status: 400 });
				}
				const result = await authHandlers.signup(email, password, username, fullName);
				return json(result, { status: result.error ? 400 : 201 });
			}

			// --- User Login ---
			case "login": {
				const { email, password } = content;
				if (!email || !password) {
					return json({ error: "Email and password are required." }, { status: 400 });
				}

				const result = await authHandlers.login(email, password);

				if (result.error) {
					return json(result, { status: 400 });
				}

				// On successful login, set a secure, httpOnly cookie with the session secret.
				if (result.sessionSecret) {
					cookies.set("session", result.sessionSecret, {
						path: "/",
						httpOnly: true,
						sameSite: "strict",
						secure: process.env.NODE_ENV === "production",
						maxAge: 60 * 60 * 24 * 7 // 1 week
					});
				}

				// Do not send the sessionSecret back to the client.
				return json({ success: true, username: result.username }, { status: 200 });
			}

			// --- User Logout ---
			case "logout": {
				const session = cookies.get("session");
				if (!session) {
					return json({ error: "No active session to log out from." }, { status: 400 });
				}

				const result = await authHandlers.logout(session);

				// Clear the session cookie on successful logout.
				cookies.delete("session", { path: "/" });

				return json(result, { status: result.error ? 400 : 200 });
			}

			// --- Unhandled Action ---
			default:
				return json({ error: `Unknown action type: ${type}` }, { status: 400 });
		}
	} catch (error) {
		console.error("API Auth Error:", error);
		return json({ error: "An internal server error occurred." }, { status: 500 });
	}
};
