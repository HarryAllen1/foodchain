<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils.js';
	import User from '@lucide/svelte/icons/user';
	import MainNav from './MainNav.svelte';
</script>

<header
	class="border-border/40 bg-primary supports-[backdrop-filter]:bg-primary sticky top-0 z-50 w-full border-b text-primary-foreground"
>
	<div class="container flex h-16 max-w-screen-2xl items-center">
		<MainNav />
		<div class="grow"></div>
		<div class="flex items-center justify-between space-x-2 md:justify-end">
			<nav class="flex items-center">
				<a href="/login" class="relative">
					<div
						class={cn(
							buttonVariants({
								size: 'sm',
								variant: 'ghost',
							}),
							'size-10 p-0',
						)}
					>
						<User class="size-6 fill-current" />
						<span class="sr-only">Login</span>
					</div>
				</a>
			</nav>
		</div>
	</div>
</header>
