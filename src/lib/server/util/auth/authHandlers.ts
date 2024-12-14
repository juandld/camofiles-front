import { account } from "$lib/server/util/appwrite";
import {userQHandle} from "$lib/server/util/auth/userQHandle";

export const authHandlers = {
    signup: async (email: string, password: string, username: string) => {
        try {
            
            // First, run the transaction to check if the username is available
            const isUsernameAvailable = await userQHandle.isUserAvailable(username);
            if (!isUsernameAvailable) {
                throw new Error(`Username ${username} is already taken`);
            }
            const response = await account.create(email, password, username);
            console.log(response);
            return response;
        } catch (error) {
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