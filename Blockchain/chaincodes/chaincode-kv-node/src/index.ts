import { Contract, Context } from 'fabric-contract-api';
import { Asset } from './AssetInterface';

class KVContract extends Contract {
	constructor() {
		super('KVContract');
	}

	instantiate(): void {
		console.log('Main instantiated');
	}

	getCertificate(context: Context): string {
		return context.clientIdentity.getID();
	}

	async createShipment(context: Context, uuId: string): Promise<string> {
		const { nanoid } = await import('nanoid');
		const shipment: Asset = {
			uuId,
			uuSId: nanoid(6),
			owner: context.clientIdentity.getID(),
			pastOwners: [],
			parentShipments: [],
		};

		await context.stub.putState(
			`${shipment.uuId}/${shipment.uuSId}`,
			Buffer.from(JSON.stringify(shipment)),
		);

		return `${shipment.uuId}/${shipment.uuSId}`;
	}

	async getShipment(
		context: Context,
		totalShimpentId: string,
	): Promise<string> {
		const shipment = await context.stub.getState(totalShimpentId);
		if (shipment.length === 0) {
			throw new Error(`Shipment ${totalShimpentId} does not exist`);
		}
		return shipment.toString();
	}

	async transferShipment(
		context: Context,
		totalShimpentId: string,
		newOwner: string,
	): Promise<
		| string
		| {
				response: 'ok';
		  }
	> {
		let shipment;

		try {
			shipment = await context.stub.getState(totalShimpentId);
		} catch {
			return 'NOT_FOUND';
		}
		const shipmentData: Asset = JSON.parse(shipment.toString());

		if (shipmentData.owner !== this.getCertificate(context)) {
			return 'NOT_ALLOWED';
		}

		if (!newOwner.startsWith('x509::/')) {
			return 'INVALID_OWNER';
		}

		shipmentData.pastOwners.push(shipmentData.owner);
		shipmentData.owner = newOwner;

		await context.stub.putState(
			totalShimpentId,
			Buffer.from(JSON.stringify(shipmentData)),
		);
		return { response: 'ok' };
	}

	async transformShipment(
		context: Context,
		uuId: string,
		parentShipmentIdsString: string,
	): Promise<string> {
		const parentShipmentIds: string[] = JSON.parse(parentShipmentIdsString);
		const parentShipments: string[] = [];

		for (const parentShipmentId of parentShipmentIds) {
			try {
				const shipment = await context.stub.getState(parentShipmentId);

				if (shipment.length === 0) {
					throw new Error(`Shipment ${parentShipmentId} does not exist`);
				}

				const parentShipment: Asset = JSON.parse(shipment.toString());

				if (parentShipment.owner !== this.getCertificate(context)) {
					throw new Error(`Shipment: ${parentShipmentId} is not owned by you`);
				}

				parentShipments.push(parentShipmentId);
			} catch (error) {
				throw new Error(String(error));
			}
		}
		const { nanoid } = await import('nanoid');
		const newshipment: Asset = {
			uuId,
			uuSId: nanoid(6),
			owner: context.clientIdentity.getID(),
			pastOwners: [],
			parentShipments,
		};

		await context.stub.putState(
			`${newshipment.uuId}/${newshipment.uuSId}`,
			Buffer.from(JSON.stringify(newshipment)),
		);
		return `${newshipment.uuId}/${newshipment.uuSId}`;
	}

	async getPath(
		context: Context,
		totalShimpentId: string,
	): Promise<{
		nodes: string[];
		edges: {
			type: string;
			from: string;
			to: string;
		}[];
	}> {
		const shipment = await context.stub.getState(totalShimpentId);
		const previousOwnerNodes: string[] = [];
		const edges: { type: string; from: string; to: string }[] = [];

		if (shipment.length === 0) {
			throw new Error(`Shipment ${totalShimpentId} does not exist`);
		}

		const shipmentData: Asset = JSON.parse(shipment.toString());

		return await this.DagCreateRecursion(
			context,
			shipmentData,
			previousOwnerNodes,
			edges,
		);
	}

	private async DagCreateRecursion(
		context: Context,
		shipmentData: Asset,
		previousOwnerNodes: string[] = [],
		edges: { type: string; from: string; to: string }[],
	): Promise<{
		nodes: string[];
		edges: {
			type: string;
			from: string;
			to: string;
		}[];
	}> {
		if (shipmentData.pastOwners.length > 0) {
			previousOwnerNodes.push(
				KVContract.GetNameFromCertificate(shipmentData.pastOwners.at(-1) ?? ''),
			);
			edges.push({
				type: 'transfer',
				from: KVContract.GetNameFromCertificate(
					shipmentData.pastOwners.at(-1) ?? '',
				),
				to: KVContract.GetNameFromCertificate(shipmentData.owner),
			});
		}

		for (let i = shipmentData.pastOwners.length - 2; i >= 0; i--) {
			previousOwnerNodes.push(
				KVContract.GetNameFromCertificate(shipmentData.pastOwners[i]),
			);
			edges.push({
				type: 'transfer',
				from: KVContract.GetNameFromCertificate(shipmentData.pastOwners[i]),
				to: KVContract.GetNameFromCertificate(shipmentData.pastOwners[i + 1]),
			});
		}

		for (const parentShipmentId of shipmentData.parentShipments) {
			let parentShipment: Asset;

			try {
				const shipment = await context.stub.getState(parentShipmentId);
				parentShipment = await JSON.parse(shipment.toString());
			} catch (error) {
				throw new Error(String(error));
			}

			previousOwnerNodes.push(
				KVContract.GetNameFromCertificate(parentShipment.owner),
			);

			edges.push({
				type: 'transform',
				from: parentShipment.uuId,
				to: shipmentData.uuId,
			});

			const parentDAG = await this.DagCreateRecursion(
				context,
				parentShipment,
				[],
				[],
			);
			previousOwnerNodes.push(...parentDAG.nodes);
			edges.push(...parentDAG.edges);
		}

		return { nodes: previousOwnerNodes, edges };
	}

	private static GetNameFromCertificate(certificate: string): string {
		if (!certificate) {
			return 'Certificate';
		}
		const index = certificate.indexOf('/CN=');
		const name = certificate.slice(index + 4, certificate.indexOf(':', index));
		return name;
	}
}

export const contracts = [KVContract];
