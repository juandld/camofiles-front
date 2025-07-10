import { createAdminClient } from "$lib/server/util/appwrite.ts";
import { Query } from "node-appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv.ts";

const databaseID = getRequiredEnv("VITE_APPWRITE_DATABASE_ID");
const authCollectionID = getRequiredEnv("VITE_APPWRITE_USERS_COLLECTION_ID");

export const userQHandle = {
    isUserAvailable: async (username: string) => {
        try {
            const { databases } = createAdminClient();
            const promise = await databases.listDocuments(
                databaseID,
                authCollectionID,
                [Query.equal("username", [username])]
            );
            return promise.total === 0;
        } catch (error) {
            console.error("Error in isUserAvailable:", error);
            return false;
        }
    },
    findUsernameByID: async (uid: string) => {
        try {
            const { databases } = createAdminClient();
            const promise = await databases.getDocument(
                databaseID,
                authCollectionID,
                uid
            );
            // Check if the document exists and has a username field
            if (promise.username) {
                return promise.username;
            }
            return false;
        } catch (error) {
            console.error("Error in findUsernameByID:", error);
            return false;
        }
    },
    createUser: (userId: string, username: string, email: string, fullName: string) => {
        try {
            const { databases } = createAdminClient();
            return databases.createDocument(
                databaseID,
                authCollectionID,
                userId,
                {
                    username: username,
                    email: email,
                    fullName: fullName,
                    creationDate: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error("Error in createUser:", error);
            return false;
        }
    }
};