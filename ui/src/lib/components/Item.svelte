<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';
	import { Label } from './ui/label';
	import { Input } from './ui/input';

	interface Props extends HTMLInputAttributes {
		icon?: Picture;
		coinIcon?: Picture;
		label: string;
		value?: number;
	}
	let { icon, coinIcon, label, value = $bindable(0), ...restProps }: Props = $props();
</script>

<div class="flex flex-col">
	<Label for={label}>
		{label.charAt(0).toUpperCase() + label.slice(1)}
	</Label>
	{#if icon}
		<enhanced:img src={icon} alt={label} class="size-8" />
	{/if}
	{#if coinIcon}
		<enhanced:img src={coinIcon} alt="coin" class="size-8" />
	{/if}
	<Input type="number" min={0} max={3} bind:value {...restProps} />
</div>
