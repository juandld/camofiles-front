import { database } from "$lib/server/util/appwrite";
import { Query } from "appwrite";

const databaseID = import.meta.env.VITE_APPWRITE_AUTH_DATABASE_ID;
const authCollectionID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

export const userQHandle = {
    isUserAvailable: async (username: string) => {
        try {
            console.log("databaseID", databaseID);


            const response = await database.listDocuments(
                databaseID,
                authCollectionID,
                [Query.equal("username", [username])]
            );

            console.log("response", response);

            if (response.total === 0) {
                return true;
            }
        } catch (error) {
            console.error("Error in isUserAvailable:", error);
            return false;
        }
    },
};
