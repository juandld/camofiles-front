import {
	assert,
	assertExists,
	assertFalse,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { authHandlers } from "../src/lib/server/util/auth/authHandlers.ts";
import { userQHandle } from "../src/lib/server/util/auth/userQHandle.ts";

describe("User Creation", () => {
	it("should create a new random user successfully", async () => {
		// Generate a unique user each time the test runs
		const randomString = Math.random().toString(36).substring(2, 10);
		const email = `test_${randomString}@example.com`;
		const username = `testuser_${randomString}`;
		const password = "strongPassword123!";
		const fullName = "Random Test User";

		console.log(`Attempting to sign up user: ${username} (${email})`);

		// 1. Call the signup handler
		const signupResult = await authHandlers.signup(
			email,
			password,
			username,
			fullName,
		);

		console.log("Signup handler result:", signupResult);
		assert(signupResult.success, "Signup should be successful");
		assertExists(signupResult.userId, "User ID should be defined");

		// 2. Verify the user was created in the database collection
		// isUserAvailable returns `false` if the user *exists*, which is what we want.
		console.log(`Verifying if user '${username}' exists in the database...`);
		const userExists = await userQHandle.isUserAvailable(username);

		console.log(`isUserAvailable result: ${userExists}`);
		assertFalse(userExists, "User should be found in the database");
		console.log(`Successfully verified that user '${username}' was created.`);
	});
});
