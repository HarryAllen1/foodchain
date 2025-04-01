import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params: { id }, locals: { supabase } }) => {
	if (!id.includes('/')) {
		throw error(400, 'Invalid product ID!');
	}

	const [pid, sid] = id.split('/');
	if (!pid || !sid) {
		throw error(400, 'Invalid product ID!');
	}

	const { data: product } = await supabase.from('products').select('*').eq('id', pid).single();

	if (!product) {
		throw error(404, 'Product not found!');
	}

	return {
		product,
		sid,
	};
}) satisfies PageServerLoad;
