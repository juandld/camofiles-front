import { database } from "$lib/server/util/appwrite";
import { Query } from "appwrite";

const databaseID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const authCollectionID = import.meta.env.VITE_APPWRITE_AUTH_COLLECTION_ID;

export const userQHandle = {
    isUserAvailable: async (userId: string) => {
        try {
            console.log("userId", databaseID);

            const response = await database.getDocument(
                databaseID,
                authCollectionID,
                Query.equal("user_id", userId),
            );

            console.log("response", response);

            if (response) {
                return true;
            }
        } catch (error) {
            console.error("Error in isUserAvailable:", error);
            return false;
        }
    },
};
