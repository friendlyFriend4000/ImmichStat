
export default () => {
	return {
		name: 'Series 1',
		series: [30, 30, 40],
		labels: ['label1', 'Tlabel2', 'label3'],
		colors: ['#F44336', '#E91E63', '#9C27B0'],
		chart: {
			id: 'asd',
			type: 'donut',
			animations: {
				enabled: true,
				easing: 'easeinout',
				speed: 1500
			},
			dynamicAnimation: {
				enabled: true,
				speed: 1500
			},
			height: '100%',
			width: '100%',
			// Make the chart inherit theme from parent
			foreColor: 'currentColor'
		},

		stroke: {
			curve: 'smooth',
			width: 2,
			colors: ['grey'],
			lineCap: ''
		},
		plotOptions: {
			pie: {
				startAngle: 0,
				endAngle: 360,
				expandOnClick: true,
				offsetX: 0,
				offsetY: 0,
				customScale: 1,
				dataLabels: {
					offset: 0,
					minAngleToShowLabel: 10
				},
				donut: {
					size: '65%',
					background: 'transparent',
					labels: {
						show: true,
						name: {
							label: '',
							show: false,
							fontSize: '22px',
							fontFamily: 'Helvetica, Arial, sans-serif',
							fontWeight: 600,
							color: 'currentColor',  // Updated to inherit color
							offsetY: 0,
							formatter: function(val) {
								return val;
							}
						},
						value: {
							show: true,
							fontSize: '30',
							fontFamily: 'Helvetica, Arial, sans-serif',
							fontWeight: 700,
							color: 'currentColor',  // Changed from '#FFFFFF' to inherit color
							offsetY: 6,
							formatter: function(val) {
								return val;
							}
						},
						total: {
							show: true,
							showAlways: true,
							label: 'Total',
							fontSize: '22px',
							fontFamily: 'Helvetica, Arial, sans-serif',
							fontWeight: 600,
							color: 'currentColor',  // Updated to inherit color
							formatter: function(w) {
								return w.globals.seriesTotals.reduce((a, b) => {
									return a + b;
								}, 0);
							}
						}
					}
				}
			}
		},
		dataLabels: {
			enabled: true,
			enabledOnSeries: undefined,
			formatter: function(val, opts) {
				console.log(val);
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
				foreColor: 'currentColor',  // Updated to inherit color
				padding: 4,
				borderRadius: 2,
				borderWidth: 1,
				borderColor: 'currentColor',  // Updated to inherit color
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
		legend: {
			position: 'bottom',
			fontSize: '14px',
			fontFamily: 'Inter, sans-serif',
			labels: {
				colors: 'currentColor'  // Updated to inherit color
			}
		},
		tooltip: {
			enabled: true,
			theme: 'light',  // You might want to make this dynamic based on current theme
			y: {
				formatter: function(val) {
					return val;
				},
				title: {
					formatter: (val) => {
						return val;
					}
				}
			}
		}
	};
};