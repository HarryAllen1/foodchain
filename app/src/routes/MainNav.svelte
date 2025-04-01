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
	<a href="/" class="mr-20 flex items-center space-x-2">
		<Link class="size-10 gap-2 flex-row" />
	</a>
	<nav class="flex items-center gap-6 text-sm">
		{#each pages as page (page.href)}
			<a
				href={page.href}
				class={cn(
					'hover:text-primary-foreground/80 transition-colors',
					pageStore.url.pathname === page.href
						? 'text-primary-foreground'
						: 'text-primary-foreground/60',
				)}
			>
				{page.title}
			</a>
		{/each}
	</nav>
</div>
