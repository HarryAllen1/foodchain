<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { ClassNameValue } from 'tailwind-merge';

	let {
		text = '',
		children,
		className = '',
	}: {
		text?: string;
		children?: Snippet;
		className?: ClassNameValue;
	} = $props();
</script>

<div
	class={cn(
		'flex flex-col w-full h-full bg-gray-300 gap-2 items-center border-8 border-background',
		className,
	)}
>
	<div
		class="flex h-fit fill-accent-foreground h-max-[80%] w-[95%] items-center justify-center bg-gray-100 m-4"
	>
		{#if children}{@render children()}{/if}
	</div>
	<div class="text-foreground p-4">
		{text}
	</div>
</div>
