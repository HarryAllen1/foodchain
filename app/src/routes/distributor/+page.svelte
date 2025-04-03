<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Plus from '@lucide/svelte/icons/plus';
	import type { PageProps } from './$types';
	import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';
	import * as Table from '$lib/components/ui/table';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { fancyConfirm } from '$lib/confirm';
	import { invalidateAll } from '$app/navigation';
	import Shipment from './Shipment.svelte';
	import { Switch } from '$lib/components/ui/switch';

	let { data }: PageProps = $props();

	let open = $state(false);

	let shipmentName = $state('');

	let isCreatingProduct = $state(false);

	let description = $state('');
	let imageURL = $state('');
</script>

<div class="container mx-auto mt-8">
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants()}>
			<Plus class="mr-2 size-4" />
			<span>Create Item</span>
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Create Item</Dialog.Title>
				<Dialog.Description>Create a new item to be added to the blockchain.</Dialog.Description>
			</Dialog.Header>

			<div class="flex w-full max-w-sm flex-col gap-1.5 mt-4">
				<Label for="id">Shipment name (ID)</Label>
				<Input type="text" id="id" bind:value={shipmentName} placeholder="Apple" />
			</div>

			<div class="flex items-center space-x-2">
				<Switch id="create" bind:checked={isCreatingProduct} />
				<Label for="create">Do you need to create an associated product?</Label>
			</div>

			{#if isCreatingProduct}
				<div class="flex w-full max-w-sm flex-col gap-1.5 mt-4">
					<Label for="desc">Description</Label>
					<Input type="text" id="desc" bind:value={description} placeholder="A juicy fruit" />
				</div>
				<div class="flex w-full max-w-sm flex-col gap-1.5 mt-4">
					<Label for="url">Image URL</Label>
					<Input type="url" id="url" bind:value={imageURL} placeholder="https://..." />
				</div>
			{/if}

			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Dialog.Close
					class={buttonVariants()}
					onclick={async () => {
						if (isCreatingProduct) {
							await data.supabase.from('products').insert({
								id: shipmentName,
								name: shipmentName,
								image_url: imageURL,
								description,
							});
						}

						const createShipmentRequest = await fetch(
							`${PUBLIC_BLOCKCHAIN_URL}/invoke/supplychain/main`,
							{
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
									Authorization: `Bearer ${data.session ?? ''}`,
								},
								body: JSON.stringify({
									method: 'KVContract:createShipment',
									args: [shipmentName],
								}),
							},
						);

						const shipmentResponse = (await createShipmentRequest.json()) as {
							response: string;
						};

						shipmentName = '';
						await fancyConfirm(
							'Shipment created',
							`The shipment has been created successfully with ID ${shipmentResponse.response}.`,
							[['OK', true]],
						);
						await invalidateAll();
					}}
				>
					Create
				</Dialog.Close>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Item ID</Table.Head>
				<Table.Head>Previous Owners</Table.Head>
				<Table.Head>Made with</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.shipments.response as shipment, i (i)}
				<Table.Row>
					<Table.Cell>
						<Shipment session={data.session ?? ''} {shipment} owners={data.owners} />
					</Table.Cell>
					<Table.Cell>
						{shipment.pastOwners.join(', ')}
					</Table.Cell>
					<Table.Cell>
						{shipment.parentShipments.join(', ')}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
