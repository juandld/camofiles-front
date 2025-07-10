import { error } from '@sveltejs/kit';
import { userQHandle } from '$lib/server/util/auth/userQHandle';
import { createAdminClient } from '$lib/server/util/appwrite';
import { getRequiredEnv } from '$lib/server/util/getEnv';
import { Query } from 'node-appwrite';

const databaseId = getRequiredEnv('VITE_APPWRITE_DATABASE_ID');
const camofilesCollectionId = getRequiredEnv('VITE_APPWRITE_CAMOFILES_COLLECTION_ID');
const privateCamofilesCollectionId = getRequiredEnv('VITE_APPWRITE_PRIVATE_CAMOFILES_COLLECTION_ID');

export const load = async ({ params, locals }) => {
    const { slug } = params;
    const { user: sessionUser } = locals;
    const { databases } = createAdminClient();

    // 1. Fetch the profile user's data from the database
    const profileUser = await userQHandle.isUserAvailable(slug)
    if (profileUser) {
        throw error(404, 'User not found');
    }
    const userDocs = await databases.listDocuments(
        databaseId,
        getRequiredEnv('VITE_APPWRITE_USERS_COLLECTION_ID'),
        [Query.equal('username', slug)]
    );

    if (userDocs.total === 0) {
        throw error(404, 'User not found');
    }
    const profileUserData = userDocs.documents[0];


    // 2. Fetch public camofiles for the profile user
    const publicCamofiles = await databases.listDocuments(
        databaseId,
        camofilesCollectionId,
        [Query.equal('ownerID', profileUserData.$id)]
    );

    // 3. Fetch private camofiles ONLY if the logged-in user is viewing their own profile
    let privateCamofiles = { documents: [] };
    if (sessionUser && sessionUser.$id === profileUserData.$id) {
        privateCamofiles = await databases.listDocuments(
            databaseId,
            privateCamofilesCollectionId,
            [Query.equal('ownerID', sessionUser.$id)]
        );
    }

    return {
        profile: {
            username: profileUserData.username,
            fullName: profileUserData.fullName,
        },
        publicCamofiles: publicCamofiles.documents,
        privateCamofiles: privateCamofiles.documents,
        isOwner: sessionUser ? sessionUser.$id === profileUserData.$id : false,
    };
};