<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { userSettings } from '$lib/stores';

	export let title: string = 'title';
	export let apiCall: 'photos' | 'usage' | 'userCount' | 'videos';

	interface ServerStats {
		photos: number;
		usage: number;
		usageByUser: {
			userId: string;
			userName: string;
			quotaSizeInBytes: number;
			usage: number;
			photos: number;
			videos: number;
		}[];
		videos: number;
	}

	let serverStats: ServerStats | null = null;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/server/statistics');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			serverStats = {
				...data,
				users: data.usageByUser.length
			};
		} catch (err) {
			error = `Failed to fetch server stats: ${err.message}`;
			console.error(error);
		}
	});

	type Unit = 'B' | 'kB' | 'MB' | 'GB' | 'TB' | 'MiB' | 'GiB' | 'TiB';

	function convertBytes(bytes: number): string {
		const isMetric = $userSettings.isMetric;
		const base = isMetric ? 1000 : 1024;
		const units: Unit[][] = [
			['B', 'B'],
			['kB', 'MiB'],
			['MB', 'GiB'],
			['GB', 'TiB'],
			['TB', 'TiB']
		];

		let power = 0;
		while (bytes >= Math.pow(base, power + 1) && power < 4) {
			power++;
		}

		const value = bytes / Math.pow(base, power);
		const unit = units[power][isMetric ? 0 : 1];

		return `${parseFloat(value.toFixed(1))} ${unit}`;
	}

	$: displayValue = (() => {
		if (!serverStats) return null;

		switch (apiCall) {
			case 'photos':
				return serverStats.photos;
			case 'usage':
				return convertBytes(serverStats.usage);
			case 'userCount':
				return serverStats.usageByUser.length;
			case 'videos':
				return serverStats.videos;
			default:
				console.error('apiCall string does not match server info API');
				return null;
		}
	})();
</script>

{#if error}
	<Card horizontal class="items-center justify-between bg-red-50 dark:bg-red-900" size="xl">
		<div class="w-full">
			<p class="text-red-600 dark:text-red-200">{error}</p>
		</div>
	</Card>
{:else}
	<Card horizontal class="items-center justify-between" size="xl">
		<div class="w-full">
			<p>{title}</p>
			{#if displayValue !== null}
				<h5 class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
					{displayValue}
				</h5>
			{:else}
				<p>Loading...</p>
			{/if}
		</div>
	</Card>
{/if}
