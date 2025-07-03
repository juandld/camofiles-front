import type { Handle } from "@sveltejs/kit";
import { createSessionClient } from "$lib/server/util/appwrite";

/**
 * This is a SvelteKit server hook that runs for every request to the server.
 * Its primary purpose is to handle session validation and user authentication.
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Ignore requests for special .well-known files to avoid unnecessary processing.
	if (event.url.pathname.startsWith("/.well-known")) {
		return new Response(null, { status: 404 });
	}

	// Attempt to retrieve the session secret from the 'session' cookie.
	const sessionCookie = event.cookies.get("session");

	// If no session cookie exists, the user is not authenticated.
	// Set `event.locals.user` to null and continue to the requested route.
	if (!sessionCookie) {
		event.locals.user = null;
		return resolve(event);
	}

	try {
		// Create an Appwrite session client using the secret from the cookie.
		// This client will act on behalf of the user.
		const { account } = createSessionClient(sessionCookie);

		// Fetch the user's data from Appwrite to verify the session is valid.
		const user = await account.get();

		// If the session is valid, the user object is attached to `event.locals`.
		// This makes the user's data available in all server-side load functions and endpoints.
		event.locals.user = user as any; // Cast to 'any' to match the App.Locals interface
	} catch (error) {
		// If Appwrite throws an error (e.g., session is invalid, expired, or malformed),
		// it means the session is no longer usable.
		console.error("Session validation error:", error);

		// Delete the invalid cookie from the browser to clean up.
		event.cookies.delete("session", { path: "/" });

		// Ensure the user is marked as unauthenticated for this request.
		event.locals.user = null;
	}

	// Continue processing the request, which will now have the user's
	// authentication state correctly populated in `event.locals`.
	return resolve(event);
};
