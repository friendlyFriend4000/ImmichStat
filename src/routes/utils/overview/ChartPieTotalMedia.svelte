<script lang="ts">
import { Card, Chart, Spinner } from 'flowbite-svelte';
import optionsPieChartTotalUsage from '$lib/charts/chartPieTotalUsage.ts';
import { onMount } from 'svelte';
import { userSettings } from '$lib/stores.ts';

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

// Props
export let mediaType: 'photos' | 'videos' | 'usage' = 'photos';
export let title: string = 'title';
export let subtitle: string = 'subtitle';

// State
let serverStats: ServerStats | null = null;
let chartOptions = optionsPieChartTotalUsage();

function convertBytes(bytes: number): string {
    const isMetric = $userSettings.isMetric;
    const kb = isMetric ? 1000 : 1024;
    const mb = kb * kb;
    const gb = mb * kb;
    const tb = gb * kb;

    let value = 0;
    let unit: 'B' | 'kB' | 'MB' | 'GB' | 'TB' | 'KiB' | 'MiB' | 'GiB' | 'TiB';

    if (bytes < kb) {
        value = bytes;
        unit = 'B';
    } else if (bytes >= kb && bytes < mb) {
        value = bytes / kb;
        unit = isMetric ? 'kB' : 'KiB';
    } else if (bytes >= mb && bytes < gb) {
        value = bytes / mb;
        unit = isMetric ? 'MB' : 'MiB';
    } else if (bytes >= gb && bytes < tb) {
        value = bytes / gb;
        unit = isMetric ? 'GB' : 'GiB';
    } else {
        value = bytes / tb;
        unit = isMetric ? 'TB' : 'TiB';
    }

    return `${parseFloat(value.toFixed(1))} ${unit}`;
}

function updateChartData(data: ServerStats) {
    // Extract user names and media values
    const userNames = data.usageByUser.map(user =>  user.userName);
    const mediaValues = data.usageByUser.map(user => {
        switch (mediaType) {
            case 'photos': return user.photos;
            case 'videos': return user.videos;
            case 'usage': return user.usage;
            default: throw new Error(`Invalid mediaType: ${mediaType}`);
        }
    });

    // Update chart options
    chartOptions.series = mediaValues;
    chartOptions.labels = userNames;
    chartOptions.colors = ['#ffa600', '#ff7c43', '#f95d6a', '#d45087', '#a05195', '#665191', '#2f4b7c', '#003f5c'];
    chartOptions.legend.labels.colors = chartOptions.colors;

    // Set formatters
    const decimalNumbers = 1;

    chartOptions.plotOptions.pie.donut.labels.total.formatter = () => {
        switch (mediaType) {
            case 'photos': return data.photos;
            case 'videos': return data.videos;
            case 'usage': return convertBytes(data.usage);
            default: throw new Error(`Invalid mediaType: ${mediaType}`);
        }
    };

    chartOptions.dataLabels.formatter = (value) => {
        switch (mediaType) {
            case 'photos': return (value / 100 * data.photos).toFixed(0);
            case 'videos': return (value / 100 * data.videos).toFixed(0);
            case 'usage': return convertBytes(value / 100 * data.usage);
            default: throw new Error(`Invalid mediaType: ${mediaType}`);
        }
    };

    chartOptions.tooltip.y.formatter = (value) => {
        const total = mediaType === 'photos' ? data.photos :
                     mediaType === 'videos' ? data.videos :
                     data.usage;
        return `${(value * 100 / total).toFixed(decimalNumbers)}%`;
    };
}

onMount(async () => {
    try {
        const response = await fetch('/api/server/statistics');
        const data = await response.json();
        serverStats = data;
        updateChartData(data);
    } catch (error) {
        console.error('Error fetching server statistics:', error);
    }
});
</script>

<Card size="xl" class="h-fit">
    <div class="mb-4 items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700 sm:flex">
        <div class="mb-4 w-full sm:mb-0">
            <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">
                {title}
            </h3>
            <div class="grid grid-cols-2">
                <span class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
                    {subtitle}
                </span>
                <span class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl text-right">
                    {#if serverStats}
                        {convertBytes(serverStats.usage)}
                    {:else}
                        Loading...
                    {/if}
                </span>
            </div>
        </div>
    </div>

    {#if serverStats}
        <Chart options={chartOptions} class="min-h-60 text-gray-900 dark:text-white" />
    {:else}
        <Spinner />
    {/if}
</Card>