<script lang="ts">
	import { enhance } from '$app/forms';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils.js';
	import LogOut from '@lucide/svelte/icons/log-out';
	import User from '@lucide/svelte/icons/user';
	import type { PageProps } from './$types';
	import MainNav from './MainNav.svelte';

	let { data }: PageProps = $props();
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-dashed backdrop-blur"
>
	<div class="container flex h-14 max-w-screen-2xl items-center mx-auto">
		<MainNav />
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<nav class="flex items-center">
				{#if data.session}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger class="flex flex-col items-end">
							<div class="text-lg font-bold">
								{data.user}
							</div>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.GroupHeading>Account</DropdownMenu.GroupHeading>
								<DropdownMenu.Separator />

								<DropdownMenu.Item>
									{#snippet child({ props })}
										<form use:enhance method="POST" {...props} action="/logout">
											<button type="submit" class="contents">
												<LogOut class="mr-2 size-4" />
												<span>Log out</span>
											</button>
										</form>
									{/snippet}
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<a
						href="/login"
						class={cn(
							buttonVariants({
								size: 'sm',
								variant: 'ghost',
							}),
						)}
					>
						<User class="size-3 fill-current" />

						<span> Distributor Login </span>
					</a>
				{/if}
			</nav>
		</div>
	</div>
</header>
