<script lang="ts">
	// --- Imports ---
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	// --- Props ---
	let { children } = $props();

	// --- State ---
	let isDark = $state(true);

	// --- Lifecycle ---
	onMount(() => {
		if (localStorage.theme === 'light') {
			isDark = false;
		} else {
			isDark = true;
			// Ensure it's stored if not already present
			if (!('theme' in localStorage)) {
				localStorage.theme = 'dark';
			}
		}
	});

	// --- Actions ---
	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- --- Main Layout --- -->
<div
	class="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100"
>
	<!-- Header -->
	<header
		class="flex items-center justify-between border-b bg-white p-4 shadow-sm dark:bg-gray-800 dark:border-gray-700"
	>
		<div class="flex items-center gap-4">
			<div class="text-xl font-bold">ImmichStat</div>
			<!-- Github Button -->
			<a
				href="https://github.com/friendlyFriend4000/ImmichStat/"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-lg bg-gray-200 p-2 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600"
				aria-label="View on GitHub"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="h-6 w-6 text-gray-700 dark:text-gray-300"
				>
					<path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
					/>
					<path d="M9 18c-4.51 2-5-2-7-2" />
				</svg>
			</a>
		</div>
		<div class="flex items-center gap-2">
			<!-- Theme Toggle Button -->
			<button
				onclick={toggleTheme}
				class="rounded-lg bg-gray-200 p-2 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-700 dark:hover:bg-gray-600"
				aria-label="Toggle Dark Mode"
			>
				{#if isDark}
					<!-- Moon Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-gray-700 dark:text-gray-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				{:else}
					<!-- Sun Icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 text-yellow-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</header>
	<!-- Page Content -->
	<main>
		{@render children()}
	</main>
</div>
