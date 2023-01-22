import Canvas from "./ui/Canvas";
import Chart from "./ui/chart/Chart";
import AxisY from "./ui/axis/AxisY";
import LineChart from "./ui/chart/LineChart";
import Grid from "./ui/Grid";
import AxisX from "./ui/axis/AxisX";
import Legend from "./ui/Legend";
import BlockInfo from "./ui/elements/BlockInfo";
import quickSort from "./helpers/quickSort";

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
		blockInfo = {},
		type = "line",
		selectorCanvas,
		background,
		title,
		padding,
	}) {
		this.breakpoints = breakpoints;
		this.padding = padding;
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
		this.blockInfo = blockInfo;
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
			this.axisY.sort,
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
		const y = axisY.drawPoints(chart.getGapsForYPoints(axisY, axisX, chart.title, { ...this.legend, ...legend, }));
		const x = axisX.drawPoints(chart.getGapsForXPoints(axisY, axisX));

		return {
			pointsY: y.points,
			pointsX: x.points,
		};
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

	_mousemoveByCanvas(canvas, { pointsX, pointsY, }) {
		const canvasLeft = canvas.canvasElement.offsetLeft + canvas.canvasElement.clientLeft;
		const canvasTop = canvas.canvasElement.offsetTop + canvas.canvasElement.clientTop;
		const pointsYOnScreen = pointsY.filter(({ onScreen, }) => onScreen);
		const [{ y: startY, }] = pointsYOnScreen;
		const { y: endY, } = pointsYOnScreen[pointsYOnScreen.length - 1];
		console.log(pointsY);
		canvas.canvasElement.addEventListener("mousemove", (e) => {
			this.update();

			const mousePos = { x: e.pageX - canvasLeft, y: e.pageY - canvasTop, };

			if (mousePos.y <= endY && mousePos.y >= startY) {
				const activeElements = pointsX
					.map((point) => {
						if (this.axisX.editName instanceof Function) {
							return {
								...point,
								name: this.axisX.editName(point.name),
							};
						}

						return point;
					}).filter(({ x, }) => mousePos.x >= (x - 10) && mousePos.x <= (x + 10));

				if (activeElements.length) {
					const [{ x, }] = activeElements;

					new BlockInfo(
						activeElements,
						this.blockInfo.title,
						this.blockInfo.groups,
						x,
						mousePos.y,
						this.blockInfo.background,
						this.blockInfo.padding,
						canvas.ctx
					).init();
				}
			}
		});
	}

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
					...Object.values(canvas.getSizes()),
					undefined,
					undefined,
					this.axisY.sort
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
		const points = this._setPoints(axisY, axisX, legend, chart);

		this._mousemoveByCanvas(canvas, points);
		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);
		this._setBreakpoints();
		this._windowResize();

		return this;
	}
}

export default aCharty;