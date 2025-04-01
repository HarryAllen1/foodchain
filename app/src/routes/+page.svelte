<script lang="ts">
	import { goto } from '$app/navigation';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { BrowserMultiFormatReader, NotFoundException, Result } from '@zxing/library';
	import { onMount } from 'svelte';

	let videoSources: { value: string; label: string }[] = $state([]);
	let source = $state('');
	const videoSourceTriggerContent = $derived(
		videoSources.find((src) => src.value === source)?.label ?? 'Select a source',
	);

	let videoElement: HTMLVideoElement | undefined = $state();

	let codeReader: BrowserMultiFormatReader;

	const startVideo = (source: string): void => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		codeReader.decodeFromVideoDevice(source, videoElement!, (result, error) => {
			if (result as Result | undefined) {
				const text = result.getText();
				if (text.length > 0) {
					codeReader.reset();
					videoElement?.pause();

					// console.log(text);
					goto(`/product/${text}`);
				}
			}

			if (error && !(error instanceof NotFoundException)) {
				console.error(error);
			}
		});
	};

	$effect(() => {
		if (source.length > 0) {
			startVideo(source);
		}
	});
	onMount(async () => {
		codeReader = new BrowserMultiFormatReader();

		const devices = await codeReader.listVideoInputDevices();
		videoSources = devices.map((device) => ({
			value: device.deviceId,
			label: device.label || `Camera ${device.deviceId}`,
		}));
		if (videoSources.length > 0) {
			source = videoSources[0].value;
		}

		startVideo(source);
	});
</script>

<svelte:head>
	<title>Foodchain</title>
</svelte:head>

<div class="container flex flex-col items-center mt-8 mx-auto">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
		Trace your item
	</h1>

	<Dialog.Root>
		<Dialog.Trigger
			class={buttonVariants({
				size: 'lg',
				class: 'my-8 text-lg',
			})}
		>
			Scan Barcode
		</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Title>Scan Barcode</Dialog.Title>

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

			<!-- svelte-ignore a11y_media_has_caption -->
			<video bind:this={videoElement}></video>
		</Dialog.Content>
	</Dialog.Root>

	<a href="/search" class="text-primary font-medium underline underline-offset-4">
		Or find manually
	</a>
</div>
