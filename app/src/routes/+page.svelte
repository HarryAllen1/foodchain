<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { onMount } from 'svelte';
	import BarcodeScanner from './BarcodeScanner.svelte';
	import TypingAnimation from './TypingAnimation.svelte';
	import Frame from './Frame.svelte';

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

	<div
		class="w-screen grid sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:grid-rows-3 lg:grid-rows-1 place-items-center mt-16"
	>
		<Frame
			text="From the farm"
			className="rotate-5 hover:rotate-0 transition-transform duration-300"
		>
			<img
				src="https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D"
				alt="food"
				class="object-cover h-full w-full"
			/>
		</Frame>
		<Frame
			text="To the Warehouse"
			className="rotate-[-5deg] hover:rotate-0 transition-transform duration-300"
		>
			<img
				src="https://plus.unsplash.com/premium_photo-1661950006431-b10fd73ed917?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Zm9vZCUyMHdhcmVob3VzZXxlbnwwfHwwfHx8MA%3D%3D"
				alt="food"
				class="object-cover h-full w-full"
			/>
		</Frame>
		<Frame
			text="To the kitchen"
			className="rotate-[5deg] hover:rotate-0 transition-transform duration-300"
		>
			<img
				src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2l0Y2hlbnxlbnwwfHwwfHx8MA%3D%3D"
				alt="food"
				class="object-cover h-full w-full"
			/>
		</Frame>
	</div>
</div>
