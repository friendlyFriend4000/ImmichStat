<script lang="ts">
	import { Card, Progressbar } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { userSettings } from '$lib/stores';
	import { sineOut } from 'svelte/easing';

	type Unit = 'B' | 'kB' | 'MB' | 'GB' | 'TB' | 'MiB' | 'GiB' | 'TiB';

	interface ServerInfo {
		diskAvailable: string;
		diskAvailableRaw: number;
		diskSize: string;
		diskSizeRaw: number;
		diskUsagePercentage: number;
		diskUse: string;
		diskUseRaw: number;
	}

	interface Props {
		title: string;
		apiCall: keyof Pick<
			ServerInfo,
			'diskSizeRaw' | 'diskAvailableRaw' | 'diskUseRaw' | 'diskUsagePercentage'
		>;
	}

	export let title: Props['title'] = 'title';
	export let apiCall: Props['apiCall'];

	let serverInfo: ServerInfo | null = null;
	let error: string | null = null;

	const fetchServerInfo = async () => {
		try {
			const response = await fetch('/api/server/storage');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			serverInfo = data;
		} catch (err) {
			error = `Failed to fetch server info: ${err.message}`;
			console.error(error);
		}
	};

	onMount(fetchServerInfo);

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

	$: getValue = (key: Props['apiCall']): number | null => {
		if (!serverInfo) return null;
		return serverInfo[key];
	};

	$: displayValue = getValue(apiCall);
</script>

{#if error}
	<Card horizontal class="items-center justify-between bg-red-50 dark:bg-red-900" size="xl">
		<div class="w-full">
			<p class="text-red-600 dark:text-red-200">{error}</p>
		</div>
	</Card>
{:else if apiCall === 'diskUsagePercentage'}
	<Card horizontal class="items-center justify-between" size="xl">
		<div class="w-full">
			<p>{title}</p>
			<p class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
				{#if displayValue !== null}
					<Progressbar
						progress={displayValue}
						animate
						precision={2}
						labelInside
						tweenDuration={1500}
						easing={sineOut}
						size="h-6"
						labelInsideClass="bg-blue-600 text-blue-100 dark:text-white tracking-tight text-base font-medium text-center p-1 leading-none rounded-full"
						class="mb-4"
					/>
				{:else}
					Loading...
				{/if}
			</p>
		</div>
	</Card>
{:else}
	<Card horizontal class="items-center justify-between" size="xl">
		<div class="w-full">
			<p>{title}</p>
			<p class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">
				{#if displayValue !== null}
					{convertBytes(displayValue)}
				{:else}
					Loading...
				{/if}
			</p>
		</div>
	</Card>
{/if}
