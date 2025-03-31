export interface Asset {
	uuId: string; //This is the product

	uuSId: string; //The unique id for this shipment of the product

	owner: string; //Current owners Certificate

	pastOwners: string[]; //Past Owners Certificate

	parentShipments: string[]; //Shipments that created this asset
}
