<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { fancyConfirm } from '$lib/confirm';
	import type { Asset } from '$lib/utils';
	import type { Database } from '../../database.types';

	interface Props {
		shipment: Asset;
		session: string;
		owners: Database['public']['Tables']['owners']['Row'][];
	}

	let { shipment, session, owners }: Props = $props();

	let editOptions = [
		{
			label: 'Transfer',
			value: 'transfer',
		},
		{
			label: 'Transform',
			value: 'transform',
		},
	];
	let selectedEditOption = $state('transfer');
	let editTrigger = $derived(
		editOptions.find((option) => option.value === selectedEditOption)?.label ?? 'Select an option',
	);

	let ownerSelectOptions = $state(
		owners.map((owner) => ({
			label: owner.name,
			value: owner.name,
		})),
	);
	let selectedOwner = $state('');
	let selectedOwnerLabel = $derived(
		ownerSelectOptions.find((option) => option.value === selectedOwner)?.label ?? 'Select an owner',
	);

	let newItemID = $state('');
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'link' })}>
		{shipment.uuId}/{shipment.uuSId}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Shipment</Dialog.Title>
			<Dialog.Description>
				{shipment.uuId}
			</Dialog.Description>

			<div class="flex flex-col gap-2">
				<Select.Root type="single" bind:value={selectedEditOption}>
					<Select.Trigger>
						{editTrigger}
					</Select.Trigger>
					<Select.Content>
						{#each editOptions as option (option.value)}
							<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>

				{#if selectedEditOption === 'transfer'}
					<Select.Root type="single" bind:value={selectedOwner}>
						<Select.Trigger>
							{selectedOwnerLabel}
						</Select.Trigger>
						<Select.Content>
							{#each ownerSelectOptions as option (option.value)}
								<Select.Item value={option.value} label={option.label}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{:else}
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="id">Product Name</Label>
						<Input type="text" id="id" bind:value={newItemID} placeholder="something" />
					</div>
				{/if}
			</div>

			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Close</Dialog.Close>
				<Dialog.Close
					disabled={(selectedEditOption === 'transfer' && !selectedOwner) ||
						(selectedEditOption === 'transform' && !newItemID)}
					class={buttonVariants()}
					onclick={async () => {
						await fetch(`${PUBLIC_BLOCKCHAIN_URL}/invoke/supplychain/main`, {
							method: 'POST',
							headers: {
								Authorization: `Bearer ${session}`,
								'Content-Type': 'application/json',
							},
							body: JSON.stringify({
								method: `KVContract:${selectedEditOption}Shipment`,
								args:
									selectedEditOption === 'transfer'
										? [`${shipment.uuId}/${shipment.uuSId}`, selectedOwner]
										: [newItemID, JSON.stringify([`${shipment.uuId}/${shipment.uuSId}`])],
							}),
						});

						await fancyConfirm(
							'Success!',
							`Successfully ${selectedEditOption}ed ${shipment.uuId}/${shipment.uuSId} to ${
								selectedEditOption === 'transform' ? newItemID : selectedOwner
							}`,
						);
						await invalidateAll();
						newItemID = '';
						selectedOwner = '';
						selectedEditOption = 'transfer';
					}}
				>
					Save
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
