import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';
import type { Asset } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { session, supabase } }) => {
	const getShipmentsRequest = await fetch(`${PUBLIC_BLOCKCHAIN_URL}/invoke/supplychain/main`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session ?? ''}`,
		},
		body: JSON.stringify({
			method: 'KVContract:getAllShipmentsOwnedByUser',
			args: [],
		}),
	});

	const shipments = (await getShipmentsRequest.json()) as {
		response: Asset[];
	};

	const { data: owners } = await supabase.from('owners').select('*');

	return {
		shipments,
		owners: owners ?? [],
	};
}) satisfies PageServerLoad;
