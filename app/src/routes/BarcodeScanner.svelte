<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select';
	import { Html5Qrcode } from 'html5-qrcode';
	import { onDestroy, onMount } from 'svelte';

	let videoSources: { value: string; label: string }[] = $state([]);
	let source = $state('');
	const videoSourceTriggerContent = $derived(
		videoSources.find((src) => src.value === source)?.label ?? 'Select a source',
	);

	let codeReader: Html5Qrcode | undefined;

	const startVideo = (source: string): void => {
		codeReader?.stop();
		codeReader = new Html5Qrcode('video');

		codeReader.start(
			source,
			{
				fps: 10,
				qrbox: { width: 250, height: 250 },
			},
			(text) => {
				if (text.length > 0) {
					codeReader?.stop();

					// console.log(text);
					goto(`/product/${text}`);
				}
			},
			(error) => {
				if (error.includes('NotFoundException')) {
					return;
				}
				console.error(error);
			},
		);
	};

	$effect(() => {
		if (source.length > 0) {
			startVideo(source);
		}
	});
	onMount(async () => {
		const devices = await Html5Qrcode.getCameras();
		videoSources = devices.map((device) => ({
			value: device.id,
			label: device.label || `Camera ${device.id}`,
		}));
		if (videoSources.length > 0) {
			source = videoSources[0].value;
		}

		startVideo(source);
	});

	onDestroy(() => {
		codeReader?.stop();
	});
</script>

<Select.Root type="single" bind:value={source}>
	<Select.Trigger>
		{videoSourceTriggerContent}
	</Select.Trigger>
	<Select.Content>
		{#each videoSources as source (source.value)}
			<Select.Item value={source.value}>
				{source.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>

<div id="video"></div>
