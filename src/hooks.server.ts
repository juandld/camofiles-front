// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { createSessionClient } from '$lib/server/util/appwrite';

export const handle: Handle = async ({ event, resolve }) => {
    // Ignore requests for .well-known files
    if (event.url.pathname.startsWith('/.well-known')) {
        return new Response(null, { status: 404 });
    }

    // Attempt to retrieve the session cookie.
    const session = event.cookies.get('session');

    // If no session cookie exists, there is no user to authenticate.
    if (!session) {
        event.locals.user = null;
        return resolve(event);
    }

    try {
        // Create a session client using the cookie's secret.
        const { account } = createSessionClient(session);
        // Fetch the user's data from Appwrite.
        const user = await account.get();
        // If successful, attach the user object to event.locals.
        event.locals.user = user as any;
    } catch (error) {
        // If session is invalid or expired, Appwrite throws an error.
        // Clear the invalid cookie and set the user to null.
        event.cookies.delete('session', { path: '/' });
        event.locals.user = null;
    }

    // Continue processing the request.
    return resolve(event);
};