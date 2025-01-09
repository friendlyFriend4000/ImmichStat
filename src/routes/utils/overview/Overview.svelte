<script lang="ts">
  import type { PageData } from '../../(sidebar)/$types';
  import { onMount } from 'svelte';
  import getChartOptions from '../../(sidebar)/overview/chart_options';
	import CardServerVersion from './CardServerVersion.svelte';
	import CardServerStorage from './CardServerStorage.svelte';
	import CardServerStatistics from './CardServerStatistics.svelte';
	import ChartPieTotalMedia from './ChartPieTotalMedia.svelte';
  import CardGrowth from "./CardGrowth.svelte";


  export let data: PageData;

  let chartOptions = getChartOptions(false);
  chartOptions.series = data.series;

  let dark = false;

  function handler(ev: Event) {
    if ('detail' in ev && typeof ev.detail === 'boolean') {
      chartOptions = getChartOptions(ev.detail);
      chartOptions.series = data.series;
      dark = !!ev.detail;
    }
  }

  onMount(() => {
    document.addEventListener('dark', handler);
    return () => document.removeEventListener('dark', handler);
  });
</script>



<div class="mt-px space-y-4">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
			<CardServerVersion />
			<CardServerStorage title="Total Disk Size" apiCall="diskSizeRaw" />
			<CardServerStorage title="Free Disk Space" apiCall="diskAvailableRaw" />
			<CardServerStorage title="Disk Usage" apiCall="diskUsagePercentage" />
		</div>
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
		<!--		USERS-->
		<CardServerStatistics title="Users" apiCall="userCount" />
		<CardServerStatistics title="Total Media Size" apiCall="usage" />
		<CardServerStatistics title="Photos" apiCall="photos" />
		<CardServerStatistics title="Videos" apiCall="videos" />
	</div>
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
		<ChartPieTotalMedia mediaType="usage" title="Usage" subtitle="By User" />
		<ChartPieTotalMedia mediaType="photos" title="Total Photos" subtitle="By User" />
		<ChartPieTotalMedia mediaType="videos" title="Total Videos" subtitle="By User" />
	</div>
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
		<CardGrowth title="last 12 months" timerange="year" />
		<CardGrowth title="last 30 days" timerange="month" />
		<CardGrowth title="last 7 days" timerange="week" />
		<CardGrowth title="last 24h" timerange="day" />
	</div>

</div>



