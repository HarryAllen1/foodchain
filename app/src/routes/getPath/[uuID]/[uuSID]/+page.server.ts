import { ADMIN_ID, ADMIN_PASSWORD } from '$env/static/private';
import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
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

	const totalShimpmentID = `${params.uuID}/${params.uuSID}`;

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

	const getPathResponse = await getPathRequest.json();

	return { path: getPathResponse };
};
