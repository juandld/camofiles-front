import {
	assert,
	assertExists,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { authHandlers } from "../src/lib/server/util/auth/authHandlers.ts";

describe("User Login", () => {
	it("should log in an existing user successfully", async () => {
		// 1. Create a new user to test with
		const randomString = Math.random().toString(36).substring(2, 10);
		const email = `login_test_${randomString}@example.com`;
		const username = `login_test_${randomString}`;
		const password = "strongPassword123!";
		const fullName = "Login Test User";

		console.log(`Creating user '${username}' for login test...`);
		const signupResult = await authHandlers.signup(
			email,
			password,
			username,
			fullName,
		);
		assert(signupResult.success, "Test user setup failed during signup.");
		console.log(`User '${username}' created successfully.`);

		// 2. Attempt to log in with the new user's credentials
		console.log(`Attempting to log in as '${username}'...`);
		const loginResult = await authHandlers.login(email, password);

		console.log("Login handler result:", loginResult);
		assert(loginResult.success, "Login should be successful.");
		assertExists(loginResult.sessionSecret, "A session secret should be returned.");
		assert(loginResult.username === username, "The correct username should be returned.");
		console.log(`Successfully logged in as '${username}'.`);
	});
});
