import ACharty from "./ACharty";

new ACharty({
	canvasSelector: "canvas",
	background: "#171C27",
	updateWhenResizing: true,
	title: {
		name: "Моя диаграмма 23434274982374893274982374983274982374923749327493827498237439827498237489239",
		fontSize: 16,
		color: "#fefefe",
	},
	stepped: true,
	line: { width: 3, },
	axisX: {
		line: {
			width: 1,
			color: "#505F85",
			dotted: true,
		},
		color: "#fefefe",
		fontSize: 12,
		showText: true,
	},
	axisY: {
		line: {
			width: 1,
			color: "#505F85",
			dotted: true,
		},
		color: "#fefefe",
		fontSize: 12,
		showText: true,
	},
	cap: { radius: 4, },
	data: {
		"Group 1": {
			line: {
				color: "#4781B4",
				dotted: true,
			},
			cap: { color: "#4781B4", },
			breakpoints: {
				"800": function (groupName, groupData) {

				},
			},
			active: { line: { color: "yellow", dotted: false, }, cap: { color: "yellow", }, },
			data: [
				{ name: "1", value: 15, },
				{ name: "2", value: 16.2, },
				{ name: "3", value: 41.23, },
				{ name: "4", value: 44, },
				{ name: "5", value: 45, }
			],
		},
		"Group 2": {
			line: { color: "#CA81B4", },
			cap: { color: "#CA81B4", },
			active: { line: { color: "red", dotted: true, }, cap: { color: "red", }, },
			data: [
				{ name: "1", value: 19, },
				{ name: "2", value: 19.24, },
				{ name: "3", value: 32, },
				{ name: "4", value: 31, },
				{ name: "5", value: 45, }
			],
		},
		"Group 3": {
			line: { color: "#DBBF62", },
			cap: { color: "#DBBF62", },
			data: [
				{ name: "1", value: 4, },
				{ name: "2", value: 12, },
				{ name: "3", value: 34, },
				{ name: "4", value: 12, },
				{ name: "5", value: 3, }
			],
		},
	},
}).init();