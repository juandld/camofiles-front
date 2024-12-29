import { database } from "$lib/server/util/appwrite.ts";
import { Query, ID } from "appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv.ts";

const databaseID = getRequiredEnv("VITE_APPWRITE_DATABASE_ID");
const authCollectionID = getRequiredEnv("VITE_APPWRITE_USERS_COLLECTION_ID");

export const userQHandle = {
    isUserAvailable: async (username: string) => {
        try {
            console.log("databaseID", databaseID);


            const promise = await database.listDocuments(
                databaseID,
                authCollectionID,
                [Query.equal("username", [username])]
            );

            console.log("promise", promise);

            if (promise.total === 0) {
                return true;
            }
        } catch (error) {
            console.error("Error in isUserAvailable:", error);
            return false;
        }
    },

    createUser: async (username: string, email: string, fullName: string) => {
        try {
            const promise = database.createDocument(
                databaseID,
                authCollectionID,
                ID.unique(),
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
