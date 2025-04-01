<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="container mx-auto mt-8">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		{page.status}
	</h1>
	<p class="leading-7 [&:not(:first-child)]:mt-6">
		{page.error?.message}
	</p>
</div>
