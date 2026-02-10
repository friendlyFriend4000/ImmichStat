<script lang="ts">
	let { usagePercentage } = $props<{ usagePercentage: number }>();
</script>

<div class="flex flex-col justify-center rounded-lg bg-white p-6 shadow dark:bg-gray-800">
	<p class="mb-2 mt-1 text-sm text-gray-500 dark:text-gray-400">Disk Usage</p>
	<div class="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700">
		<div
			class="h-6 rounded-full bg-blue-600 p-0.5 text-center text-base font-medium leading-none tracking-tight text-blue-100 dark:text-white"
			style="width: {usagePercentage}%"
		>
			{#if usagePercentage >= 10}
				{usagePercentage.toFixed(2)}%
			{/if}
		</div>
	</div>
	{#if usagePercentage < 10}
		<p class="mt-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
			{usagePercentage.toFixed(2)}%
		</p>
	{/if}
</div>
