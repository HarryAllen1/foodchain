<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let pid = $state('');
	let sid = $state('');
</script>

<div class="container mx-auto mt-8 flex flex-col items-center">
	<h1 class="text-center scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Search</h1>
	<p class="leading-7 text-center [&:not(:first-child)]:mt-6">
		Search for a product by name or shipment ID.
	</p>

	<div class="flex w-full max-w-sm flex-col gap-1.5 mt-4">
		<Label for="pid">Product ID</Label>
		<Input type="text" bind:value={pid} id="pid" placeholder="Banana" />
	</div>
	<div class="flex w-full max-w-sm flex-col gap-1.5 mt-4">
		<Label for="sid">Shipment ID</Label>
		<Input type="text" id="sid" bind:value={sid} placeholder="Banana" />
	</div>
	<Button
		class="mt-4"
		onclick={() => {
			goto(`/product/${pid}/${sid}`);
		}}
		disabled={pid.length === 0 || sid.length === 0}
	>
		Search
	</Button>
</div>
