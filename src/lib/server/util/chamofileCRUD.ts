import { database } from "$lib/server/util/appwrite.ts";
import { ID } from "appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv.ts";

const databaseID = getRequiredEnv("VITE_APPWRITE_DATABASE_ID");
const chamofileCollectionID = getRequiredEnv("VITE_APPWRITE_CHAMOFILES_COLLECTION_ID");

export const chamofileCRUD = {
  createChamofile: async (userID: string, title: string, content: string) => {
    const newChamofile = await database.createDocument(
      databaseID,
      chamofileCollectionID,
      ID.unique(),
      {
        userID,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    return newChamofile.$id;
  },

  updateChamofile: async (chamofileID: string, title: string, content: string) => {
    await database.updateDocument(
      databaseID,
      chamofileCollectionID,
      chamofileID,
      {
        title,
        content,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  deleteChamofile: async (chamofileID: string) => {
    await database.deleteDocument(databaseID, chamofileCollectionID, chamofileID);
  },
};