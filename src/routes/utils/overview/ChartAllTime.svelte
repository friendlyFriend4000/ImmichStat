<script lang="ts">
	import { Chart } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import ChartAllTime from '$lib/charts/chartAllTime';

	interface growthStats {
		body: {
			ownerId: string;
			timestamps: {}[];
			counts: {}[];
		}[];
	}

	// Props

	export let title: string = 'title';
	export let subtitle: string = 'subtitle';

	// State
	let serverStats: growthStats | null = null;
	let chartOptions = ChartAllTime();

	function updateChartData(postgresData: growthStats, usersData: []) {
		//postgres query from assets table returns ids instead of usernames
		//fetch('/api/users') gets the names and ids
		//swap out id for username
		//TODO sort the names and series properl, so that colors from cards can be matched
		const idArray = postgresData.body.map((user) => user.ownerId);

		let namesArray = idArray.map((id) => usersData.find((user) => user.id === id)?.name);

		const timestamps = postgresData.body.map((user) => user.timestamps);
		const counts = postgresData.body.map((user) => user.counts);

		console.log(usersData);

		chartOptions.series = idArray.map((userName, index) => {
			return {
				name: namesArray[index], // Set the series name to the current userName
				data: counts[index] // Use your actual data here
			};
		});

		chartOptions.xaxis = {
			type: 'datetime',
			categories: timestamps[0] // Assuming all users have the same timestamps
		};
	}

	onMount(async () => {
		try {
			const response = await fetch('/api/database/month');
			const data = await response.json();
			serverStats = data;

			const response2 = await fetch('/api/users');
			const data2 = await response2.json();

			updateChartData(data, data2);
		} catch (error) {
			console.error('Error fetching server statistics:', error);
		}
	});
</script>

<Chart options={chartOptions} class="min-h-60 text-gray-900 dark:text-white" />
