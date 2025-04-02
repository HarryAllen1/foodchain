<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		textClass = 'text-background-900 dark:text-background-100 font-mono text-lg font-bold',
		height = '100%',
		children,
		outerClass = '',
	}: {
		textClass?: string;
		height?: string;
		children?: Snippet;
		outerClass?: string;
	} = $props();
</script>

<div
	class={cn('flex items-center justify-center width-fit border-black', outerClass)}
	style={`height: ${height};`}
>
	<p class={cn('inline-block overflow-hidden whitespace-nowrap animate-typeAndDelete', textClass)}>
		{@render children?.()}
	</p>
</div>

<style>
	@keyframes typeAndDelete {
		0%,
		10% {
			width: 0;
		}
		45%,
		55% {
			width: 100%;
		}
		90%,
		100% {
			width: 0;
		}
	}

	.animate-typeAndDelete {
		animation: typeAndDelete 4s linear infinite;
	}
</style>
