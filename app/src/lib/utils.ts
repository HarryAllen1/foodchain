import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const getNameFromCertificate = (certificate: string): string => {
	if (!certificate) {
		return 'Certificate';
	}
	const index = certificate.indexOf('/CN=');
	const name = certificate.slice(index + 4, certificate.indexOf(':', index));
	return name;
};

export interface Asset {
	uuId: string; //This is the product

	uuSId: string; //The unique id for this shipment of the product

	owner: string; //Current owners Certificate

	pastOwners: string[]; //Past Owners Certificate

	parentShipments: string[]; //Shipments that created this asset
}
