<script lang="ts">
	// --- Imports ---
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import ServerStatsCard from '$lib/components/ServerStatsCard.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import VersionCard from '$lib/components/VersionCard.svelte';
	import DiskUsageCard from '$lib/components/DiskUsageCard.svelte';
	import GrowthChart from '$lib/components/GrowthChart.svelte';
	import DeviceUsageChart from '$lib/components/DeviceUsageChart.svelte';
	import AboutInfoCard from '$lib/components/AboutInfoCard.svelte';
	import { colorBlindMode } from '$lib/stores/settings';

	// --- Props ---
	let { data }: { data: PageData } = $props();

	// --- State ---
	let intervalId: ReturnType<typeof setInterval>;

	// --- Lifecycle ---
	onMount(() => {
		// Poll every 5 minutes
		intervalId = setInterval(() => {
			invalidateAll();
		}, 5 * 60 * 1000);
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	// --- Helper Functions ---
	function formatBytes(bytes: number | string, decimals = 2) {
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

	function isUpdateAvailable(currentVersion: typeof data.version, releaseVersion: string | null | undefined) {
		if (!currentVersion || !releaseVersion) return false;

		// Remove 'v' prefix and split
		const releaseParts = releaseVersion.replace(/^v/, '').split('.').map(Number);

		// Safety check
		if (releaseParts.length < 3) return false;

		const [rMajor, rMinor, rPatch] = releaseParts;
		const { major, minor, patch } = currentVersion;

		if (rMajor > major) return true;
		if (rMajor === major && rMinor > minor) return true;
		if (rMajor === major && rMinor === minor && rPatch > patch) return true;

		return false;
	}

	// --- Derived State ---
	let updateAvailable = $derived(isUpdateAvailable(data.version, data.versionCheck?.releaseVersion));
</script>

<!-- --- Main Layout --- -->
<div class="p-8 {$colorBlindMode ? 'bg-gray-50 dark:bg-slate-950' : ''} min-h-screen transition-colors duration-300">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Immich Statistics</h1>
		<div class="flex items-center gap-4">
			<button
				onclick={() => colorBlindMode.update((v) => !v)}
				class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
				title="Toggle Color Blindness Mode"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-5 w-5 {$colorBlindMode ? 'text-indigo-500' : 'text-gray-400'}"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.122.045.253 0 .375C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
				<span>Color Blind Mode: {$colorBlindMode ? 'On' : 'Off'}</span>
			</button>
		</div>
	</div>

	<!-- Error State -->
	{#if data.error}
		<div
			class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-200"
			role="alert"
		>
			<strong class="font-bold">Error!</strong>
			<span class="block sm:inline">{data.error}</span>
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#if data.version}
				<!-- Start of First Row (4 cards) -->
				<VersionCard
					version={data.version}
					{updateAvailable}
					availableVersion={data.versionCheck?.releaseVersion}
				/>

				{#if data.diskStorage}
					<StatCard
						title="Total Disk Size"
						value={formatBytes(data.diskStorage.diskSizeRaw, 2)}
					/>
					<StatCard
						title="Free Disk Space"
						value={formatBytes(data.diskStorage.diskAvailableRaw, 2)}
					/>
					<DiskUsageCard usagePercentage={data.diskStorage.diskUsagePercentage} />
				{/if}
				<!-- End of First Row -->

				<!-- Start of Second Row (4 cards) -->
				{#if data.statistics}
					<StatCard title="Users" value={data.statistics.usageByUser.length} />
					<StatCard title="Total Media Size" value={formatBytes(data.statistics.usage, 2)} />
					<StatCard title="Photos" value={data.statistics.photos} />
					<StatCard title="Videos" value={data.statistics.videos} />
				{/if}
				<!-- End of Second Row -->

				<!-- Start of Third Row (Charts) -->
				{#if data.statistics}
					<div class="col-span-1 md:col-span-2 lg:col-span-4">
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<ServerStatsCard
								title="Storage Usage"
								subtitle="By User"
								mediaType="usage"
								serverStats={data.statistics}
							/>
							<ServerStatsCard
								title="Photo Distribution"
								subtitle="By User"
								mediaType="photos"
								serverStats={data.statistics}
							/>
							<ServerStatsCard
								title="Video Distribution"
								subtitle="By User"
								mediaType="videos"
								serverStats={data.statistics}
							/>
						</div>
					</div>
				{/if}

				<!-- Start of Fourth Row (Growth Chart) -->
				<div class="col-span-1 md:col-span-2 lg:col-span-4">
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<GrowthChart title="24h" timerange="day" stats={data.dayStats} />
						<GrowthChart title="7 days" timerange="week" stats={data.weekStats} />
						<GrowthChart title="30 days" timerange="month" stats={data.monthStats} />
						<GrowthChart title="12 months" timerange="year" stats={data.yearStats} />
					</div>
					<div class="mt-4 grid grid-cols-1 gap-4">
						<GrowthChart title="5 Years" timerange="5years" stats={data.fiveYearStats} />
					</div>
					<div class="mt-4 grid grid-cols-1 gap-4">
						<DeviceUsageChart />
					</div>
				</div>
			{/if}
		</div>
		<AboutInfoCard
			aboutInfo={data.aboutInfo}
			serverFeatures={data.serverFeatures}
			serverConfig={data.serverConfig}
			versionHistory={data.versionHistory}
		/>
	{/if}
</div>
