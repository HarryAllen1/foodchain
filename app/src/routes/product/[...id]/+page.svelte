<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
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
			<p class="leading-7 [&:not(:first-child)]:mt-6">{data.product.description}</p>
		</div>
	</div>
</div>
