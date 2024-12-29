import { Client, Databases, Account } from "appwrite";
import { getRequiredEnv } from "$lib/server/util/getEnv.ts";
const client: Client = new Client();

client
  .setEndpoint(getRequiredEnv("VITE_APPWRITE_ENDPOINT")!)
  .setProject(getRequiredEnv("VITE_APPWRITE_PROJECT_ID")!);

export const account: Account = new Account(client);
export const database: Databases = new Databases(client);
