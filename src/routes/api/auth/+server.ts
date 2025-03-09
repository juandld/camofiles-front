import { json } from "@sveltejs/kit";
import { authHandlers } from "$lib/server/util/auth/authHandlers.ts";
import type { RequestHandler } from "@sveltejs/kit";



export const POST: RequestHandler = async ({ request }) => {
  try {
    const { type, content } = await request.json();

    if (!type || !content) {
      return json({ error: "Invalid request format" }, { status: 400 });
    }

    switch (type) {
      case "signup": {
        const { email, password, username, fullName } = content;

        const missingFields = [];
        if (!email) missingFields.push("email");
        if (!password) missingFields.push("password");
        if (!username) missingFields.push("username");
        if (!fullName) missingFields.push("fullName");

        if (missingFields.length > 0) {
          return json(
            { error: `Missing fields: ${missingFields.join(", ")}` },
            { status: 400 },
          );
        }

        try {
          const result = await authHandlers.signup(
            email,
            password,
            username,
            fullName,
          );
          if (result && 'error' in result) {
            return json({ error: result.error }, { status: 400 });
          }
          return json(result, { status: 201 });
        } catch (error) {
          console.error("Signup error:", error);
          return json({ error: "Signup failed", details: (error as Error).message }, { status: 500 });
        }
      }

      case "login": {
        const { email, password } = content;

        if (!email || !password) {
          return json({ error: "Email and password required" }, {
            status: 400,
          });
        }

        try {
          const result = await authHandlers.login(email, password);
          if (result && 'error' in result) {
            return json({ error: result.error }, { status: 400 });
          }
          return json(result, { status: 200 });
        } catch (error) {
          console.error("Login error:", error);
          return json({ error: "Login failed", details: (error as Error).message }, { status: 500 });
        }
      }

      case "logout": {
        try {
          const result = await authHandlers.logout();
          if (result && 'error' in result) {
            return json({ error: result.error }, { status: 400 });
          }
          return json(result, { status: 200 });
        } catch (error) {
          console.error("Logout error:", error);
          return json({ error: "Logout failed", details: (error as Error).message }, { status: 500 });
        }
      }

      case "check": {
        const { sessionId, jwt } = content;
        try {
          const result = await authHandlers.check(sessionId, jwt);
          if (result && 'error' in result) {
            return json({ error: result.error }, { status: 400 });
          }
          return json(result, { status: 200 });
        } catch (error) {
          console.error("Check error:", error);
          return json({ error: "Check failed", details: (error as Error).message }, { status: 500 });
        }
      }

      default:
        return json({ error: `Unknown type: ${type}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Error handling POST request:", error);
    return json({ error: "Internal server error", details: (error as Error).message }, { status: 500 });
  }
};
