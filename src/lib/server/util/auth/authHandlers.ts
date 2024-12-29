import { account } from "$lib/server/util/appwrite.ts";
import { userQHandle } from "./userQHandle.ts";
import { ID } from "appwrite";

export const authHandlers = {
    signup: async (email: string, password: string, username: string, fullName: string) => {
        try {
            // First, run the transaction to check if the username is available
            const isUsernameAvailable = await userQHandle.isUserAvailable(username);
            console.log(isUsernameAvailable);
            if (!isUsernameAvailable) {
                throw new Error(`Username ${username} is already taken`);
            }
            
            // If username is available, create the account
            //In the auth service
            console.log("making new account ");
            const promiseAuth = await account.create(
                ID.unique(),
                email, 
                password, 
                username 
            );

            // In the auth database
            const promiseDatabase = await userQHandle.createUser(
                email,
                password,
                username,
                fullName
            );
            
            console.log(promiseAuth); // Success
            if (promiseDatabase) {
                return true; // Success
            }
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