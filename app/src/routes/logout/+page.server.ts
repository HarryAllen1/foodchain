import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: ({ cookies }) => {
		cookies.set('session', '', {
			httpOnly: true,
			path: '/',
			secure: !dev,
			sameSite: 'lax',
			maxAge: 0,
		});

		return redirect(302, '/login');
	},
} satisfies Actions;
