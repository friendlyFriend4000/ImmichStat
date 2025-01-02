<script lang="ts">
	import { Toggle, Card } from 'flowbite-svelte';
	import { userSettings } from '$lib/stores';
	import MetaTag from '../../utils/MetaTag.svelte';

	// Simplified toggle function using store update
	const toggleSetting = (key: keyof typeof $userSettings) => {
		userSettings.update((settings) => ({
			...settings,
			[key]: !settings[key]
		}));
	};

	const path: string = '/settings';
	const description: string = 'extensive tracking of your Immich instance';
	const title: string = 'Settings';
</script>

<div class="mx-auto max-w-2xl space-y-6 p-4">
	<h1 class="mb-6 text-3xl font-bold">Settings</h1>

	<Card>
		<div class="space-y-6">
			<div class="my-4 border-t dark:border-gray-600"></div>

			<div class="space-y-4">
				<h2 class="text-xl font-semibold">Display Settings</h2>
				<div
					class="flex items-center justify-between rounded p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					<div class="space-y-1">
						<h3 class="font-medium">Metric Units</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Display file sizes using metric system (KB, MB, GB)
						</p>
					</div>
					<Toggle checked={$userSettings.isMetric} on:click={() => toggleSetting('isMetric')} />
				</div>
			</div>

			<div class="my-4 border-t dark:border-gray-600"></div>
		</div>
	</Card>

	{#if import.meta.env.DEV}
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Debug Information</h2>
			<pre class="overflow-auto rounded bg-gray-100 p-4 dark:bg-gray-800">
				{JSON.stringify($userSettings, null, 2)}
			</pre>
		</Card>
	{/if}
</div>

<MetaTag {description} {title} />
