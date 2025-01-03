<script lang="ts">
	import type { PageData } from './$types';
	import Overview from '../utils/overview/Overview.svelte';
	import MetaTag from '../utils/MetaTag.svelte';
	export let data: PageData;

  const description: string = 'extensive tracking of your Immich instance';
  const title: string = 'Overview';
</script>

<MetaTag {description} {title} />
<main class="p-4">
	<Overview {data} />
</main>
