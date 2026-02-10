<script lang="ts">
	let { title, value } = $props<{ title: string; value: string | number }>();
</script>

<div class="flex items-center justify-between rounded-lg bg-white p-6 shadow dark:bg-gray-800">
	<div>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{title}</p>
		<p class="text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl">{value}</p>
	</div>
</div>
