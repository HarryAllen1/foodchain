/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { dev } from '$app/environment';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PUBLIC_BLOCKCHAIN_URL, PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
import { ADMIN_ID, ADMIN_PASSWORD } from '$env/static/private';
import { Client } from "@googlemaps/google-maps-services-js";

const client: Client = new Client({});



const getCoordinates = async (_address: string): Promise<{ latitude: number; longitude: number } | null> => {
	try {
		const response = await client.geocode({
			params: {
				address: _address,
				key: PUBLIC_GOOGLE_MAPS_API_KEY,
			},
		});

		if ('data' in response) {
			if (response && 'data' in response && response.data.status !== 'OK') {
				return null;
			}
			const { lat, lng } = response.data.results[0].geometry.location;
			return { latitude: lat, longitude: lng };
		}

		return null;
	} catch (error) {

		console.error('Error fetching coordinates:', error);
		return null;

	}
};

export const load = (({ locals, url }) => {
	if (locals.session) {
		return redirect(302, url.searchParams.get('to') ?? '/');
	}

	return {
		session: locals.session,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ cookies, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');
		const address = formData.get('address');

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

		if (!address || typeof address !== 'string') {
			return fail(400, {
				error: 'Address is required',
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

		const coordinates = await getCoordinates(address.toString());

		if (!coordinates) {
			return fail(400, {
				error: 'Invalid address',
			});
		}

		await supabase
			.from('owners')
			.insert({
				name: username,
				lat: coordinates.latitude,
				lng: coordinates.longitude,
			})

		return createUserData;
	},
} satisfies Actions;
