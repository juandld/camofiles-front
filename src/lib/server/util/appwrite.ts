
import { Client, Databases, Account } from "appwrite";
// Import type models for Appwrite

const client: Client = new Client();

client
    //Change for production
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);


    export const account: Account = new Account(client);
    export const database: Databases = new Databases(client);