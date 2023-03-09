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
		selectorCanvas,
		background,
		title,
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
		padding = {
			top: 10,
			left: 10,
			right: 10,
			bottom: 10,
		},
	}) {
		// Точки, которые изменяют данные диаграмммы, если совпадают с шириной экрана
		this.breakpoints = breakpoints;
		// Внутренние отступы
		this.padding = padding;
		// Данные колпачка
		this.cap = cap;
		// Данные легенды
		this.legend = legend;
		// Тип диаграммы
		this.type = type;
		// Данные задней сетки диаграммы
		this.grid = grid;
		// Данные линии
		this.line = line;
		// Данные оси ординат
		this.axisY = axisY;
		// Данные оси абсцисс
		this.axisX = axisX;
		// Данные заголовка диаграммы
		this.title = title;
		// Задний фон диаграммы
		this.background = background;
		// Селектор холста
		this.selectorCanvas = selectorCanvas;
		// Данные окна с информацией об активной группе
		this.blockInfo = blockInfo;
		// Данные групп
		this.data = data;
		// Стили темы
		this.theme = theme;
		// Содержит названия скрытых групп
		this.hideGroups = [];
	}

	/**
	 * Рисует холст
	 * @private
	 * @return {Canvas}
	 */
	_setCanvas() {
		return new Canvas(this.selectorCanvas, this.background, this.theme.canvas).init();
	}

	/**
	 * Рисует заголовок диагрыммы
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @private
	 */
	_setChartTitle(canvas) {
		const { width, height, } = canvas.getSizes();

		return new Chart(
			this.padding,
			this.data,
			canvas.ctx,
			width,
			height,
			this.title,
			this.type,
			this.theme.title
		).drawTitle();
	}

	/**
	 * Рисует легенду
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @param {Chart} chart Экземпляр класса Chart
	 * @private
	 * @return {Legend}
	 */
	_setLegend(canvas, chart) {
		const { font, circle, gaps: legendGaps, maxCount, } = this.legend;
		const showLegend = Boolean(Object.keys(this.legend).length);
		const gaps = chart.getGapsForLegend(this.axisY, chart.title);

		return new Legend(
			showLegend,
			this.data,
			this.line,
			canvas.ctx,
			chart.getBounds(),
			font,
			circle,
			this.hideGroups,
			legendGaps,
			maxCount,
			this.theme.legend,
			this.theme.line
		).draw(gaps);
	}

	/**
	 * Рисует заголовок на оси ординат
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @param {Chart} chart Экземпляр класса Chart
	 * @param {Legend} legend Экземпляр класса Legend
	 * @private
	 * @returns {AxisY}
	 */
	_setAxisYTitle(canvas, chart, legend) {
		const { step, editValue, title, font, sort, } = this.axisY;
		const { legend: legendGaps = {}, } = (this.legend.gaps || {});
		const themeForTitle = (this.theme.axis || {}).title;
		const themeForPoint = (this.theme.axis || {}).point;
		const gaps = chart.getGapsForYTitle(chart.title, { ...legend, gapBottom: (legendGaps.bottom || 0), }, this.axisX);

		return new AxisY(
			step,
			editValue,
			this.data,
			canvas.ctx,
			title,
			chart.getBounds(),
			font,
			this.axisX.sort,
			themeForTitle,
			themeForPoint,
			sort
		).drawTitle(gaps);
	}

	/**
	 * Рисует заголовок на оси абсцисс
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @param {Chart} chart Экземпляр класса Chart
	 * @param {AxisX} axisX Экземпляр класса AxisX
	 * @private
	 * @returns {AxisX}
	 */
	_setAxisXTitle(canvas, chart, axisY) {
		const { font, editName, sort, ignoreNames, title, } = this.axisX;
		const themeForTitle = (this.theme.axis || {}).title;
		const themeForPoint = (this.theme.axis || {}).point;
		const themeForLine = this.theme.line;
		const gaps = chart.getGapsForXTitle(axisY);

		return new AxisX(
			canvas.ctx,
			this.data,
			this.line,
			title,
			chart.getBounds(),
			font,
			editName,
			sort,
			themeForTitle,
			themeForPoint,
			themeForLine,
			ignoreNames
		).drawTitle(gaps);
	}

	/**
	 * 
	 * @param {AxisY} axisY Экземпляр класса AxisY
	 * @param {AxisX} axisX Экземпляр класса AxisX
	 * @param {Legend} legend Экземпляр класса Legend
	 * @param {Chart} chart Экземпляр класса Chart
	 * @private
	 * @returns {object} Данные всех осевых точек
	 */
	_setPoints(axisY, axisX, legend, chart) {
		const y = axisY.drawPoints(chart.getGapsForYPoints(axisY, axisX, chart.title, { ...this.legend, ...legend, }));
		const x = axisX.drawPoints(chart.getGapsForXPoints(axisY, axisX));

		return {
			pointsY: y.points,
			pointsX: x.points,
		};
	}

	/**
	 * Рисует заднюю сетку диаграмме
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @param {AxisX} axisX Экземпляр класса AxisX
	 * @param {AxisY} axisY Экземпляр класса AxisY
	 * @private
	 * @returns {Grid}
	 */
	_setGrid(canvas, axisX, axisY) {
		const { line, format, background, } = this.grid;

		return new Grid(
			canvas.ctx,
			axisY.getAxesData(this.data).names,
			background,
			axisY.points,
			axisX.points,
			line,
			format,
			this.theme.grid
		).init();
	}

	/**
	 * Обработчик события resize у window
	 * Обновляет график и проверяет ширину окна с break points
	 * @private
	 */
	_windowResizeHandler() {
		this.update();
		this._setBreakpoints();
	}

	/**
	 * Добавление события resize элементу window
	 * @private
	 */
	_windowResize() {
		window.addEventListener("resize", this._windowResizeHandler.bind(this));
	}

	/**
	 * Обновление данных диаграммы в зависимости от разрешения экрана
	 * @private
	 */
	_setBreakpoints() {
		if (!Object.keys(this.breakpoints)) {
			return;
		}

		const document = window.document.documentElement;
		// Берем все точки
		const points = Object.keys(this.breakpoints).map((point) => parseInt(point));
		// Берем подходящую точку, которая совпадает с размером окна
		const bPoint = quickSort(points).find((width) => document.offsetWidth <= width);

		if (bPoint) {
			const func = this.breakpoints[bPoint.toString()];

			if (func instanceof Function) {
				func.call(this);
			}
		}
	}

	/**
	 * Обработчик события mousemove у элемента canvas
	 * Рисует окно с информацией об активной группе
	 * @param {Event} e Объект события
	 * @param {number} endY Конечная область видимости окна с информацией об активной группе
	 * @param {array} pointsX Содержит данные всех точек на оси абсцисс
	 * @param {number} startY Начальная область видимости окна с информацией об активной группе
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @param {object} bounds Содержит границы холста
	 * @private
	 */
	_mousemoveByCanvasHandler(e, endY, pointsX, startY, canvas, bounds) {
		const mousePos = { x: e.offsetX, y: e.offsetY, };

		if (mousePos.y <= endY && mousePos.y >= startY) {
			// Отбираем элементы, которые подходят по координатам на холсте
			const activeElements = pointsX.map((point) => {
				if (this.axisX.editName instanceof Function) {
					return {
						...point,
						name: this.axisX.editName(point.name),
					};
				}

				return point;
			}).filter(({ x, group, }) => !this.hideGroups.includes(group) && mousePos.x > (x - 5) && mousePos.x < (x + 5));

			document.documentElement.style = `cursor: ${activeElements.length ? "none" : "default"}`;

			if (activeElements.length) {
				this.update();
				
				const [{ x, }] = activeElements;
				const { title, groups, background, padding, } = this.blockInfo;
				const themeForWindow = (this.theme.blockInfo || {}).window;
				const themeForLine = this.theme.line;
				const themeForTitle = (this.theme.blockInfo || {}).title;
				const themeForGroup = (this.theme.blockInfo || {}).group;

				new BlockInfo(
					this.axisY.editValue,
					this.axisX.editName,
					this.data,
					bounds,
					activeElements,
					title,
					groups,
					x,
					mousePos.y,
					background,
					padding,
					canvas.ctx,
					themeForWindow,
					themeForLine,
					themeForTitle,
					themeForGroup
				).init();
			}
		} else {
			document.documentElement.style = "cursor: default";
		}
	}

	/**
	 * Добавление события mousemove элементу canvas
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @param {object} bounds Содержит границы холста
	 * @param {{ pointsX: array, pointsY: array }} param2 Содержит данные всех осевых точек
	 * @private
	 */
	_mousemoveByCanvas(canvas, bounds, { pointsX, pointsY, }) {
		if (!Object.keys(this.blockInfo).length) {
			return;
		}

		const pointsYOnScreen = pointsY.filter(({ onScreen, }) => onScreen);
		const [{ y: startY, }] = pointsYOnScreen;
		const { y: endY, } = pointsYOnScreen[pointsYOnScreen.length - 1];

		canvas.canvasElement.addEventListener("mousemove", (e) => this._mousemoveByCanvasHandler(e, endY, pointsX, startY, canvas, bounds));
	}

	/**
	 * Обработчик события mouseleave у элемента canvas
	 * Обновляет график и изменяет тип курсора на обычный
	 * @private
	 */
	_leavemouseFromCanvasAreaHandler() {
		document.documentElement.style = "default";
		this.update();
	}

	/**
	 * Добавление события mouseleave элементу canvas
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @private
	 */
	_leavemouseFromCanvasArea(canvas) {
		canvas.canvasElement.addEventListener("mouseleave", this._leavemouseFromCanvasAreaHandler.bind(this));
	}

	/**
	 * Обработчик события click у элемента canvas
	 * Скрывает группы при клике на элементы легенды
	 * @param {Event} e Объект event
	 * @param {array} legendItems Содержит данные элементов легенды
	 * @private
	 */
	_clickByCanvasAreaHandler(e, legendItems) {
		const mousePos = { x: e.offsetX, y: e.offsetY, };
		const findMatchLegendItem = legendItems.find(({ x, y, width, height, }) => {
			const endX = x + width;
			const startY = y - height;

			return (mousePos.x <= endX && mousePos.x >= x) && (mousePos.y <= y && mousePos.y >= startY);
		});

		if (findMatchLegendItem) {
			const { group, } = findMatchLegendItem;
			const findIdxHideGroup = this.hideGroups.indexOf(group);

			if (findIdxHideGroup !== -1) {
				this.hideGroups.splice(findIdxHideGroup, 1);
			} else {
				this.hideGroups.push(group);
			}

			this.update();
		}
	}

	/**
	 * Добавление события click элементу canvas
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @param {*} legendItems 
	 * @private
	 */
	_clickByCanvasArea(canvas, legendItems) {
		canvas.canvasElement.addEventListener("click", (e) => this._clickByCanvasAreaHandler(e, legendItems));
	}

	/**
	 * Рисует диаграмму в зависимости от ее типа
	 * @param {AxisY} axisY Экземпляр класса AxisY
	 * @param {AxisX} axisX Экземпляр класса AxisX
	 * @param {Canvas} canvas Экземпляр класса Canvas
	 * @private
	 */
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
					this.hideGroups,
					this.axisY.sort,
					this.theme.line,
					this.theme.cap
				).draw();
				break;
		}
	}

	// Обновление данных диаграммы
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

	// Рисует диаграмму
	init() {
		const canvas = this._setCanvas();
		const chart = this._setChartTitle(canvas);
		const legend = this._setLegend(canvas, chart);
		const axisY = this._setAxisYTitle(canvas, chart, legend);
		const axisX = this._setAxisXTitle(canvas, chart, axisY);
		const points = this._setPoints(axisY, axisX, legend, chart);

		this._mousemoveByCanvas(canvas, chart.getBounds(), points);
		this._leavemouseFromCanvasArea(canvas);
		this._clickByCanvasArea(canvas, legend.items);
		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);
		this._setBreakpoints();
		this._windowResize();

		return this;
	}
}

export default ACharty;