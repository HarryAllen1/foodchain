import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals: { session, user }, cookies }) => {
	return {
		session,
		user,
		cookies: cookies.getAll(),
	};
};
