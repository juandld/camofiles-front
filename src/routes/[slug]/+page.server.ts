import { camofileCRUD } from '$lib/server/util/camofileCRUD';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const camofile = await camofileCRUD.getCamofile(params.slug);

    if (camofile.userID !== locals.user.userId) {
      throw error(403, 'Forbidden');
    }

    return {
      camofile,
    };
  } catch (e) {
    // This will catch errors from Appwrite if the document is not found
    throw error(404, 'Not Found');
  }
};
