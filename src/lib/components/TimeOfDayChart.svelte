<script lang="ts">
	import { onMount } from 'svelte';
	import type { ApexOptions } from 'apexcharts';
	import { colorBlindMode } from '$lib/stores/settings';

	interface TimeOfDayStat {
		day_of_week: number;
		hour_of_day: number;
		count: number;
	}

	export let isDark: boolean = true;
	export let stats: TimeOfDayStat[] = [];

	let chart: any;
	let chartElement: HTMLElement;

	$: chartOptions = getChartOptions(stats, isDark, $colorBlindMode);

	function getChartOptions(
		data: TimeOfDayStat[],
		dark: boolean,
		colorBlind: boolean
	): ApexOptions {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const hours = Array.from({ length: 24 }, (_, i) => i); // 0 to 23

		// Initialize matrix with 0s
		const matrix: number[][] = Array(7)
			.fill(0)
			.map(() => Array(24).fill(0));

		// Fill matrix with data
		data.forEach((stat) => {
			// Ensure valid indices
			if (
				stat.day_of_week >= 0 &&
				stat.day_of_week < 7 &&
				stat.hour_of_day >= 0 &&
				stat.hour_of_day < 24
			) {
				matrix[stat.day_of_week][stat.hour_of_day] = stat.count;
			}
		});

		// ApexCharts Heatmap expects series in format: { name: 'Row Name', data: [{ x: 'Col Name', y: Value }] }
		// But for a heatmap where X is hours and Y is days:
		const series = days.map((day, dayIndex) => {
			return {
				name: day,
				data: hours.map((hour) => ({
					x: hour.toString().padStart(2, '0') + ':00',
					y: matrix[dayIndex][hour]
				}))
			};
		}).reverse(); // Reverse so Sunday is at top if desired, or Monday. usually heatmap Y axis starts from top.

		// Determine colors based on mode
		const colorScale = colorBlind
			? {
					ranges: [
						{ from: 0, to: 0, color: dark ? '#1f2937' : '#f3f4f6', name: 'None' }, // gray-800 / gray-100
						{ from: 1, to: 10, color: '#f0e442', name: 'Low' },
						{ from: 11, to: 50, color: '#e69f00', name: 'Medium' },
						{ from: 51, to: 1000000, color: '#d55e00', name: 'High' }
					]
				}
			: {
					ranges: [
						{ from: 0, to: 0, color: dark ? '#1f2937' : '#f3f4f6', name: 'None' },
						{ from: 1, to: 10, color: '#818cf8', name: 'Low' }, // indigo-400
						{ from: 11, to: 50, color: '#6366f1', name: 'Medium' }, // indigo-500
						{ from: 51, to: 1000000, color: '#4f46e5', name: 'High' } // indigo-600
					]
				};

		return {
			chart: {
				height: 350,
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
				}
			},
			series: series,
			plotOptions: {
				heatmap: {
					shadeIntensity: 0.5,
					radius: 0,
					useFillColorAsStroke: false,
					colorScale: colorScale
				}
			},
			dataLabels: { enabled: false },
			stroke: { width: 1, colors: [dark ? '#111827' : '#555555'] }, // separator lines
			xaxis: {
				type: 'category',
				labels: { style: { colors: dark ? '#9ca3af' : '#6b7280' } },
				tooltip: { enabled: false }
			},
			yaxis: {
				labels: { style: { colors: dark ? '#9ca3af' : '#6b7280' } }
			},
			grid: { padding: { right: 20 } },
			tooltip: { theme: dark ? 'dark' : 'light' },
            colors: [colorBlind ? '#d55e00' : '#4f46e5'] // Fallback base color
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
	<div class="mb-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Time of Day Usage</h3>
		<p class="text-sm text-gray-500 dark:text-gray-400">Heatmap of when photos are taken</p>
	</div>
	<div bind:this={chartElement}></div>
</div>
