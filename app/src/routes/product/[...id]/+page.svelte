<script lang="ts">
	import { PUBLIC_GOOGLE_MAPS_API_KEY } from '$env/static/public';
	import * as googleLoader from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let mapElement: HTMLDivElement | undefined = $state();

	onMount(async () => {
		if (!mapElement) {
			return;
		}

		const loader = new googleLoader.Loader({
			apiKey: PUBLIC_GOOGLE_MAPS_API_KEY,
			version: 'weekly',
		});

		await loader.importLibrary('maps');
		await loader.importLibrary('core');
		await loader.importLibrary('marker');

		const map = new google.maps.Map(mapElement, {
			zoom: 2,
			mapId: 'b92cb68e2da8aab1',
			disableDefaultUI: true,
			center: {
				lat: 0,
				lng: 0,
			},
		});
	});
</script>

<div class="container my-8 mx-auto">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		{data.product.name}
	</h1>

	<div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] mt-8">
		<div>
			<img
				src={data.product.image_url}
				alt={data.product.name}
				class="w-full object-cover rounded-lg"
			/>
		</div>
		<div class="md:px-6 mt-4 md:mt-0">
			<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Shipment Details</h3>

			<ul class="list-none">
				<li>
					<strong>Shipment ID:</strong>
					{data.sid}
				</li>
			</ul>

			{#if data.product.description}
				<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Description</h3>
				<p class="leading-7 [&:not(:first-child)]:mt-6">{data.product.description}</p>
			{/if}

			{#if data.path}
				<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">Path</h3>

				<div class="size-96" bind:this={mapElement}></div>

				<p class="leading-7 [&:not(:first-child)]:mt-6">{JSON.stringify(data.path.response)}</p>
			{/if}
		</div>
	</div>
</div>
