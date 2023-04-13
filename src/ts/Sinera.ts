import Canvas from "./ui/Canvas";
import Chart from "./ui/chart/Chart";
import AxisY from "./ui/axis/AxisY";
import LineChart from "./ui/chart/LineChart";
import Grid from "./ui/Grid";
import AxisX from "./ui/axis/AxisX";
import Legend from "./ui/Legend";
import BlockInfo from "./ui/elements/BlockInfo";
import Utils from "./Utils/Utils";

import { TEmptyObject, TTypeChart, } from "./types/index";

import { ISineraClass, ISineraConstructor, } from "./interfaces/sinera";
import { IAxisPoints, IAxisThemePoint, IAxisThemeTitle, } from "./interfaces/axis";
import { IAxisX, IAxisXClass, IPointX, } from "./interfaces/axisX";
import { IAxisY, IAxisYClass, IPointY, } from "./interfaces/axisY";
import { IBlockInfo, IBlockInfoThemeGroup, IBlockInfoThemeTitle, IBlockInfoThemeWindow, } from "./interfaces/blockInfo";
import { IBounds, IGaps, IPadding, IPos, } from "./interfaces/global";
import { ICanvasClass, } from "./interfaces/canvas";
import { ICap, } from "./interfaces/cap";
import { IChartClass, IChartTitle, IChartTitleWithSizeAndPos, } from "./interfaces/chart";
import { IData, } from "./interfaces/data";
import { IGrid, IGridClass, } from "./interfaces/grid";
import { IItemLegend, ILegend, ILegendClass, ILegendData, } from "./interfaces/legend";
import { ILine, ILineTheme, } from "./interfaces/line";
import { ITheme, } from "./interfaces/utils";

import isNumber from "./helpers/isNumber";
import getPaddingObj from "./helpers/getPaddingObj";
import isFunction from "./helpers/isFunction";

class Sinera implements ISineraClass {
	public selectorCanvas: string;
	public background?: string | Array<string>;
	public title?: IChartTitle | TEmptyObject;
	public theme?: ITheme | TEmptyObject;
	public data: IData;
	public axisY?: IAxisY | TEmptyObject;
	public axisX?: IAxisX | TEmptyObject;
	public line?: ILine | TEmptyObject;
	public cap?: ICap;
	public grid?: IGrid | TEmptyObject;
	public legend?: ILegend | TEmptyObject;
	public blockInfo?: IBlockInfo | TEmptyObject;
	public type?: TTypeChart;
	public padding?: IPadding | TEmptyObject | number;
	public hideGroups?: Array<string>;

