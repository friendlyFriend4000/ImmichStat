import type { ApexOptions } from 'apexcharts';

export default function optionsPieChartTotalUsage(): ApexOptions {
	return {
		series: [],
		chart: {
			animations: {
				enabled: true,
				speed: 800,
				animateGradually: {
					enabled: false,
					delay: 150
				},
				dynamicAnimation: {
					enabled: true,
					speed: 350
				}
			},
			height: 320,
			type: 'donut',
			fontFamily: 'Inter, sans-serif'
		},
		labels: [],
		colors: [],
		legend: {
			position: 'bottom',
			fontSize: '14px',
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: 'currentColor' // Updated to inherit color
			}
		},
		dataLabels: {
			enabled: true,
			enabledOnSeries: undefined,
			formatter: function (val, opts) {
				return val;
			},
			textAnchor: 'middle',
			distributed: false,
			offsetX: 0,
			offsetY: 0,
			style: {
				fontSize: '14px',
				fontFamily: 'Helvetica, Arial, sans-serif',
				fontWeight: 'bold',
				colors: undefined
			},
			background: {
				enabled: true,
				foreColor: 'currentColor', // Updated to inherit color
				padding: 4,
				borderRadius: 2,
				borderWidth: 1,
				borderColor: 'currentColor', // Updated to inherit color
				opacity: 0.9,
				dropShadow: {
					enabled: false,
					top: 1,
					left: 1,
					blur: 1,
					color: '#000',
					opacity: 0.45
				}
			},
			dropShadow: {
				enabled: false,
				top: 1,
				left: 1,
				blur: 1,
				color: '#000',
				opacity: 0.45
			}
		},
		plotOptions: {
			pie: {
				donut: {
					size: '70%',
					labels: {
						show: true,
						name: {
							show: true,
                            color: 'currentColor',
                            fontSize: '22px',
							fontFamily: 'Inter, sans-serif',

						},
						total: {
							showAlways: true,
							show: true,
							fontWeight: 600,
							fontSize: '30px',
							color: 'currentColor',
							label: 'Total',
							fontFamily: 'Inter, sans-serif'
						},
						value: {
							show: true,
							fontWeight: 600,
							fontSize: '30px',
							color: 'currentColor',
							fontFamily: 'Inter, sans-serif',

						}
					}
				}
			}
		},
		stroke: {
			curve: 'smooth',
			width: 2,
			colors: ['transparent']
		},
		tooltip: {
			enabled: true,
			theme: 'light', // You might want to make this dynamic based on current theme
			y: {
				formatter: function (val) {
					return val.toString();
				},
				title: {
					formatter: (val) => {
						return val;
					}
				}
			}
		}

	};
}

