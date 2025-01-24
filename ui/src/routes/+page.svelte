<script lang="ts">
	import Inventory from '$lib/components/Inventory.svelte';
	import Trade from '$lib/components/Trade.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ENDPOINTS } from '$lib/constants';
	import type { Purse } from '$lib/types';
	import { subscribeLatest } from '@agoric/notifier';
	import { AgoricChainStoragePathKind, makeAgoricChainStorageWatcher } from '@agoric/rpc';
	import { makeAgoricWalletConnection, suggestChain } from '@agoric/web-components';
	import { makeCopyBag } from '@endo/patterns';
	import { onMount } from 'svelte';

	const watcher = makeAgoricChainStorageWatcher(ENDPOINTS.API, 'agoriclocal');

	type Wallet = Awaited<ReturnType<typeof makeAgoricWalletConnection>>;
	interface AppState {
		wallet?: Wallet;
		offerUpInstance?: unknown;
		brands?: Record<string, unknown>;
		purses?: Purse[];
	}

	let appState = $state<AppState>({});

	const setup = (): (() => void) => {
		const instanceUnsub = watcher.watchLatest<[string, unknown][]>(
			[AgoricChainStoragePathKind.Data, 'published.agoricNames.instance'],
			(instances) => {
				appState.offerUpInstance = instances.find(([name]) => name === 'offerUp')?.[1];
			}
		);

		const brandUnsub = watcher.watchLatest<[string, unknown][]>(
			[AgoricChainStoragePathKind.Data, 'published.agoricNames.brand'],
			(brands) => {
				appState.brands = Object.fromEntries(brands);
			}
		);

		return () => {
			instanceUnsub();
			brandUnsub();
		};
	};

	const connectWallet = async (): Promise<void> => {
		try {
			await fetch(ENDPOINTS.RPC);
		} catch {
			throw new Error('Failed to connect to the wallet as the chain is not running');
		}

		await suggestChain('https://local.agoric.net/network-config');

		const wallet = await makeAgoricWalletConnection(watcher, ENDPOINTS.RPC);
		appState.wallet = wallet;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		for await (const purses of subscribeLatest<Purse[]>(wallet.pursesNotifier)) {
			console.log('purses', purses);
			appState.purses = purses;
		}
	};

	const makeOffer = (giveValue: bigint, wantChoices: Record<string, bigint>): void => {
		if (!appState.offerUpInstance) {
			throw new Error('OfferUp instance not found');
		}

		if (!(appState.brands?.IST && appState.brands.Item)) {
			throw new Error('Brands not found');
		}

		const value = makeCopyBag(Object.entries(wantChoices));
		const want = {
			Items: {
				brands: appState.brands.Item,
				value
			}
		};
		const give = {
			Price: {
				brand: appState.brands.IST,
				value: giveValue
			}
		};

		appState.wallet?.makeOffer(
			{
				source: 'contract',
				instance: appState.offerUpInstance,
				publicInvitationMarker: 'makeTradeInvitation'
			},
			{ give, want },
			undefined,
			(update: { status: string; data?: unknown }) => {
				if (update.status === 'error') {
					console.error('Offer failed', update.data);
				} else if (update.status === 'accepted') {
					console.log('Offer accepted', update.data);
				} else {
					console.log('Offer update', update);
				}
			}
		);
	};

	const fcPurse = appState.purses?.find((purse) => purse.brandPetname === 'IST');
	const itemsPurse = appState.purses?.find((purse) => purse.brandPetname === 'Item');

	const tryConnectWallet = (): void => {
		// connectWallet().catch((error: unknown) => {
		// 	if (typeof error !== 'object') {
		// 		console.error(error);
		// 		return;
		// 	}
		// 	if (!error) {
		// 		console.error('Unknown error');
		// 		return;
		// 	}
		// 	if (!('message' in error)) {
		// 		console.error(error);
		// 		return;
		// 	}
		// 	switch (error.message) {
		// 		case 'KEPLR_CONNECTION_ERROR_NO_SMART_WALLET': {
		// 			alert('No smart wallet found');
		// 			break;
		// 		}
		// 		default: {
		// 			alert(error.message);
		// 			break;
		// 		}
		// 	}
		// });
	};

	onMount(() => {
		return setup();
	});
</script>

<div class="container">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Listed Items</h1>

	<div>
		<!-- eslint-disable-next-line @typescript-eslint/no-non-null-assertion -->
		<Trade />

		{#if appState.wallet && fcPurse}
			<!-- eslint-disable-next-line @typescript-eslint/no-non-null-assertion -->
			<Inventory address={appState.wallet.address} istPurse={fcPurse} itemsPurse={itemsPurse!} />
		{/if}

		<Button onclick={tryConnectWallet}>Connect Wallet</Button>
	</div>
</div>
