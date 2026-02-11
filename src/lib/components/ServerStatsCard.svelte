<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type ApexCharts from 'apexcharts';
	import optionsPieChartTotalUsage from '$lib/charts/chartPieTotalUsage';
	import { colorBlindMode, standardPalette, colorBlindPalette } from '$lib/stores/settings';

	// Helper to format bytes
	function formatBytes(bytes: number | string, decimals = 1) {
		let value = 0;

		if (typeof bytes === 'string') {
			const match = bytes.match(/^([\d.]+)\s*([a-zA-Z]+)$/);
			if (match) {
				const val = parseFloat(match[1]);
				const unit = match[2];
				const binaryUnits: Record<string, number> = {
					B: 1,
					KiB: 1024,
					MiB: 1024 ** 2,
					GiB: 1024 ** 3,
					TiB: 1024 ** 4,
					PiB: 1024 ** 5
				};
				const metricUnits: Record<string, number> = {
					B: 1,
					KB: 1000,
					MB: 1000 ** 2,
					GB: 1000 ** 3,
					TB: 1000 ** 4,
					PB: 1000 ** 5
				};

				if (unit in binaryUnits) {
					value = val * binaryUnits[unit];
				} else if (unit in metricUnits) {
					value = val * metricUnits[unit];
				} else if (unit === 'Bytes') {
					value = val;
				} else {
					// Fallback if unit unknown
					value = val;
				}
			} else {
				value = parseFloat(bytes);
			}
		} else {
			value = bytes;
		}

		if (!value || isNaN(value)) return '0 Bytes';

		const k = 1000;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(value) / Math.log(k));

		const size = value / Math.pow(k, i);
		const factor = Math.pow(10, dm);
		const rounded = Math.floor(size * factor) / factor;

		return rounded.toFixed(dm) + ' ' + sizes[i];
	}

	interface ServerStats {
		usageByUser: {
			userName: string;
			photos: number;
			videos: number;
			usage: number;
		}[];
		usage: number;
		photos: number;
		videos: number;
	}

	let {
		mediaType = 'photos',
		title = 'title',
		subtitle = 'subtitle',
		serverStats
	} = $props<{
		mediaType?: 'photos' | 'videos' | 'usage';
		title?: string;
		subtitle?: string;
		serverStats: ServerStats | null;
	}>();

	let chartElement: HTMLElement | undefined = $state();
	let chart: ApexCharts | null = $state(null);
	let chartOptions = optionsPieChartTotalUsage();

	function updateChartData(data: ServerStats) {
		const userNames = data.usageByUser.map((user) => user.userName);
		const mediaValues = data.usageByUser.map((user) => {
			switch (mediaType) {
				case 'photos':
					return user.photos;
				case 'videos':
					return user.videos;
				case 'usage':
					return user.usage;
				default:
					return 0;
			}
		});

		chartOptions.series = mediaValues;
		chartOptions.labels = userNames;
		chartOptions.colors = $colorBlindMode ? colorBlindPalette : standardPalette;

		// Force animations to be enabled in options before update
		if (chartOptions.chart) {
			chartOptions.chart.animations = {
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
			};
		}
		
		if (chartOptions.legend) {
			chartOptions.legend.labels = { colors: chartOptions.colors };
		}

		// Update Formatters
		if (chartOptions.plotOptions?.pie?.donut?.labels?.total) {
			chartOptions.plotOptions.pie.donut.labels.total.label = '';
			chartOptions.plotOptions.pie.donut.labels.total.color = 'currentColor';

			if (chartOptions.plotOptions.pie.donut.labels.value) {
				chartOptions.plotOptions.pie.donut.labels.value.color = 'currentColor';
			}

			chartOptions.plotOptions.pie.donut.labels.total.formatter = () => {
				switch (mediaType) {
					case 'photos':
						return data.photos.toLocaleString();
					case 'videos':
						return data.videos.toLocaleString();
					case 'usage':
						return formatBytes(data.usage);
					default:
						return '';
				}
			};
		}

		if (chartOptions.dataLabels) {
			chartOptions.dataLabels.formatter = (val: number | number[]) => {
                const value = Array.isArray(val) ? val[0] : val;
                
                let total = 0;
                if (mediaType === 'photos') total = data.photos;
                else if (mediaType === 'videos') total = data.videos;
                else if (mediaType === 'usage') total = data.usage;

                const absValue = (value / 100) * total;
                
				switch (mediaType) {
					case 'photos':
					case 'videos':
						return absValue.toFixed(0);
					case 'usage':
						return formatBytes(absValue);
					default:
						return '';
				}
			};
		}

		if (chartOptions.tooltip) {
			chartOptions.tooltip.y = {
				formatter: (value: number) => {
					const total =
						mediaType === 'photos'
							? data.photos
							: mediaType === 'videos'
								? data.videos
								: data.usage;
					return `${((value / (total || 1)) * 100).toFixed(1)}%`;
				}
			};
		}
	}

	$effect(() => {
		if (serverStats && chart) {
			updateChartData(serverStats);
			chart.updateOptions(chartOptions, false, true, true);
		}
	});

	onMount(async () => {
		if (serverStats) {
			updateChartData(serverStats);
		}
		if (chartElement) {
			const ApexCharts = (await import('apexcharts')).default;
			chart = new ApexCharts(chartElement, chartOptions);
			chart.render();
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<div class="h-fit rounded-lg bg-white p-6 shadow dark:bg-gray-800">
	<div
		class="mb-4 items-center justify-between border-b border-gray-200 pb-4 sm:flex dark:border-gray-700"
	>
		<div class="mb-4 w-full sm:mb-0">
			<h3 class="text-base font-normal text-gray-500 dark:text-gray-400">
				{title}
			</h3>
			<div class="grid grid-cols-2">
				<span class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
					{subtitle}
				</span>
				<span
					class="text-right text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white"
				>
					{#if serverStats}
						{#if mediaType === 'photos'}
							{serverStats.photos.toLocaleString()}
						{:else if mediaType === 'videos'}
							{serverStats.videos.toLocaleString()}
						{:else if mediaType === 'usage'}
							{formatBytes(serverStats.usage)}
						{:else}
							Loading...
						{/if}
					{:else}
						Loading...
					{/if}
				</span>
			</div>
		</div>
	</div>

	{#if serverStats}
		<div bind:this={chartElement} class="min-h-60 text-gray-900 dark:text-white"></div>
	{:else}
		<div class="flex h-60 items-center justify-center">
			<svg
				class="mr-2 inline h-8 w-8 animate-spin text-gray-200 dark:text-gray-600 fill-blue-600"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
			<span class="sr-only">Loading...</span>
		</div>
	{/if}
</div>
