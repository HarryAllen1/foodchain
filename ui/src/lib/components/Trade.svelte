<script lang="ts">
	import bananaImage from '$lib/images/banana.webp?enhanced';
	import beanImage from '$lib/images/bean.webp?enhanced';
	import brocoliImage from '$lib/images/brocoli.webp?enhanced';
	import coinImage from '$lib/images/coin.webp?enhanced';
	import type { Purse } from '$lib/types';
	import { stringifyAmountValue } from '@agoric/web-components';
	import Item from './Item.svelte';
	import { Button } from './ui/button';

	interface Props {
		makeOffer: (giveValue: bigint, wantChoices: Record<string, bigint>) => void;
		istPurse: Purse;
		walletConnected: boolean;
	}

	let { istPurse, makeOffer, walletConnected }: Props = $props();

	const terms = {
		price: 250_000n,
		maxItems: 3n
	};

	const nameToIcon = {
		banana: bananaImage,
		bean: beanImage,
		brocoli: brocoliImage
	} as const;
	type ItemName = keyof typeof nameToIcon;
	type ItemChoices = Partial<Record<ItemName, bigint>>;

	const parseValue = (numeral: number, purse: Purse): bigint =>
		BigInt(Number(numeral) * 10 ** purse.displayInfo.decimalPlaces);

	let giveValue = $state(terms.price);
	let choices = $state<ItemChoices>({ bean: 1n, brocoli: 2n });
</script>

<div>
	<h3>Choose up to 3 items</h3>

	<div class="flex flex-row">
		{#each Object.entries(nameToIcon) as [title, icon] (title)}
			<Item
				{icon}
				value={Number(choices[title as ItemName] || 0n)}
				label={title}
				onchange={(
					event: Event & {
						currentTarget: EventTarget & HTMLInputElement;
					}
				) => {
					if (!event.target || !(event.target instanceof HTMLInputElement)) return;

					const quantity = BigInt(event.target.value);
					if (quantity > 0n) {
						choices[title as ItemName] = quantity;
					} else {
						// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
						delete choices[title as ItemName];
					}
				}}
				class={[
					Object.values(choices).reduce((curr, acc) => acc + curr, 0n) <= terms.maxItems
						? 'bg-green-200'
						: 'bg-red-300'
				]}
			/>
		{/each}
	</div>
	<div>
		<h3>Give: Offer at least 0.25 FoodCoin</h3>

		<div class="flex flex-row">
			<Item
				coinIcon={coinImage}
				bind:value={
					() =>
						Number(
							stringifyAmountValue(
								{ ...istPurse.currentAmount, value: giveValue },
								istPurse.displayInfo.assetKind,
								istPurse.displayInfo.decimalPlaces
							)
						),
					(value: number) => {
						giveValue = parseValue(value, istPurse);
					}
				}
				label="FC"
				class={giveValue >= terms.price ? 'bg-green-300' : 'bg-red-300'}
				step="0.01"
			/>
		</div>
	</div>
	<div>
		{#if walletConnected}
			<Button
				onclick={() => {
					makeOffer(giveValue, choices);
				}}>Make an offer</Button
			>
		{/if}
	</div>
</div>
