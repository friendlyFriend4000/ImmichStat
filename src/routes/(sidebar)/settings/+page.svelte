<script lang="ts">
	import { Toggle, Card } from 'flowbite-svelte';
	import { userSettings } from '$lib/stores';
	import MetaTag from '../../utils/MetaTag.svelte';

	// Simplified toggle function using store update
	const toggleSetting = (key: keyof typeof $userSettings) => {
		userSettings.update(settings => ({
			...settings,
			[key]: !settings[key]
		}));
	};

	const path: string = '/settings';
  const description: string = 'extensive tracking of your Immich instance';
  const title: string = 'Settings';
  const subtitle: string = 'subtitle, message me if you see this';
</script>


<div class="max-w-2xl mx-auto p-4 space-y-6">
	<h1 class="text-3xl font-bold mb-6">Settings</h1>

	<Card>
		<div class="space-y-6">


			<div class="border-t dark:border-gray-600 my-4"></div>

			<div class="space-y-4">
				<h2 class="text-xl font-semibold">Display Settings</h2>
				<div class="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
					<div class="space-y-1">
						<h3 class="font-medium">Metric Units</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">
							Display file sizes using metric system (KB, MB, GB)
						</p>
					</div>
					<Toggle
						checked={$userSettings.isMetric}
						on:click={() => toggleSetting('isMetric')}
					/>
				</div>
			</div>

						<div class="border-t dark:border-gray-600 my-4"></div>
		</div>
	</Card>

	{#if import.meta.env.DEV}
		<Card>
			<h2 class="text-xl font-semibold mb-4">Debug Information</h2>
			<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
				{JSON.stringify($userSettings, null, 2)}
			</pre>
		</Card>
	{/if}
</div>

<MetaTag {path} {description} {title} {subtitle} />
