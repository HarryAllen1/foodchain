import type { AssetKind, Brand } from '@agoric/ertp';

export interface CopyBag<T = string> {
	payload: [T, bigint][];
}

export interface Purse {
	brand: Brand<'nat'>;
	brandPetname: string;
	currentAmount: {
		brand: Brand<'nat'>;
		value: CopyBag;
	};
	displayInfo: {
		decimalPlaces: number;
		assetKind: AssetKind;
	};
}
