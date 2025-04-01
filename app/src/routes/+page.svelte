<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import BarcodeScanner from './BarcodeScanner.svelte';

	let open = $state(false);
</script>

<svelte:head>
	<title>Foodchain</title>
</svelte:head>

<div class="container flex flex-col items-center mt-8 mx-auto">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
		Trace your item
	</h1>

	<Dialog.Root bind:open>
		<Dialog.Trigger
			class={buttonVariants({
				size: 'lg',
				class: 'my-8 text-lg',
			})}
		>
			Scan Barcode
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Title>Scan Barcode</Dialog.Title>

			<!-- ensure camera isn't used when dialog is closed -->
			{#if open}
				<BarcodeScanner />
			{/if}
		</Dialog.Content>
	</Dialog.Root>

	<a href="/search" class="text-primary font-medium underline underline-offset-4">
		Or find manually
	</a>
</div>
