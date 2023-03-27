import ACharty from "./ACharty";
import Utils from "./Utils/Utils";

import { IAchartyClass, } from "./interfaces/acharty";

const utils: Utils = new Utils();
const chart: IAchartyClass = new ACharty({
	theme: utils.getTheme(15),
	padding: { left: 20, },
	selectorCanvas: "canvas",
	title: {
		font: {
			size: 19,
			text: "Title",
		},
		gapBottom: 10,
	},
	blockInfo: {
		padding: {
			top: 10,
			left: 10,
			bottom: 10,
			right: 10,
		},
		title: {
			font: { size: 16, },
			gaps: { bottom: 20, },
		},
		groups: {
			font: { size: 12, },
			gaps: { bottom: 10, right: 10, },
		},
	},
	legend: {
		font: { size: 16, },
		circle: { radius: 4, },
		gaps: {
			circle: { right: 8, },
			group: { right: 8, bottom: 10, },
			legend: { bottom: 10, },
		},
	},
	axisX: {
		font: { size: 16, },
		title: {
			font: { size: 18, text: "Days", },
			gapTop: 25,
		},
	},
	axisY: {
		font: { size: 16, },
		step: 3,
		title: {
			font: {
				size: 18,
				text: "Sold",
			},
			gapRight: 25,
		},
		editValue: (val) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumSignificantDigits: 1, }).format(val),
	},
	cap: {
		format: "square",
		size: 10,
		stroke: { width: 2, },
	},
	grid: {
		line: {
			width: 1,
			dotted: true,
		},
		format: "horizontal",
	},
	line: { width: 3, },
	data: {
		"Group 1": {
			cap: { format: "circle", size: 6, },
			data: [
				{ name: "Monday", value: 100_000, },
				{ name: "Tuesday", value: 50_000, },
				{ name: "Wednesday", value: 10_000, },
				{ name: "Thuesday", value: 35_000, },
				{ name: "Friday", value: 5000, },
				{ name: "Saturday", value: 50_000, },
				{ name: "Sunday", value: 32_000, }
			],
		},
		"Group 2": {
			data: [
				{ name: "Monday", value: 5000, },
				{ name: "Tuesday", value: 1200, },
				{ name: "Wednesday", value: 41_000, },
				{ name: "Thuesday", value: 23_999.4121, },
				{ name: "Friday", value: 5000.42141, },
				{ name: "Saturday", value: 16_000, },
				{ name: "Sunday", value: 8400, }
			],
		},
	},
}).init();