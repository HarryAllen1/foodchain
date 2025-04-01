<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import Navbar from './Navbar.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<Navbar />

{@render children?.()}
