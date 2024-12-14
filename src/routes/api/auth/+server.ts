import { json } from '@sveltejs/kit';
import { authHandlers } from '$lib/server/util/auth/authHandlers';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse the incoming request body
        const { type, content } = await request.json();

        if (!type || !content) {
            return json({ error: 'Invalid request format' }, { status: 400 });
        }

        switch (type) {
            case 'signup': {
                const { email, password, username, fullName } = content;
                if (!email || !password || !username || !fullName) {
                    return json({ error: 'Missing required fields' }, { status: 400 });
                }
                // Call the signup handler
                const result = await authHandlers.signup(email, password, username);
                return json(result, { status: 201 });
            }

            case 'login': {
                const { email, password } = content;
                if (!email || !password) {
                    return json({ error: 'Missing email or password' }, { status: 400 });
                }
                // Call the login handler
                const result = await authHandlers.login(email, password);
                return json(result, { status: 200 });
            }

            case 'logout': {
                // Call the logout handler
                const result = await authHandlers.logout();
                return json(result, { status: 200 });
            }

            default:
                return json({ error: `Unknown type: ${type}` }, { status: 400 });
        }
    } catch (error) {
        console.error('Error handling POST request:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
