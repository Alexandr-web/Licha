import ACharty from "./ACharty";
import "../scss/index.scss";

new ACharty({
	canvasSelector: "canvas",
	background: ["#1E163B", "#3C2C74"],
	updateWhenResizing: true,
	title: {
		name: "Моя диаграмма",
		fontSize: 16,
		color: "#fefefe",
	},
	line: { width: 3, },
	axisX: {
		line: {
			width: 1,
			color: ["#c2c2c2", "grey"],
		},
		color: "#fefefe",
		fontSize: 12,
		showText: true,
	},
	axisY: {
		line: {
			width: 1,
			color: ["#c2c2c2", "grey"],
		},
		color: "#fefefe",
		fontSize: 12,
		showText: true,
	},
	cap: {
		size: 10,
		format: "square",
		stroke: {
			width: 2,
			color: "black",
		},
	},
	data: {
		"Group 1": {
			line: {
				color: ["#8DA399", "#5DA383"],
				dotted: true,
			},
			cap: { color: "#4781B4", format: "circle", size: 6, },
			data: [
				{ name: "Понедельник", value: 15, },
				{ name: "Вторник", value: 16.2, },
				{ name: "Среда", value: 32, },
				{ name: "Четверг", value: 21, },
				{ name: "Пятница", value: 45, },
				{ name: "Суббота", value: 45, },
				{ name: "Воскресенье", value: 45, }
			],
		},
		"Group 2": {
			line: { color: "#CA81B4", },
			cap: { color: "#CA81B4", },
			data: [
				{ name: "Понедельник", value: 19, },
				{ name: "Вторник", value: 19.24, },
				{ name: "Среда", value: 32, },
				{ name: "Четверг", value: 31, },
				{ name: "Пятница", value: 45, },
				{ name: "Суббота", value: 45, },
				{ name: "Воскресенье", value: 45, }
			],
		},
		"Group 3": {
			line: { color: ["#DBBF62", "#DBD3B7"], },
			cap: { color: "#DBBF62", },
			data: [
				{ name: "Понедельник", value: 13, },
				{ name: "Вторник", value: 123, },
				{ name: "Среда", value: 37, },
				{ name: "Четверг", value: 21, },
				{ name: "Пятница", value: 65, },
				{ name: "Суббота", value: 15, },
				{ name: "Воскресенье", value: 25, }
			],
		},
	},
}).init();