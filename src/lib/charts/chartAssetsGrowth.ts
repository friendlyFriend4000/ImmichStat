import type { ApexOptions } from 'apexcharts';

const ChartAssetsGrowth = (
	isDark: boolean = true,
	height: number = 350
): ApexOptions => {
	const options: ApexOptions = {
		chart: {
			height: height,
			type: 'line',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			},
			fontFamily: 'inherit',
			animations: {
				enabled: true,
				speed: 800,
				animateGradually: {
					enabled: true,
					delay: 150
				},
				dynamicAnimation: {
					enabled: true,
					speed: 800
				}
			}
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth',
			width: 2,
			colors: undefined // Will use series colors
		},
		xaxis: {
			type: 'datetime',
			tooltip: {
				enabled: false
			},
			axisBorder: {
				show: true,
				color: isDark ? '#374151' : '#e5e7eb'
			},
			axisTicks: {
				show: true,
				color: isDark ? '#374151' : '#e5e7eb'
			},
			labels: {
				style: {
					colors: isDark ? '#9ca3af' : '#6b7280'
				}
			}
		},
		yaxis: {
			labels: {
				style: {
					colors: isDark ? '#9ca3af' : '#6b7280'
				},
				formatter: (value: number) => {
					if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
					if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
					return value.toString();
				}
			}
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 10,
				right: 10,
				top: 0,
				bottom: 0
			},
			borderColor: isDark ? '#374151' : '#e5e7eb'
		},
		fill: {
			type: 'solid',
			opacity: 1
		},
		legend: {
			show: true,
			showForSingleSeries: true,
			position: 'bottom',
			horizontalAlign: 'center',
			labels: {
				colors: isDark ? '#9ca3af' : '#374151',
				useSeriesColors: false
			},
			itemMargin: {
				horizontal: 10,
				vertical: 0
			}
		},
		tooltip: {
			x: {
				format: 'dd MMM yyyy'
			},
			theme: isDark ? 'dark' : 'light',
			style: {
				fontSize: '12px'
			}
		},
		series: [],
		// Default colors if not provided from outside
		colors: ['#6366f1', '#8b5cf6', '#ec4899'],
	};
	return options;
};

export default ChartAssetsGrowth;
