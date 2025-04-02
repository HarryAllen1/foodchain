<script lang="ts">
	import { page as pageStore } from '$app/state';
	import { cn } from '$lib/utils.js';
	import Link from '@lucide/svelte/icons/link';

	const pages: {
		title: string;
		href: string;
	}[] = [
		{
			title: 'Search',
			href: '/search',
		},
	];
</script>

<div class="mr-4 flex">
	<a href="/" class="mr-20 flex items-center space-x-4 p-4">
		<img
			src="https://img.icons8.com/?size=100&id=8381&format=png&color=000000"
			alt="Foodchain Logo"
			width={50}
			height={50}
			class="rounded-full"
		/>
		<span class="hidden font-bold xl:inline-block"> Foodchain </span>
	</a>
	<nav class="flex items-center gap-6 text-sm">
		{#each pages as page (page.href)}
			<a
				href={page.href}
				class={cn(
					'hover:text-primary/80 transition-colors',
					pageStore.url.pathname === page.href ? 'text-primary' : 'text-primary/60',
				)}
			>
				{page.title}
			</a>
		{/each}
	</nav>
</div>
