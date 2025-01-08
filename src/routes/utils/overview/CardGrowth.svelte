<script lang="ts">
import { Card } from "flowbite-svelte";
import { onMount } from "svelte";

export let title: string = 'title';
export let timerange: 'day' | 'week' | 'month' | 'year';

interface StatsData {
    body: {
    day: number;
    last_7_days: number;
    last_30_days: number;
    last_365_days: number;
    total: number;
}
}

let serverStats: StatsData | null = null;
let error: string | null = null;

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
});

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
                <h5 class="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
                    {displayValue}
                </h5>
            {:else}
                <p>Loading...</p>
            {/if}
        </div>
    </Card>
{/if}