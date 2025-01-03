<script lang="ts">
	import type { PageData } from './$types';
	import Overview from '../utils/overview/Overview.svelte';
	import MetaTag from '../utils/MetaTag.svelte';
	export let data: PageData;

	const path: string = '/';
  const description: string = 'extensive tracking of your Immich instance';
  const title: string = 'Overview';
  const subtitle: string = 'subtitle, message me if you see this';
</script>

<MetaTag {description} {title} />
<main class="p-4">
	<Overview {data} />
</main>
