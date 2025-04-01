<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
    
</script>

<p>
    {JSON.stringify(data.path)}
</p>