export default () => {
	return {
		// create ten users placeholder to remove deleted users & data.
		// Assume there are only ten users. may need to create more
		// TODO find a more elegant solution to this
		colors: [],
		series: [
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			},
			{
				name: '',
				data: []
			}
		],
		chart: {
			type: 'area',
			stacked: false,
			height: 350,
			zoom: {
				enabled: false
			}
		},
		markers: {
			size: 0
		},
		dataLabels: {
			enabled: false
		},
		fill: {
			type: 'gradient',
			gradient: {
				shadeIntensity: 1,
				inverseColors: false,
				opacityFrom: 0.45,
				opacityTo: 0.05,
				stops: [20, 100, 100, 100]
			}
		},
		legend: {
			position: 'bottom',
			fontSize: '14px',
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: 'currentColor' // Updated to inherit color
			}
		},
		stroke: {
			colors: [
				'#ffa600',
				'#ff7c43',
				'#f95d6a',
				'#d45087',
				'#a05195',
				'#665191',
				'#2f4b7c',
				'#003f5c'
			],
			curve: 'monotoneCubic'
		},
		yaxis: {
			labels: {
				style: {
					colors: '#8e8da4'
				}
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			}
		},
		xaxis: {
			type: 'datetime',
			categories: [
				'2018-09-19T00:00:00.000Z',
				'2018-09-19T01:30:00.000Z',
				'2018-09-19T02:30:00.000Z',
				'2018-09-19T03:30:00.000Z',
				'2018-09-19T04:30:00.000Z',
				'2018-09-19T05:30:00.000Z',
				'2018-09-19T06:30:00.000Z'
			]
		},
		tooltip: {
			x: {
				color: '#000000',
				format: 'dd/MM/yy HH:mm'
			}
		}
	};
};
