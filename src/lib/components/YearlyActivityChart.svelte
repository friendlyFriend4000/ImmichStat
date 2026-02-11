<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApexOptions } from 'apexcharts';
	import { colorBlindMode } from '$lib/stores/settings';

	interface ActivityStat {
		ownerId: string;
		date: string;
		count: number;
	}

	interface User {
		id: string;
		name: string;
		email: string;
	}

	export let isDark: boolean = true;
	export let stats: ActivityStat[] = [];
	export let users: User[] = [];

	let selectedUserId: string = 'all';
	let chart: any;
	let chartElement: HTMLElement;

	$: filteredStats = selectedUserId === 'all' 
		? stats 
		: stats.filter(s => s.ownerId === selectedUserId);

	// Aggregate stats if 'all' is selected, otherwise just use filtered
	$: aggregatedStats = selectedUserId === 'all'
		? Object.entries(
			stats.reduce((acc, curr) => {
				acc[curr.date] = (acc[curr.date] || 0) + curr.count;
				return acc;
			}, {} as Record<string, number>)
		).map(([date, count]) => ({ date, count }))
		: filteredStats;

	$: chartOptions = getChartOptions(aggregatedStats, isDark, $colorBlindMode);

	function getChartOptions(
		data: { date: string; count: number }[],
		dark: boolean,
		colorBlind: boolean
	): ApexOptions {
        // We need to transform the data for the heatmap
        // X-axis: Weeks
        // Y-axis: Days of the week (Sun-Sat)

        // Generate data for the last 365 days
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        // Helper to format date key
        const formatDate = (d: Date) => d.toISOString().split('T')[0];

        // Create a map for quick lookup
        const dataMap = new Map(data.map(d => [d.date, d.count]));

        const seriesData = [];
        // Shift days to start with Mon
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Initialize series
        for (let i = 0; i < 7; i++) {
            seriesData.push({
                name: daysOfWeek[i],
                data: [] as { x: string; y: number }[]
            });
        }

        // Iterate through each day of the past year
        let currentDate = new Date(oneYearAgo);
        
        // Align to previous Monday to start cleanly
        // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
        // We want 0=Mon, ..., 6=Sun
        const getDayIndex = (d: Date) => {
            const day = d.getDay();
            return day === 0 ? 6 : day - 1;
        };

        const currentDayIndex = getDayIndex(currentDate);
        currentDate.setDate(currentDate.getDate() - currentDayIndex);

        while (currentDate <= today) {
            const dateStr = formatDate(currentDate);
            const count = dataMap.get(dateStr) || 0;
            const dayIndex = getDayIndex(currentDate);
            
            seriesData[dayIndex].data.push({
                x: dateStr,
                y: count
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        
		const colorScale = colorBlind
			? {
					ranges: [
						{ from: 0, to: 0, color: dark ? '#1f2937' : '#e0e0e0', name: 'None' },
						{ from: 1, to: 5, color: '#f0e442', name: 'Low' },
						{ from: 6, to: 10, color: '#e69f00', name: 'Medium' },
						{ from: 11, to: 1000000, color: '#d55e00', name: 'High' }
					]
				}
			: {
					ranges: [
						{ from: 0, to: 0, color: dark ? '#000000' : '#000000', name: 'None' },
						{ from: 1, to: 5, color: '#818cf8', name: 'Low' }, // indigo-400
						{ from: 6, to: 15, color: '#6366f1', name: 'Medium' }, // indigo-500
						{ from: 16, to: 1000000, color: '#4f46e5', name: 'High' } // indigo-600
					]
				};

		return {
			chart: {
				height: 200, // Compact height
				type: 'heatmap',
				toolbar: { show: false },
				fontFamily: 'inherit',
				animations: {
					enabled: true,
					speed: 800,
					animateGradually: {
						enabled: true,
						delay: 150
					},
					dynamicAnimation: {
						enabled: true,
						speed: 350
					}
				},
			             zoom: { enabled: false },
		              selection: { enabled: false }
			},
			series: seriesData.reverse(), // Reverse to put Sunday at top? Or keep standard
			plotOptions: {
				heatmap: {
					shadeIntensity: 0,
					radius: 2,
					useFillColorAsStroke: true,
					colorScale: colorScale,
                    distributed: false
				}
			},
			dataLabels: { enabled: false },
			stroke: { width: 1, colors: [dark ? '#0d1117' : '#ffffff'] }, // separator lines
			xaxis: {
				type: 'datetime',
				labels: { 
                    show: true,
                    style: { colors: dark ? '#9ca3af' : '#6b7280' },
                    format: 'MMM'
                },
				tooltip: { enabled: false },
                axisBorder: { show: false },
                axisTicks: { show: false }
			},
			yaxis: {
                show: true,
				labels: { 
                    style: { colors: dark ? '#9ca3af' : '#6b7280', fontSize: '10px' },
                    
                }
			},
			grid: { 
                show: false,
                padding: { top: 0, bottom: 0, left: 10, right: 10 } 
            },
			tooltip: { theme: dark ? 'dark' : 'light' },
            legend: { show: false }
		};
	}

	onMount(async () => {
		const ApexCharts = (await import('apexcharts')).default;
		chart = new ApexCharts(chartElement, chartOptions);
		chart.render();
	});

	$: if (chart && chartOptions) {
		chart.updateOptions(chartOptions, false, true, true);
	}
</script>

<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Photography Activity</h3>
			<p class="text-sm text-gray-500 dark:text-gray-400">Days you took photos with a camera in the last year</p>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">User:</span>
			<select
				bind:value={selectedUserId}
				class="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
			>
				<option value="all">All Users</option>
				{#each users as user}
					<option value={user.id}>{user.name || user.email}</option>
				{/each}
			</select>
		</div>
	</div>
	<div bind:this={chartElement}></div>
</div>

