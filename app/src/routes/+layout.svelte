<script lang="ts">
	import { type Snippet } from 'svelte';
	import '../app.css';
	import type { PageProps } from './$types';
	import Navbar from './Navbar.svelte';

	interface Props extends PageProps {
		children?: Snippet;
	}

	let { children, data }: Props = $props();
</script>

<Navbar {data} />

{@render children?.()}
