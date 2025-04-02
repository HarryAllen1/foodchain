import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';
import { ADMIN_ID, ADMIN_PASSWORD } from '$env/static/private';

export const load = (async ({ params: { id }, locals: { supabase } }) => {
	if (!id.includes('/')) {
		throw error(400, 'Invalid product ID no slash!');
	}

	const [pid, sid] = id.split('/');
	if (!pid || !sid) {
		throw error(400, 'Invalid product ID no all IDS!');
	}

	const { data: product } = await supabase.from('products').select('*').eq('id', pid).single();

	if (!product) {
		throw error(404, 'Product not found!');
	}
	const totalShimpmentID = `${pid}/${sid}`;

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

	const getPathRequest = await fetch(`${PUBLIC_BLOCKCHAIN_URL}/invoke/supplychain/main`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${adminToken}`,
		},
		body: JSON.stringify({
			method: 'KVContract:getPath',
			args: [totalShimpmentID],
		}),
	});

	const getCurrentState = await fetch(`${PUBLIC_BLOCKCHAIN_URL}/invoke/supplychain/main`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${adminToken}`,
		},
		body: JSON.stringify({
			method: 'KVContract:getShipment',
			args: [totalShimpmentID],
		}),
	});

	const getPathResponse = (await getPathRequest.json()) as {
		response: {
			nodes: string[];
			edges: {
				type: 'transfer' | 'transform';
				to: string;
				from: string;
			}[];
		};
	};
	const getCurrentStateResponse = (await getCurrentState.json()) as {
		response: {
			uuId: string;
			uuSId: string;
			owner: string;
			pastOwners: string[];
			parentShipments: string[];
		};
	};

	const { data: owners } = await supabase
		.from('owners')
		.select('*')
		.in('name', getPathResponse.response.nodes);

	return {
		product,
		sid,
		pid,
		path: getPathResponse,
		owners: owners ?? [],
		currentState: getCurrentStateResponse,
	};
}) satisfies PageServerLoad;
