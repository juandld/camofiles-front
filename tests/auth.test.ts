

import { assertEquals, assert } from "jsr:@std/assert";
import { userQHandle } from "../src/lib/server/util/auth/userQHandle.ts";

// Define test data
const testUsername = "test_user";
const testEmail = "test_user@example.com";
const testFullName = "Test User";

//IMPORTANT: These test work from the VS Code extension for deno but not from the terminal. dont know why nor do i care.

// Test if a user is available (does not exist in the database)
Deno.test("isUserAvailable returns true for a non-existing user", async () => {
  const isAvailable = await userQHandle.isUserAvailable(testUsername);
  assertEquals(isAvailable, true, "Expected the username to be available."); 
});

// Test user creation
Deno.test("createUser successfully creates a new user", async () => {
  const userCreated = await userQHandle.createUser(
    testUsername,
    testEmail,
    testFullName,
  );
  assert(userCreated, "Expected the user to be successfully created.");
});

// Test if the created user is now unavailable
Deno.test("isUserAvailable returns false for an existing user", async () => {
  const isAvailable = await userQHandle.isUserAvailable(testUsername);
  assertEquals(isAvailable, false, "Expected the username to be unavailable after creation.");
});

