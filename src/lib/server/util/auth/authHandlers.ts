import { expClient } from "$lib/server/util/appwrite.ts";
import { Account } from "appwrite";
import { userQHandle } from "./userQHandle.ts";
import { ID } from "appwrite";
import { SignJWT } from "jose";
import type { JWTPayload } from "jose";

import { getRequiredEnv } from "../getEnv.ts";

const jwtSighn = getRequiredEnv("VITE_JWT_SECRET_KEY");

async function createJWT(payload:JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(jwtSighn);
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);
    console.log("JWT created" + jwt);
    
  return jwt;
}

export const authHandlers = {
  signup: async (
    email: string,
    password: string,
    username: string,
    fullName: string,
  ) => {
    try {
      const isUsernameAvailable = await userQHandle.isUserAvailable(username);
      if (!isUsernameAvailable) {
        return { error: `Username ${username} is already taken` };
      }

      const userId = ID.unique();
      const account = new Account(expClient);
      const promiseAuth = await account.create(
        userId,
        email,
        password,
        username,
      );

      const promiseDatabase = await userQHandle.createUser(
        userId,
        username,
        email,
        fullName,
      );

      if (promiseDatabase && promiseAuth) {
        return { success: true };
      }
    } catch (error) {
      return { error: `Signup failed: ${(error as Error).message}` };
    }
  },

  login: async (email: string, password: string) => {
    try {     

        const account = new Account(expClient);
        //Left here
        const response = await account.createEmailPasswordSession(
            email,
            password,
        );        

        console.log("Login called");
        // find user by uid and get the user's username
        const sessionId = response.$id;
        const userID = response.userId;
        const username = await userQHandle.findUsernameByID(userID);        
        const jwt = await createJWT({ username, sessionId });
      if (username) {
        console.log("Login success IAOIAIAIAIAIA" + jwt);
        
        return { username, sessionId, jwt };
      }
      return response;
    } catch (error) {
      return { error: `Login failed: ${(error as Error).message}` };
    }
  },

  logout: async () => {
    try {
    const account = new Account(expClient);
      const response = await account.deleteSession("current");
      return response;
    } catch (error) {
      return { error: `Logout failed: ${(error as Error).message}` };
    }
  },

  check: async (sessionId: string, jwt: string) => {
    
    console.log("Check JWT" + jwt);
    
    const client =  expClient.setJWT(jwt);
    const account = new Account(client);
    console.log("Get session called" + sessionId);

    try {
      const session = await account.getSession(sessionId);
      return session;
    } catch (error) {
      console.error("Get session error:", error);
      return null;
    }
  },
};
