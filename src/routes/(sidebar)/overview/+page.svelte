<script lang="ts">
	import Overview from '../../utils/overview/Overview.svelte';
	import MetaTag from '../../utils/MetaTag.svelte';
	import Footer from '../Footer.svelte';
	export let data;

	const path: string = '/overview';
	const description: string = 'extensive tracking of your Immich instance';
	const title: string = 'Overview';
</script>

<MetaTag {description} {title} />

<main class="p-4">
	<Overview {data} />
</main>
<Footer />
