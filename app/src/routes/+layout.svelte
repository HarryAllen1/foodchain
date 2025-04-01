<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import '../app.css';
	import Navbar from './Navbar.svelte';
	import type { PageProps } from './$types';
	import { invalidate } from '$app/navigation';

	interface Props extends PageProps {
		children?: Snippet;
	}

	let { children, data }: Props = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<Navbar />

{@render children?.()}
