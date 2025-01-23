<script lang="ts">
	import type { Purse } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import { stringifyAmountValue } from '@agoric/web-components';

	interface Props {
		address: string;
		istPurse: Purse;
		itemsPurse: Purse;
	}

	let { address, istPurse, itemsPurse }: Props = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>My Wallet</Card.Title>
		<Card.Description>
			<p>Address: {address}</p>
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<div>
			<b>FC:</b>
			{stringifyAmountValue(
				istPurse.currentAmount,
				istPurse.displayInfo.assetKind,
				istPurse.displayInfo.decimalPlaces
			)}
		</div>

		<div>
			<b>Items:</b>

			{#if itemsPurse}
				<ul>
					{#each itemsPurse.currentAmount.value.payload as item (item[0])}
						<li>{item[1]}: {item[0]}</li>
					{/each}
				</ul>
			{:else}
				None
			{/if}
		</div>
	</Card.Content>
</Card.Root>
