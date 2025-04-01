<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import User from '@lucide/svelte/icons/user';
	import MainNav from './MainNav.svelte';
	import { page } from '$app/state';
</script>

<header
	class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-dashed backdrop-blur"
>
	<div class="container flex h-14 max-w-screen-2xl items-center mx-auto">
		<MainNav />
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<nav class="flex items-center">
				<a href="/login">
					<div
						class={cn(
							buttonVariants({
								size: 'sm',
								variant: 'ghost',
							}),
						)}
					>
						<User class="size-3 fill-current" />

						<span>
							{page.data}
							Distributor Login</span
						>
					</div>
				</a>
			</nav>
		</div>
	</div>
</header>
