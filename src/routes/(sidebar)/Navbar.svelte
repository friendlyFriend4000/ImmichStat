<script>
	import { DarkMode, NavBrand, NavHamburger, Navbar } from 'flowbite-svelte';
	import '../../app.pcss';

	export let fluid = true;
	export let drawerHidden = false;
	export let list = false;

</script>

<Navbar {fluid} class="text-black" color="default">
	<NavHamburger
		onClick={() => (drawerHidden = !drawerHidden)}
		class="m-0 me-3 md:block lg:hidden"
	/>
	<NavBrand href="/" class={list ? 'w-40' : 'lg:w-60'}>
		<img src="/images/immichstat_icon.svg" class="me-2.5 h-6 sm:h-8" alt="Flowbite Logo" />
		<span
			class="ml-px self-center whitespace-nowrap text-xl font-semibold sm:text-2xl dark:text-white"
		>
			ImmichStat
		</span>
	</NavBrand>
	<div class="hidden lg:block lg:ps-3">
		<DarkMode />
	</div>
</Navbar>
