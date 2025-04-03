<script module lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { alertMessage, alertTitle, open, options, result } from './confirm.js';
</script>

<AlertDialog.Root bind:open={$open}>
	<AlertDialog.Content>
		<AlertDialog.Title>
			{$alertTitle}
		</AlertDialog.Title>
		<AlertDialog.Description>
			{$alertMessage}
		</AlertDialog.Description>
		<AlertDialog.Footer>
			{#each $options as option (option[0])}
				{#if option[1]}
					<AlertDialog.Action onclick={() => ($result = true)}>
						{option[0]}
					</AlertDialog.Action>
				{:else}
					<AlertDialog.Cancel onclick={() => ($result = false)}>
						{option[0]}
					</AlertDialog.Cancel>
				{/if}
			{/each}
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
