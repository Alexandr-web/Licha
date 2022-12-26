import ACharty from "./ACharty";
import "../scss/index.scss";

new ACharty({
	canvasSelector: "canvas",
	background: "#212932",
	updateWhenResizing: true,
	title: {
		name: "Моя диаграмма",
		fontSize: 16,
		color: "#A1ABB4",
	},
	// stepped: true,
	line: { width: 3, },
	axisX: {
		line: {
			width: 1,
			color: "#2E353F",
		},
		color: "#A1ABB4",
		fontSize: 12,
		showText: true,
	},
	axisY: {
		line: {
			width: 1,
			color: "#2E353F",
		},
		color: "#A1ABB4",
		fontSize: 12,
		showText: true,
	},
	cap: { radius: 4, },
	data: {
		"Group 1": {
			line: { color: "#4781B4", },
			cap: { color: "#4781B4", },
			breakpoints: {
				"800": function (groupName, groupData) {
					console.log(groupName, groupData);
				},
			},
			data: [
				{ name: "1", value: 300, },
				{ name: "2", value: 302, },
				{ name: "3", value: 531, },
				{ name: "4", value: 1000, },
				{ name: "5", value: 601, },
				{ name: "6", value: 898, }
			],
		},
		// "Group 2": {
		// 	line: { color: "#CA81B4", },
		// 	cap: { color: "#CA81B4", },
		// 	data: [
		// 		{ name: "1", value: 19, },
		// 		{ name: "2", value: 19.24, },
		// 		{ name: "3", value: 32, },
		// 		{ name: "4", value: 31, },
		// 		{ name: "5", value: 40, },
		// 		{ name: "6", value: 34, },
		// 		{ name: "7", value: 105, }
		// 	],
		// },
	},
}).init();