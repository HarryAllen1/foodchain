<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Plus from '@lucide/svelte/icons/plus';
	import type { PageProps } from './$types';
	import { PUBLIC_BLOCKCHAIN_URL } from '$env/static/public';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { fancyConfirm } from '$lib/confirm';

	let { data }: PageProps = $props();

	let open = $state(false);

	let shipmentName = $state('');
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

			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Dialog.Close>
				<Dialog.Close
					class={buttonVariants()}
					onclick={async () => {
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
							request: string;
						};

						shipmentName = '';

						await fancyConfirm(
							'Shipment created',
							`The shipment has been created successfully with ID ${shipmentResponse.request}.`,
						);
					}}>Create</Dialog.Close
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>
