import Canvas from "./ui/Canvas";
import Chart from "./ui/chart/Chart";
import AxisY from "./ui/axis/AxisY";
import LineChart from "./ui/chart/LineChart";
import Grid from "./ui/Grid";
import AxisX from "./ui/axis/AxisX";
import Legend from "./ui/Legend";
import quickSort from "./helpers/quickSort";
// import getElementsByCoordinates from "./helpers/getElementsByCoordinates";

class aCharty {
	constructor({
		data = {},
		axisY = {},
		axisX = {},
		line = {},
		cap = {},
		grid = {},
		legend = {},
		breakpoints = {},
		type = "line",
		updateWhenResizing = true,
		selectorCanvas,
		background,
		title,
		padding,
	}) {
		this.breakpoints = breakpoints;
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

	_setCanvas() {
		return new Canvas(this.selectorCanvas, this.background).init();
	}

	_setChartTitle(canvas) {
		return new Chart(this.data, canvas.ctx, ...Object.values(canvas.getSizes()), this.title, this.type, this.padding).drawTitle();
	}

	_setLegend(canvas, chart) {
		return new Legend(
			Boolean(Object.keys(this.legend).length),
			this.data,
			this.line,
			canvas.ctx,
			chart.getBounds(),
			this.legend.font,
			this.legend.circle,
			this.legend.gaps,
			this.legend.maxCount
		).draw(chart.getGapsForLegend(this.axisY, chart.title));
	}

	_setAxisYTitle(canvas, chart, legend) {
		return new AxisY(
			this.axisY.step,
			this.axisY.editValue,
			this.data,
			canvas.ctx,
			this.axisY.line,
			this.axisY.title,
			chart.getBounds(),
			this.axisY.font,
			this.axisX.sort
		).drawTitle(chart.getGapsForYTitle(chart.title, { ...legend, gapBottom: ((this.legend.gaps || {}).legend || {}).bottom, }, this.axisX));
	}

	_setAxisXTitle(canvas, chart, axisY) {
		return new AxisX(
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
	}

	_setPoints(axisY, axisX, legend, chart) {
		axisY.drawPoints(chart.getGapsForYPoints(axisY, axisX, chart.title, { ...this.legend, ...legend, }));
		// Рисовка точек на абсциссе
		axisX.drawPoints(chart.getGapsForXPoints(axisY, axisX));
	}

	_setGrid(canvas, axisX, axisY) {
		return new Grid(
			canvas.ctx,
			axisY.getAxesData(this.data).names,
			axisY.points,
			axisX.points,
			this.grid.line,
			this.grid.format
		).init();
	}

	_windowResize() {
		window.addEventListener("resize", () => {
			this.update();
			this._setBreakpoints();
		});
	}

	_setBreakpoints() {
		if (!Object.keys(this.breakpoints)) {
			return;
		}

		const document = window.document.documentElement;
		const bPoint = quickSort(Object.keys(this.breakpoints).map((point) => parseInt(point))).find((width) => document.offsetWidth <= width);

		if (bPoint) {
			const func = this.breakpoints[bPoint.toString()];
			const contextForFunc = {
				data: this.data,
				axisY: this.axisY,
				axisX: this.axisX,
				line: this.line,
				cap: this.cap,
				grid: this.grid,
				legend: this.legend,
				type: this.type,
				background: this.background,
				title: this.title,
				padding: this.padding,
				update: this.update.bind(this),
			};

			if (func instanceof Function) {
				func.call(contextForFunc);
			}
		}
	}

	// _mousemoveByCanvas(canvas, elements) {
	// 	canvas.canvasElement.addEventListener("mousemove", (e) => {
	// 		this.activeElements = getElementsByCoordinates(canvas.canvasElement, elements, e);
	// 	});
	// }

	// _findActiveCaps(caps, canvas) {
	// 	const elements = caps.map((cap) => {
	// 		cap.width = cap.format === "circle" ? cap.size : cap.size / 2;
	// 		cap.height = cap.format === "circle" ? cap.size : cap.size / 2;

	// 		return cap;
	// 	});

	// 	this._mousemoveByCanvas(canvas, elements);
	// }

	_drawChartByType(axisY, axisX, canvas) {
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
				break;
		}
	}

	update() {
		const canvas = this._setCanvas();
		const chart = this._setChartTitle(canvas);
		const legend = this._setLegend(canvas, chart);
		const axisY = this._setAxisYTitle(canvas, chart, legend);
		const axisX = this._setAxisXTitle(canvas, chart, axisY);

		this._setPoints(axisY, axisX, legend, chart);
		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);

		return this;
	}

	init() {
		const canvas = this._setCanvas();
		const chart = this._setChartTitle(canvas);
		const legend = this._setLegend(canvas, chart);
		const axisY = this._setAxisYTitle(canvas, chart, legend);
		const axisX = this._setAxisXTitle(canvas, chart, axisY);

		this._setPoints(axisY, axisX, legend, chart);
		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);
		this._setBreakpoints();
		this._windowResize();

		return this;
	}
}

export default aCharty;