<script lang="ts">
	import { Card, Chart } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import ChartAllTime from '$lib/charts/chartAllTime';

	// Props
	export let title: string = 'title';
	export let subtitle: string = 'subtitle';
	export let timerange: 'day' | 'week' | 'month' | 'year';

	// State
	interface StatsData {
		body: {
			day: number;
			last_7_days: number;
			last_30_days: number;
			last_365_days: number;
			total: number;
		};
	}

	interface GrowthStats {
		body: {
			ownerId: string;
			timestamps: {}[];
			counts: {}[];
		}[];
	}

	let serverStats: StatsData | null = null;
	let growthStats: GrowthStats | null = null;
	let error: string | null = null;
	let chartOptions = ChartAllTime();

	// Fetch server stats
	onMount(async () => {
		try {
			const response = await fetch('/api/database/growthassets');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data: StatsData = await response.json();
			serverStats = data;
		} catch (err) {
			error = `Failed to fetch server stats: ${err.message}`;
			console.error(error);
		}

		try {
			const response = await fetch(`/api/database/${timerange}`);
			const data = await response.json();
			growthStats = data;

			const response2 = await fetch('/api/users');
			const data2 = await response2.json();

			updateChartData(data, data2);
		} catch (error) {
			console.error('Error fetching growth statistics:', error);
		}
	});

	// Compute display value based on timerange
	$: displayValue = (() => {
		if (!serverStats) return null;
		switch (timerange) {
			case 'day':
				return serverStats.body.day;
			case 'week':
				return serverStats.body.last_7_days;
			case 'month':
				return serverStats.body.last_30_days;
			case 'year':
				return serverStats.body.last_365_days;
			default:
				console.error('apiCall string does not match server info API');
				return null;
		}
	})();

	// Update chart data
	function updateChartData(postgresData: GrowthStats, usersData: []) {
		const idArray = postgresData.body.map((user) => user.ownerId);
		let namesArray = idArray.map((id) => usersData.find((user) => user.id === id)?.name);

		const timestamps = postgresData.body.map((user) => user.timestamps);
		const counts = postgresData.body.map((user) => user.counts);

		chartOptions.series = idArray.map((userName, index) => {
			return {
				name: namesArray[index],
				data: counts[index]
			};
		});

		chartOptions.xaxis = {
			type: 'datetime',
			categories: timestamps[0]
		};

		chartOptions.colors = [
			'#ffa600',
			'#ff7c43',
			'#f95d6a',
			'#d45087',
			'#a05195',
			'#665191',
			'#2f4b7c',
			'#003f5c'
		];
		chartOptions.stroke.colors = chartOptions.colors;
		chartOptions.legend.labels.colors = chartOptions.colors;

	}
</script>

{#if error}
	<Card class="items-center justify-between bg-red-50 dark:bg-red-900" size="xl">
		<div class="w-full">
			<p class="text-red-600 dark:text-red-200">{error}</p>
		</div>
	</Card>
{:else}
	<Card class="flex flex-col items-center justify-between" size="xl">
		<div class="w-full text-center">
			<p>{title}</p>
			{#if displayValue !== null}
				<h5 class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
					{displayValue}
				</h5>
			{:else}
				<p>Loading...</p>
			{/if}
		</div>
		<div class="mt-4 w-full">
			<Chart options={chartOptions} class="min-h-60 text-gray-900 dark:text-white" />
		</div>
	</Card>
{/if}
