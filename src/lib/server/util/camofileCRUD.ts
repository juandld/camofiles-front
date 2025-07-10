import { database } from "$lib/server/util/appwrite.ts";
import { ID } from "node-appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv.ts";

const databaseID = getRequiredEnv("VITE_APPWRITE_DATABASE_ID");
const camofilesCollectionID = getRequiredEnv("VITE_APPWRITE_CAMOFILES_COLLECTION_ID");

export const camofileCRUD = {
  createCamofile: async (ownerID: string, title: string, content: string) => {
    const newCamofile = await database.createDocument(
      databaseID,
      camofilesCollectionID,
      ID.unique(),
      {
        ownerID,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
    return newCamofile.$id;
  },

  updateCamofile: async (chamofileID: string, title: string, content: string) => {
    await database.updateDocument(
      databaseID,
      camofilesCollectionID,
      chamofileID,
      {
        title,
        content,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  deleteCamofile: async (chamofileID: string) => {
    await database.deleteDocument(databaseID, camofilesCollectionID, chamofileID);
  },
};