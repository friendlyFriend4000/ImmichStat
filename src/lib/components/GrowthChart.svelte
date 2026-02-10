<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ChartAssetsGrowth from '$lib/charts/chartAssetsGrowth';
	import { colorBlindMode, standardPalette, colorBlindPalette } from '$lib/stores/settings';

	// Props
	export let title: string = 'Growth (Last 24h)';
	export let timerange: 'day' | 'week' | 'month' | 'year' | '5years' = 'day';
	export let stats: GrowthStats | null = null;

	// State
	interface GrowthData {
		ownerId: string;
		timestamps: number[];
		counts: number[];
	}

	interface GrowthStats {
		body: GrowthData[];
	}

	interface UserData {
		id: string;
		name: string;
		email: string;
	}

	let growthStats: GrowthStats | null = stats;
	let error: string | null = null;

	$: if (stats) growthStats = stats;

	// Theme handling
	let isDark = false;
	
	// @ts-ignore
	let chartOptions = ChartAssetsGrowth(isDark);

	onMount(() => {
		const updateTheme = () => {
			isDark = document.documentElement.classList.contains('dark');
			if (chart) {
				const newOptions = ChartAssetsGrowth(isDark);
				// Preserve data when updating options
				newOptions.series = chartOptions.series;
				newOptions.xaxis = { ...newOptions.xaxis, categories: chartOptions.xaxis?.categories };
				
				// Preserve custom colors if they were set
				if (chartOptions.colors) {
					newOptions.colors = chartOptions.colors;
				}
				
				// Ensure stroke colors match main colors if they were customized
				if (chartOptions.stroke?.colors) {
					// We need to ensure we don't overwrite the theme-aware stroke settings
					// other than the colors themselves.
					newOptions.stroke = {
						...newOptions.stroke,
						colors: chartOptions.stroke.colors
					};
				}

				// We explicitly do NOT want to overwrite legend.labels.colors because that is what needs to change with theme
				// But we DO want to make sure the series colors (markers) are preserved.
				// ApexCharts usually derives marker colors from the main 'colors' array.
				
				chart.updateOptions(newOptions);
			} else {
				// If chart hasn't been created yet, just update the options so when it IS created, it uses the right theme
				const newOptions = ChartAssetsGrowth(isDark);
				// We don't have data yet usually, but preserve structure
				chartOptions = { ...chartOptions, ...newOptions };
			}
		};

		// Initial check
		updateTheme();

		// Create an observer to watch for class changes on the html element
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.attributeName === 'class') {
					updateTheme();
				}
			});
		});

		observer.observe(document.documentElement, {
			attributes: true
		});

		return () => {
		 observer.disconnect();
		};
	});
	let displayValue: number | null = null;
	let chartElement: HTMLElement;
	let chart: any = null;

	// Fetch stats
	onMount(async () => {
		// Load ApexCharts client-side
		const ApexCharts = (await import('apexcharts')).default;

		try {
			if (!stats) {
				const endpoint = `/api/database/${timerange}`;

				const response = await fetch(endpoint);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				growthStats = data;
			}

			const response2 = await fetch('/api/users');
			let userData = [];
			if (response2.ok) {
				userData = await response2.json();
			}

			if (growthStats) {
				updateChartData(growthStats, userData);
			}

			if (chartElement) {
				chart = new ApexCharts(chartElement, chartOptions);
				chart.render();
			}
		} catch (err: any) {
			error = `Failed to fetch growth statistics: ${err.message}`;
			console.error(error);
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});

	// Compute display value based on growthStats
	$: {
		if (growthStats && growthStats.body) {
			let total = 0;
			growthStats.body.forEach((userSeries) => {
				if (userSeries.counts && userSeries.counts.length > 0) {
					total += userSeries.counts[userSeries.counts.length - 1];
				}
			});
			displayValue = total;
		}
	}

	// Update chart data
	function updateChartData(postgresData: GrowthStats, usersData: UserData[]) {
		if (!postgresData || !postgresData.body) return;

		const idArray = postgresData.body.map((user) => user.ownerId);
		let namesArray = idArray.map((id) => {
			const found = usersData.find((user) => user.id === id);
			return found ? found.name : id.substring(0, 8); // Fallback to ID substring
		});

		// Ensure we have data
		if (postgresData.body.length === 0) return;

		// Assuming all series share the same timestamps
		const timestamps = postgresData.body[0].timestamps;
		const counts = postgresData.body.map((user) => user.counts);

		chartOptions.series = idArray.map((_, index) => {
			return {
				name: namesArray[index],
				data: counts[index]
			};
		});

		chartOptions.xaxis = {
			...chartOptions.xaxis,
			type: 'datetime',
			categories: timestamps
		};

		// Define colors
		const colors = $colorBlindMode ? colorBlindPalette : standardPalette;

		chartOptions.colors = colors;
		if (chartOptions.stroke) chartOptions.stroke.colors = colors;
		if (chartOptions.legend && chartOptions.legend.labels)
			chartOptions.legend.labels.colors = colors;
	}

	$: if (chart && growthStats && $colorBlindMode !== undefined) {
		const response2 = fetch('/api/users').then(r => r.json()).then(userData => {
			updateChartData(growthStats!, userData);
			chart.updateOptions(chartOptions);
		});
	}
</script>

{#if error}
	<div
		class="bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800 flex items-center justify-between rounded-lg border p-4 shadow-md"
	>
		<div class="w-full">
			<p class="text-red-600 dark:text-red-200">{error}</p>
		</div>
	</div>
{:else}
	<div class="flex flex-col items-center justify-between">
		<div class="w-full text-center">
			<p class="text-gray-500 dark:text-gray-400">{title}</p>
			{#if displayValue !== null}
				<h5 class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
					{displayValue}
				</h5>
			{:else}
				<p class="text-gray-400">Loading...</p>
			{/if}
		</div>
		<div class="mt-4 w-full" bind:this={chartElement}>
			<!-- Chart renders here -->
		</div>
	</div>
{/if}
