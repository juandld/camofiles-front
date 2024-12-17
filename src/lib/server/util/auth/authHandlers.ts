import { account } from "$lib/server/util/appwrite";
import { userQHandle } from "$lib/server/util/auth/userQHandle";
import { ID } from "appwrite";

export const authHandlers = {
    signup: async (email: string, password: string, username: string) => {
        try {
            // First, run the transaction to check if the username is available
            const isUsernameAvailable = await userQHandle.isUserAvailable(username);
            console.log(isUsernameAvailable);
            if (!isUsernameAvailable) {
                throw new Error(`Username ${username} is already taken`);
            }

            console.log("making new account ");
            const response = await account.create(
                ID.unique(), // Generate a unique ID for the user
                email, 
                password, 
                username // Optional name parameter
            );
            
            console.log(response); // Success
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await account.createEmailPasswordSession(email, password);
            return response;
        } catch (error) {
            return error;
        }
    },

    logout: async () => {
        try {
            const response = await account.deleteSession('current');
            return response;
        } catch (error) {
            return error;
        }
    },

};