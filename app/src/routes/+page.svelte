<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { onMount } from 'svelte';
	import BarcodeScanner from './BarcodeScanner.svelte';
	import TypingAnimation from './TypingAnimation.svelte';

	let open = $state(false);

	const taglines: string[] = [
		'Trace your food',
		'Know your food source',
		'Sustainable eating made easy',
		'From farm to table, we track it all',
	];

	// Randomly select a tagline from the array
	function getRandomTagline() {
		const randomIndex = Math.floor(Math.random() * taglines.length);
		return taglines[randomIndex];
	}

	let tagline = $state(getRandomTagline());

	onMount(() => {
		const interval = setInterval(() => {
			tagline = getRandomTagline();
		}, 4000);
	});
</script>

<svelte:head>
	<title>Foodchain</title>
</svelte:head>

<div class="container flex flex-col items-center mt-8 mx-auto">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
		Foodchain
	</h1>

	<TypingAnimation outerClass="p-2 m-2">{tagline}</TypingAnimation>

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
