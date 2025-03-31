import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';
import { ADMIN_ID, ADMIN_PASSWORD } from '$env/static/private';

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

		const { token: adminToken } = (await (
			await fetch(`${PUBLIC_BLOCKCHAIN_URL}/user/enroll`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: ADMIN_ID,
					secret: ADMIN_PASSWORD,
				}),
			})
		).json()) as { token: string };
		const createUserResponse = await fetch(`${PUBLIC_BLOCKCHAIN_URL}/user/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${adminToken}`,
			},
			body: JSON.stringify(authObject),
		});
		
		const createUserData = (await createUserResponse.json()) as {
			message: string;
		};
		if (createUserResponse.status !== 201) {
			return fail(createUserResponse.status, {
				error: createUserData.message,
			});
		}

		const loginResponse = await fetch(`${PUBLIC_BLOCKCHAIN_URL}/user/enroll`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(authObject),
		});
		const loginData = (await loginResponse.json()) as {
			token: string;
		};
		if (loginResponse.status !== 200) {
			return fail(400, {
				error: 'Something went wrong.',
			});
		}
		cookies.set('session', loginData.token, {
			path: '/',
			expires: new Date(Date.now() + 60 * 60 * 24 * 7), // 7 days from now
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
		});

		return createUserData;
	},
} satisfies Actions;
