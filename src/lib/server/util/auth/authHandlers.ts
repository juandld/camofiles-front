import { account } from "$lib/server/util/appwrite.ts";
import { userQHandle } from "./userQHandle.ts";
import { ID } from "appwrite";

export const authHandlers = {
    signup: async (email: string, password: string, username: string, fullName: string) => {
        try {
            const isUsernameAvailable = await userQHandle.isUserAvailable(username);
            if (!isUsernameAvailable) {
                return { error: `Username ${username} is already taken` };
            }

            const promiseAuth = await account.create(
                ID.unique(),
                email, 
                password, 
                username 
            );

            const promiseDatabase = await userQHandle.createUser(
                username,
                email,
                fullName
            );

            if (promiseDatabase) {
                return { success: true };
            }
        } catch (error) {
            return { error: `Signup failed: ${(error as Error).message}` };
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await account.createEmailPasswordSession(email, password);
            return response;
        } catch (error) {
            return { error: `Login failed: ${(error as Error).message}` };
        }
    },

    logout: async () => {
        try {
            const response = await account.deleteSession('current');
            return response;
        } catch (error) {
            return { error: `Logout failed: ${(error as Error).message}` };
        }
    },
};