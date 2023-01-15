import Canvas from "./ui/Canvas";
import Chart from "./ui/chart/Chart";
import AxisY from "./ui/axis/AxisY";
import LineChart from "./ui/chart/LineChart";
import Grid from "./ui/Grid";
// import getElementsByCoordinates from "./helpers/getElementsByCoordinates";
import AxisX from "./ui/axis/AxisX";
import Legend from "./ui/Legend";

class aCharty {
	constructor({
		data = {},
		axisY = {},
		axisX = {},
		line = {},
		cap = {},
		grid = {},
		legend = {},
		type = "line",
		updateWhenResizing = true,
		selectorCanvas,
		background,
		title,
		padding,
	}) {
		this.padding = padding;
		this.activeElements = [];
		this.cap = cap;
		this.legend = legend;
		this.type = type;
		this.grid = grid;
		this.line = line;
		this.axisY = axisY;
		this.axisX = axisX;
		this.title = title;
		this.background = background;
		this.selectorCanvas = selectorCanvas;
		// Правило, которое будет обновлять график при изменении экрана
		this.updateWhenResizing = updateWhenResizing;
		// Объект с данными графика
		this.data = data;
	}

	init() {
		// Установка холста по умолчанию
		const canvas = new Canvas(this.selectorCanvas, this.background).init();
		// Рисовка заголовка диаграммы
		const chart = new Chart(this.data, canvas.ctx, ...Object.values(canvas.getSizes()), this.title, this.type, this.padding).drawTitle();
		// Рисовка легенды
		const legend = new Legend(
			Boolean(Object.keys(this.legend).length),
			this.data,
			this.line,
			canvas.ctx,
			chart.getBounds(),
			this.legend.font
		).draw(chart.getGapsForLegend(this.axisY, chart.title));
		// Рисовка заголовка ординаты
		const axisY = new AxisY(
			this.axisY.step,
			this.axisY.editValue,
			this.data,
			canvas.ctx,
			this.axisY.line,
			this.axisY.title,
			chart.getBounds(),
			this.axisY.font,
			this.axisX.sort
		).drawTitle(chart.getGapsForYTitle(chart.title, { ...legend, gapBottom: this.legend.gapBottom, }, this.axisX));
		// Рисовка заголовка абсциссы
		const axisX = new AxisX(
			canvas.ctx,
			this.data,
			this.axisX.line,
			this.axisX.title,
			chart.getBounds(),
			this.axisX.font,
			this.axisX.editName,
			this.axisX.sort,
			this.axisX.ignoreNames
		).drawTitle(chart.getGapsForXTitle(axisY));
		// Рисовка точек на ординате
		axisY.drawPoints(chart.getGapsForYPoints(axisY, axisX, chart.title, legend.groupsData[0], this.legend));
		// Рисовка точек на абсциссе
		axisX.drawPoints(chart.getGapsForXPoints(axisY, axisX));
		// Рисовка сетки
		new Grid(
			canvas.ctx,
			axisY.getAxesData(this.data).names,
			axisY.points,
			axisX.points,
			this.grid.line,
			this.grid.format
		).init();

		// function findByCoordinates(elements) {
		// 	canvas.canvasElement.addEventListener("mousemove", (e) => {
		// 		this.activeElements = getElementsByCoordinates(canvas.canvasElement, elements, e);
		// 	});
		// }

		// Рисовка диаграммы по типу
		switch (this.type) {
			case "line":
				new LineChart(
					this.data,
					this.line,
					this.cap,
					axisY.points,
					axisX.points,
					canvas.ctx,
					...Object.values(canvas.getSizes())
				).draw();

				// findByCoordinates(lineChart.caps.map((cap) => {
				// 	cap.width = cap.format === "circle" ? cap.size : cap.size / 2;
				// 	cap.height = cap.format === "circle" ? cap.size : cap.size / 2;

				// 	return cap;
				// }));
				break;
		}

		return this;
	}
}

export default aCharty;