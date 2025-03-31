<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();

	let username = $state('');
	let password = $state('');
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="mx-auto mt-4 max-w-md">
		<Card.Header>
			<Card.Title>Login</Card.Title>
		</Card.Header>
		<form class="contents" use:enhance method="POST">
			<Card.Content class="space-y-4">
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="username">Username</Label>
					<Input id="username" name="username" required type="text" bind:value={username} />
				</div>
				<div class="flex w-full max-w-sm flex-col gap-1.5">
					<Label for="password">Password</Label>
					<Input id="password" name="password" required type="password" bind:value={password} />
				</div>

				{#if form?.error}
					<p class="text-destructive">{form.error}</p>
				{/if}
			</Card.Content>
			<Card.Footer>
				<Button type="submit" disabled={!username || !password}>Login</Button>
			</Card.Footer>
		</form>
	</Card.Root>

	<p class="mt-4 text-center">
		Don't have an account? <a href="/signup">Sign up.</a>
	</p>
</div>
