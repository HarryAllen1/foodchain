import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';

export const load = (({ locals, url }) => {
	if (locals.session) {
		return redirect(302, url.searchParams.get('to') ?? '/');
	}

	return {
		session: locals.session,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!username || typeof username !== 'string') {
			return fail(400, {
				error: 'Username is required',
			});
		}

		if (!password || typeof password !== 'string') {
			return fail(400, {
				error: 'Password is required',
			});
		}
		if (password.length === 0) {
			return fail(400, {
				error: 'Password is required',
			});
		}

		const authObject = {
			id: username,
			secret: password,
		};

		const response = await fetch(`${PUBLIC_BLOCKCHAIN_URL}/user/enroll`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(authObject),
		});
		const data = (await response.json()) as
			| {
					message: string;
			  }
			| {
					token: string;
			  };
		if ('message' in data || response.status !== 200) {
			return fail(400, {
				error: 'Invalid username or password',
			});
		}

		cookies.set('session', data.token, {
			path: '/',
			expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 7 days from now
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
		});

		return data;
	},
} satisfies Actions;
