import { database } from "$lib/server/util/appwrite.ts";
import { Query, ID } from "appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv.ts";

const databaseID = getRequiredEnv("VITE_APPWRITE_DATABASE_ID");
const authCollectionID = getRequiredEnv("VITE_APPWRITE_USERS_COLLECTION_ID");

export const userQHandle = {
    isUserAvailable: async (username: string) => {
        try {      
            const promise = await database.listDocuments(
                databaseID,
                authCollectionID,
                [Query.equal("username", [username])]
            );
            if (promise.total === 0) {
                return true; 
            } else {
                return false; 
            } 
        } catch (error) {
            console.error("Error in isUserAvailable:", error);
            return false; 
        }
    },
    findUsernameByID: async (uid: string) => {
        try {
            const promise = await database.getDocument(
                databaseID,
                authCollectionID,
                uid
            );            
            if (promise.username) {
                return promise.username;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Error in findUsernameByID:", error);
            return false;
        }
    },
    createUser: (userId: string, username: string, email: string, fullName: string) => {
        try {
            const promise = database.createDocument(
                databaseID,
                authCollectionID,
                userId,
                {
                    username: username,
                    email: email,
                    fullName: fullName,
                    creationDate: new Date().toISOString() // Current time as string
                }
            )
            return promise;
        } catch (error) {
            console.error("Error in createUser:", error);
            return false;
        }
    }     
};