	constructor({
		selectorCanvas,
		background,
		type,
		title = {},
		theme = {},
		data = {},
		axisY = {},
		axisX = {},
		line = {},
		cap = {},
		grid = {},
		legend = {},
		blockInfo = {},
		padding = 10,
	}: ISineraConstructor) {
		// Внутренние отступы
		this.padding = isNumber(padding) ? getPaddingObj(padding as number) : padding;
		// Данные колпачка
		this.cap = cap;
		// Данные легенды
		this.legend = legend;
		// Тип диаграммы
		this.type = type || "line";
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
	 * @return {ICanvasClass}
	 */
	private _setCanvas(): ICanvasClass {
		return new Canvas(this.selectorCanvas, this.background, this.theme.canvas).init();
	}

	/**
	 * Рисует заголовок диаграммы
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @private
	 * @return {IChartClass}
	 */
	private _setChartTitle(canvas: ICanvasClass): IChartClass {
		const { width, height, } = canvas.getSizes();

		return new Chart(
			this.padding,
			this.data,
			canvas.ctx,
			width,
			height,
			this.type,
			this.title,
			this.theme.title
		).drawTitle();
	}

	/**
	 * Рисует легенду
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @param {IChartClass} chart Экземпляр класса Chart
	 * @private
	 * @return {ILegendClass}
	 */
	private _setLegend(canvas: ICanvasClass, chart: IChartClass): ILegendClass {
		const { font, circle, gaps: legendGaps, maxCount, } = this.legend;
		const showLegend = Boolean(Object.keys(this.legend).length);
		const gaps: IGaps = chart.getGapsForLegend(this.axisY, chart.titleData as IChartTitleWithSizeAndPos);

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
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @param {IChartClass} chart Экземпляр класса Chart
	 * @param {ILegendClass} legend Экземпляр класса Legend
	 * @private
	 * @returns {IAxisYClass}
	 */
	private _setAxisYTitle(canvas: ICanvasClass, chart: IChartClass): IAxisYClass {
		const { step, editValue, title, font, sort, } = this.axisY;
		const themeForTitle: IAxisThemeTitle = (this.theme.axis || {}).title;
		const themeForPoint: IAxisThemePoint = (this.theme.axis || {}).point;

		return new AxisY(
			editValue,
			this.data,
			canvas.ctx,
			title,
			chart.getBounds(),
			font,
			this.axisX.sort,
			themeForTitle,
			themeForPoint,
			sort,
			step
		).drawTitle();
	}

	/**
	 * Рисует заголовок на оси абсцисс
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @param {IChartClass} chart Экземпляр класса Chart
	 * @private
	 * @returns {IAxisXClass}
	 */
	private _setAxisXTitle(canvas: ICanvasClass, chart: IChartClass): IAxisXClass {
		const { font, editName, sort, ignoreNames, title, rotate, } = this.axisX;
		const themeForTitle: IAxisThemeTitle = (this.theme.axis || {}).title;
		const themeForPoint: IAxisThemePoint = (this.theme.axis || {}).point;
		const themeForLine: ILineTheme = this.theme.line;

		return new AxisX(
			canvas.ctx,
			this.data,
			this.line,
			title,
			chart.getBounds(),
			font,
			editName,
			sort,
			rotate,
			themeForTitle,
			themeForPoint,
			ignoreNames,
			themeForLine
		).drawTitle();
	}

	/**
	 * Рисует точки
	 * @param {IAxisYClass} axisY Экземпляр класса AxisY
	 * @param {IAxisXClass} axisX Экземпляр класса AxisX
	 * @param {ILegendClass} legend Экземпляр класса Legend
	 * @param {IChartClass} chart Экземпляр класса Chart
	 * @private
	 * @returns {IAxisPoints} Данные всех осевых точек
	 */
	private _setPoints(axisY: IAxisYClass, axisX: IAxisXClass, legend: ILegendClass, chart: IChartClass): IAxisPoints {
		const y: IAxisYClass = axisY.drawPoints(chart.getGapsForYPoints(axisY, axisX, chart.titleData, { ...this.legend, ...legend, } as ILegendData));
		const x: IAxisXClass = axisX.drawPoints(chart.getGapsForXPoints(axisY, axisX));

		return {
			pointsY: y.points as Array<IPointY>,
			pointsX: x.points as Array<IPointX>,
		};
	}

	/**
	 * Рисует заднюю сетку диаграмме
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @param {IAxisXClass} axisX Экземпляр класса AxisX
	 * @param {IAxisYClass} axisY Экземпляр класса AxisY
	 * @private
	 * @returns {IGridClass}
	 */
	private _setGrid(canvas: ICanvasClass, axisX: IAxisXClass, axisY: IAxisYClass): IGridClass {
		const { line, format, background, } = this.grid;

		return new Grid(
			canvas.ctx,
			axisY.getAxesData(this.data).names,
			axisY.getMaxTextWidthAtYAxis(),
			axisY,
			axisX,
			background,
			format,
			line,
			this.theme.grid
		).init();
	}

	/**
	 * Обработчик события resize у window
	 * Обновляет график и проверяет ширину окна с break points
	 * @private
	 */
	private _windowResizeHandler(): void {
		this.update();
	}

	/**
	 * Добавление события resize элементу window
	 * @private
	 */
	private _windowResize(): void {
		window.addEventListener("resize", this._windowResizeHandler.bind(this));
	}

	/**
	 * Обработчик события mousemove у элемента canvas
	 * Рисует окно с информацией об активной группе
	 * @param {MouseEvent} e Объект события
	 * @param {number} endY Конечная область видимости окна с информацией об активной группе
	 * @param {Array<IPointX>} pointsX Содержит данные всех точек на оси абсцисс
	 * @param {number} startY Начальная область видимости окна с информацией об активной группе
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @param {IBounds} bounds Содержит границы холста
	 * @private
	 */
	private _mousemoveByCanvasHandler(e: MouseEvent, endY: number, pointsX: Array<IPointX>, startY: number, canvas: ICanvasClass, bounds: IBounds): void {
		const mousePos: IPos = { x: e.offsetX, y: e.offsetY, };
		const { events = {}, } = this.blockInfo;

		if (mousePos.y <= endY && mousePos.y >= startY) {
			// Отбираем элементы, которые подходят по координатам на холсте
			const activeElements: Array<IPointX> = pointsX.map((point) => {
				if (isFunction(this.axisX.editName)) {
					return {
						...point,
						name: this.axisX.editName(point.name),
					};
				}

				return point;
			}).filter(({ x, group, }) => !this.hideGroups.includes(group) && mousePos.x > (x - 5) && mousePos.x < (x + 5));

			if (activeElements.length) {
				this.update();

				const [{ x, }]: Array<IPointX> = activeElements;
				const { title, groups, background, padding, } = this.blockInfo;
				const themeForWindow: IBlockInfoThemeWindow = (this.theme.blockInfo || {}).window;
				const themeForLine: ILineTheme = this.theme.line;
				const themeForTitle: IBlockInfoThemeTitle = (this.theme.blockInfo || {}).title;
				const themeForGroup: IBlockInfoThemeGroup = (this.theme.blockInfo || {}).group;

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
					canvas.ctx,
					padding,
					themeForWindow,
					themeForLine,
					themeForTitle,
					themeForGroup
				).init();

				// Вызываем функцию-обработчик для обработки события наведения на точку
				if (isFunction(events.onAimed)) {
					events.onAimed.call({ ...mousePos, activeElements, });
				}
			}
		}
	}

	/**
	 * Добавление события mousemove элементу canvas
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @param {IBounds} bounds Содержит границы холста
	 * @param {{ pointsX: Array<IPointX>, pointsY: Array<IPointY> }} param2 Содержит данные всех осевых точек
	 * @private
	 */
	private _mousemoveByCanvas(canvas: ICanvasClass, bounds: IBounds, { pointsX, pointsY, }): void {
		if (!Object.keys(this.blockInfo).length) {
			return;
		}

		const pointsYOnScreen: Array<IPointY> = pointsY.filter(({ onScreen, }) => onScreen);
		const { y: firstPointYOrdinate, height: firstPointYHeight, } = pointsYOnScreen[0];
		const { y: lastPointYOrdinate, height: lastPointYHeight, } = pointsYOnScreen[pointsYOnScreen.length - 1];
		const endY: number = lastPointYOrdinate - firstPointYHeight / 2;
		const startY: number = firstPointYOrdinate - lastPointYHeight / 2;

		canvas.canvasElement.addEventListener("mousemove", (e: MouseEvent) => this._mousemoveByCanvasHandler(e, endY, pointsX, startY, canvas, bounds));
	}

	/**
	 * Обработчик события mouseleave у элемента canvas
	 * Обновляет график и изменяет тип курсора на обычный
	 * @private
	 */
	private _leavemouseFromCanvasAreaHandler(): void {
		document.documentElement.setAttribute("style", "default");
		this.update();
	}

	/**
	 * Добавление события mouseleave элементу canvas
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @private
	 */
	private _leavemouseFromCanvasArea(canvas: ICanvasClass): void {
		canvas.canvasElement.addEventListener("mouseleave", this._leavemouseFromCanvasAreaHandler.bind(this));
	}

	/**
	 * Обработчик события click у элемента canvas
	 * Скрывает группы при клике на элементы легенды
	 * @param {MouseEvent} e Объект event
	 * @param {Array<IItemLegend>} legendItems Содержит данные элементов легенды
	 * @private
	 */
	private _clickByCanvasAreaHandler(e: MouseEvent, legendItems: Array<IItemLegend>): void {
		const { events = {}, } = this.legend;
		const mousePos: IPos = { x: e.offsetX, y: e.offsetY, };
		const findMatchLegendItem: IItemLegend | null = legendItems.find(({ x, y, width, height, }) => {
			const endX: number = x + width;
			const startY: number = y - height;

			return (mousePos.x <= endX && mousePos.x >= x) && (mousePos.y <= y && mousePos.y >= startY);
		});

		if (findMatchLegendItem) {
			const { group, } = findMatchLegendItem;
			const findIdxHideGroup: number = this.hideGroups.indexOf(group);

			if (findIdxHideGroup !== -1) {
				this.hideGroups.splice(findIdxHideGroup, 1);
			} else {
				this.hideGroups.push(group);
			}

			// Вызываем функцию-обработчик для обработки события клика на элемент легенды
			if (isFunction(events.onClick)) {
				const hiddenLegendItems = legendItems.filter(({ group: g, }) => this.hideGroups.includes(g));
				const notHiddenItems = legendItems.filter(({ group: g, }) => !this.hideGroups.includes(g));

				events.onClick.call({ element: findMatchLegendItem, hiddenElements: hiddenLegendItems, elements: legendItems, notHiddenElements: notHiddenItems, });
			}

			this.update();
		}
	}

	/**
	 * Добавление события click элементу canvas
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @param {Array<IItemLegend>} legendItems Содержит данные элементов легенды
	 * @private
	 */
	private _clickByCanvasArea(canvas: ICanvasClass, legendItems: Array<IItemLegend>): void {
		canvas.canvasElement.addEventListener("click", (e: MouseEvent) => this._clickByCanvasAreaHandler(e, legendItems));
	}

	/**
	 * Рисует диаграмму в зависимости от ее типа
	 * @param {IAxisYClass} axisY Экземпляр класса AxisY
	 * @param {IAxisXClass} axisX Экземпляр класса AxisX
	 * @param {ICanvasClass} canvas Экземпляр класса Canvas
	 * @private
	 */
	private _drawChartByType(axisY: IAxisYClass, axisX: IAxisXClass, canvas: ICanvasClass): void {
		const { width, height, } = canvas.getSizes();

		switch (this.type) {
			case "line":
				new LineChart(
					this.data,
					this.line,
					this.cap,
					axisY.points as Array<IPointY>,
					axisX.points as Array<IPointX>,
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
	public update(): ISineraClass {
		const canvas: ICanvasClass = this._setCanvas();
		const chart: IChartClass = this._setChartTitle(canvas);
		const legend: ILegendClass = this._setLegend(canvas, chart);
		const axisY: IAxisYClass = this._setAxisYTitle(canvas, chart);
		const axisX: IAxisXClass = this._setAxisXTitle(canvas, chart);

		this._setPoints(axisY, axisX, legend, chart);
		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);

		return this;
	}

	// Рисует диаграмму
	public init(): ISineraClass {
		const canvas: ICanvasClass = this._setCanvas();
		const chart: IChartClass = this._setChartTitle(canvas);
		const legend: ILegendClass = this._setLegend(canvas, chart);
		const axisY: IAxisYClass = this._setAxisYTitle(canvas, chart);
		const axisX: IAxisXClass = this._setAxisXTitle(canvas, chart);
		const points: IAxisPoints = this._setPoints(axisY, axisX, legend, chart);

		this._mousemoveByCanvas(canvas, chart.getBounds(), points);
		this._leavemouseFromCanvasArea(canvas);
		this._clickByCanvasArea(canvas, legend.items);
		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);
		this._windowResize();

		return this;
	}
}

export { Utils, Sinera, };