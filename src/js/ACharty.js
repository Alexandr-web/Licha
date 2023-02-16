import Canvas from "./ui/Canvas";
import Chart from "./ui/chart/Chart";
import AxisY from "./ui/axis/AxisY";
import LineChart from "./ui/chart/LineChart";
import Grid from "./ui/Grid";
import AxisX from "./ui/axis/AxisX";
import Legend from "./ui/Legend";
import BlockInfo from "./ui/elements/BlockInfo";
import quickSort from "./helpers/quickSort";

class ACharty {
	constructor({
		theme = {},
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
		this.theme = theme;
	}

	_setCanvas() {
		return new Canvas(this.selectorCanvas, this.background).init();
	}

	_setChartTitle(canvas) {
		const { width, height, } = canvas.getSizes();

		return new Chart(
			this.data,
			canvas.ctx,
			width,
			height,
			this.title,
			this.type,
			this.padding
		).drawTitle();
	}

	_setLegend(canvas, chart) {
		const { font, circle, gaps, maxCount, } = this.legend;
		const showLegend = Boolean(Object.keys(this.legend).length);

		return new Legend(
			showLegend,
			this.data,
			this.line,
			canvas.ctx,
			chart.getBounds(),
			font,
			circle,
			gaps,
			maxCount
		).draw(chart.getGapsForLegend(this.axisY, chart.title));
	}

	_setAxisYTitle(canvas, chart, legend) {
		const { step, editValue, line, title, font, sort, } = this.axisY;
		const { legend: legendGaps = {}, } = (this.legend.gaps || {});

		return new AxisY(
			step,
			editValue,
			this.data,
			canvas.ctx,
			line,
			title,
			chart.getBounds(),
			font,
			sort,
			this.axisX.sort
		).drawTitle(chart.getGapsForYTitle(chart.title, { ...legend, gapBottom: (legendGaps.bottom || 0), }, this.axisX));
	}

	_setAxisXTitle(canvas, chart, axisY) {
		const { font, editName, sort, ignoreNames, line, title, } = this.axisX;

		return new AxisX(
			canvas.ctx,
			this.data,
			line,
			title,
			chart.getBounds(),
			font,
			editName,
			sort,
			ignoreNames
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
		const { line, format, } = this.grid;

		return new Grid(
			canvas.ctx,
			axisY.getAxesData(this.data).names,
			axisY.points,
			axisX.points,
			line,
			format
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
		const points = Object.keys(this.breakpoints).map((point) => parseInt(point));
		const bPoint = quickSort(points).find((width) => document.offsetWidth <= width);

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

	_mousemoveByCanvas(canvas, bounds, { pointsX, pointsY, }) {
		if (!Object.keys(this.blockInfo).length) {
			return;
		}

		const pointsYOnScreen = pointsY.filter(({ onScreen, }) => onScreen);
		const [{ y: startY, }] = pointsYOnScreen;
		const { y: endY, } = pointsYOnScreen[pointsYOnScreen.length - 1];

		canvas.canvasElement.addEventListener("mousemove", (e) => {
			this.update();

			const mousePos = { x: e.offsetX, y: e.offsetY, };

			if (mousePos.y <= endY && mousePos.y >= startY) {
				const activeElements = pointsX.map((point) => {
					if (this.axisX.editName instanceof Function) {
						return {
							...point,
							name: this.axisX.editName(point.name),
						};
					}

					return point;
				}).filter(({ x, }) => mousePos.x > (x - 5) && mousePos.x < (x + 5));

				if (activeElements.length) {
					const [{ x, }] = activeElements;
					const { title, groups, background, padding, } = this.blockInfo;

					new BlockInfo(
						bounds,
						activeElements,
						title,
						groups,
						x,
						mousePos.y,
						background,
						padding,
						canvas.ctx
					).init();
				}
			} else {
				document.documentElement.style = "cursor: default";
			}
		});
	}

	_leavemouseFromCanvasArea(canvas) {
		canvas.canvasElement.addEventListener("mouseleave", () => document.documentElement.style = "default");
	}

	_drawChartByType(axisY, axisX, canvas) {
		const { width, height, } = canvas.getSizes();

		switch (this.type) {
			case "line":
				new LineChart(
					this.data,
					this.line,
					this.cap,
					axisY.points,
					axisX.points,
					canvas.ctx,
					width,
					height,
					null,
					null,
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

		this._mousemoveByCanvas(canvas, chart.getBounds(), points);
		this._leavemouseFromCanvasArea(canvas);
		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);
		this._setBreakpoints();
		this._windowResize();

		return this;
	}
}

export default ACharty;