<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
	import { dev } from '$app/environment';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	let ready = $state(false);

	onMount(() => {
		// globalThis.assert = (...rest: unknown[]) => true;

		const consoleTaming = dev ? 'unsafe' : 'safe';

		const interval = setInterval(() => {
			if (globalThis.harden) {
				// import('@endo/eventual-send/shim.js');
				globalThis.lockdown({
					errorTaming: 'unsafe',
					overrideTaming: 'severe',
					consoleTaming
				});
				console.log(globalThis.harden);
				clearInterval(interval);
				ready = true;
			}
		}, 100);
	});
</script>

{#if ready}
	{@render children?.()}
{:else}
	loading
{/if}
