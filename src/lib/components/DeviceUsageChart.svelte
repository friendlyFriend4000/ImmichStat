<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApexOptions } from 'apexcharts';
	import { colorBlindMode, standardPalette, colorBlindPalette } from '$lib/stores/settings';

	interface DeviceUsage {
		userName: string;
		make: string;
		model: string;
		start: string;
		end: string;
		count: number;
	}

	export let isDark: boolean = true;

	let chart: any;
	let chartElement: HTMLElement;
	let data: DeviceUsage[] = [];

	let modelMap: Record<string, string> = {};

	async function fetchModelMap() {
		try {
			const response = await fetch('/device-models.json');
			modelMap = await response.json();
		} catch (error) {
			console.error('Error fetching model map:', error);
		}
	}

	function getFriendlyName(model: string) {
		// Try exact match
		if (modelMap[model]) return modelMap[model];

		// Try prefix match (for variants like SM-G960F/DS)
		for (const [key, value] of Object.entries(modelMap)) {
			if (model.startsWith(key)) return value;
		}

		return model;
	}
	let loading = true;
	let minEntries = 50;
	let minDuration = 'month';

	$: filteredData = data.filter((d) => {
		const countMatch = d.count >= minEntries;
		if (!countMatch) return false;

		if (minDuration === 'all') return true;

		const start = new Date(d.start).getTime();
		const end = new Date(d.end).getTime();
		const durationMs = end - start;

		const dayMs = 24 * 60 * 60 * 1000;
		switch (minDuration) {
			case 'day':
				return durationMs >= dayMs;
			case 'week':
				return durationMs >= 7 * dayMs;
			case 'month':
				return durationMs >= 30 * dayMs;
			case 'year':
				return durationMs >= 365 * dayMs;
			default:
				return true;
		}
	});

	async function fetchData() {
		try {
			const response = await fetch('/api/devices/usage');
			data = await response.json();
		} catch (error) {
			console.error('Error fetching device usage:', error);
		} finally {
			loading = false;
		}
	}

	$: userPalette = $colorBlindMode ? colorBlindPalette : standardPalette;

	// Map to keep track of colors assigned to each user
	let userColorMap: Record<string, string> = {};

	function getUserColor(userName: string, allData: DeviceUsage[], palette: string[]) {
		if (userColorMap[userName]) return userColorMap[userName];

		// Get all unique user names in their order of appearance in the dataset
		// This ensures consistent color assignment based on the data
		const uniqueUsers = [...new Set(allData.map(d => d.userName))];
		const userIndex = uniqueUsers.indexOf(userName);
		
		// Assign color based on the fixed palette, looping if there are more users than colors
		const color = palette[userIndex % palette.length];
		userColorMap[userName] = color;
		return color;
	}

	function getChartOptions(usageData: DeviceUsage[]): ApexOptions {
		// Group data for the rangeBar chart
		// Y-axis: User - Device
		// X-axis: Time range

		const seriesData = usageData.map((d) => {
			const friendlyName = getFriendlyName(d.model);
			// Always use two lines: User Name on top, Device Name below
			const xLabel = [d.userName, friendlyName];

			return {
				x: xLabel,
				y: [new Date(d.start).getTime(), new Date(d.end).getTime()],
				fillColor: getUserColor(d.userName, usageData, userPalette),
				count: d.count,
				make: d.make,
				model: d.model,
				userName: d.userName,
				start: d.start,
				end: d.end
			};
		});

		return {
			chart: {
				height: Math.max(350, seriesData.length * 50),
				type: 'rangeBar',
				toolbar: {
					show: false
				},
				zoom: {
					enabled: false
				},
				fontFamily: 'inherit'
			},
			plotOptions: {
				bar: {
					horizontal: true,
					barHeight: '70%',
					rangeBarGroupRows: true
				}
			},
			xaxis: {
				type: 'datetime',
				labels: {
					style: {
						colors: isDark ? '#9ca3af' : '#6b7280'
					}
				},
				axisBorder: {
					color: isDark ? '#374151' : '#e5e7eb'
				},
				axisTicks: {
					color: isDark ? '#374151' : '#e5e7eb'
				}
			},
			yaxis: {
				labels: {
					style: {
						colors: isDark ? '#9ca3af' : '#6b7280'
					}
				}
			},
			grid: {
				borderColor: isDark ? '#374151' : '#e5e7eb',
				xaxis: {
					lines: {
						show: true
					}
				}
			},
			tooltip: {
				theme: isDark ? 'dark' : 'light',
				custom: function({ series, seriesIndex, dataPointIndex, w }) {
					const d = w.config.series[seriesIndex].data[dataPointIndex];
					const start = new Date(d.start).toLocaleDateString();
					const end = new Date(d.end).toLocaleDateString();
					return `
						<div class="p-2">
							<div class="font-bold">${d.userName}</div>
							<div>${d.make} ${getFriendlyName(d.model)}</div>
							<div class="text-xs text-gray-500 mb-1">${d.model}</div>
							<div class="text-sm text-gray-400">${start} - ${end}</div>
							<div class="text-xs text-indigo-400 mt-1">${d.count} assets</div>
						</div>
					`;
				}
			},
			series: [
				{
					data: seriesData
				}
			]
		};
	}

	onMount(async () => {
		await Promise.all([fetchData(), fetchModelMap()]);
		const ApexCharts = (await import('apexcharts')).default;
		chart = new ApexCharts(chartElement, getChartOptions(filteredData));
		chart.render();
	});

	// Reset the color map when the base data changes to ensure consistent indexing
	$: if (data) {
		userColorMap = {};
	}

	$: if (chart && filteredData && userPalette) {
		userColorMap = {}; // Reset color map to ensure new palette is applied
		chart.updateOptions(getChartOptions(filteredData));
	}
</script>

<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Device Usage Over Time</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400">Timeline of devices used by each user</p>
			<p class="mt-1 text-xs text-indigo-600 dark:text-indigo-400">
				Model number instead of model name? Open an issue  
				<a href="https://github.com/friendlyFriend4000/ImmichStat/issues" target="_blank" rel="noopener noreferrer" class="underline hover:text-indigo-800 dark:hover:text-indigo-300">HERE</a>.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-4">
			<div class="flex items-center gap-2">
				<span class="text-sm text-gray-500 dark:text-gray-400">Min. Duration Used:</span>
				<select
					bind:value={minDuration}
					class="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
				>
					<option value="all">Any</option>
					<option value="day">Day</option>
					<option value="week">Week</option>
					<option value="month">Month</option>
					<option value="year">Year</option>
				</select>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-sm text-gray-500 dark:text-gray-400">Min. Assets taken</span>
				<select
					bind:value={minEntries}
					class="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
				>
					<option value={0}>All</option>
					<option value={10}>10</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</select>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="flex h-[350px] items-center justify-center">
			<div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
		</div>
	{:else}
		<div bind:this={chartElement}></div>
	{/if}
</div>
