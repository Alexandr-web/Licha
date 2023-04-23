import Canvas from "./ui/Canvas";
import Chart from "./ui/chart/Chart";
import AxisY from "./ui/axis/AxisY";
import LineChart from "./ui/chart/LineChart";
import Grid from "./ui/Grid";
import AxisX from "./ui/axis/AxisX";
import Legend from "./ui/Legend";
import Utils from "./Utils/Utils";
import ChartEvents from "./ChartEvents";

import { TEmptyObject, TTypeChart, } from "./types/index";

import { ISineraClass, ISineraConstructor, } from "./interfaces/sinera";
import { IAxisPoints, IAxisThemePoint, IAxisThemeTitle, } from "./interfaces/axis";
import { IAxisX, IAxisXClass, IPointX, } from "./interfaces/axisX";
import { IAxisY, IAxisYClass, IPointY, } from "./interfaces/axisY";
import { IBlockInfo, } from "./interfaces/blockInfo";
import { IGaps, IPadding, } from "./interfaces/global";
import { ICanvasClass, } from "./interfaces/canvas";
import { ICap, } from "./interfaces/cap";
import { IChartClass, IChartTitle, IChartTitleWithSizeAndPos, } from "./interfaces/chart";
import { IData, } from "./interfaces/data";
import { IGrid, IGridClass, } from "./interfaces/grid";
import { ILegend, ILegendClass, ILegendData, } from "./interfaces/legend";
import { ILine, ILineTheme, } from "./interfaces/line";
import { ITheme, } from "./interfaces/utils";

import isNumber from "./helpers/isNumber";
import getPaddingObj from "./helpers/getPaddingObj";
import ifTrueThenOrElse from "./helpers/ifTrueThenOrElse";
import { IChartEventsClass, } from "./interfaces/chartEvents";

class Sinera implements ISineraClass {
	public readonly selectorCanvas: string;
	public readonly background?: string | Array<string>;
	public readonly title?: IChartTitle | TEmptyObject;
	public readonly theme?: ITheme | TEmptyObject;
	public readonly data: IData;
	public readonly axisY?: IAxisY | TEmptyObject;
	public readonly axisX?: IAxisX | TEmptyObject;
	public readonly line?: ILine | TEmptyObject;
	public readonly cap?: ICap | TEmptyObject;
	public readonly grid?: IGrid | TEmptyObject;
	public readonly legend?: ILegend | TEmptyObject;
	public readonly blockInfo?: IBlockInfo | TEmptyObject;
	public readonly type?: TTypeChart;
	public readonly padding?: IPadding | TEmptyObject | number;
	public readonly hideGroups?: Array<string>;
	public readonly fontFamily?: string;

	constructor({
		selectorCanvas,
		background,
		type,
		fontFamily = "Arial",
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
		// Семейство шрифтов
		this.fontFamily = fontFamily;
		// Внутренние отступы
		this.padding = ifTrueThenOrElse(isNumber(padding), getPaddingObj(padding as number), padding);
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
			this.fontFamily,
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
			this.fontFamily,
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
		const { place, step, editValue, title, font, sort, } = this.axisY;
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
			this.fontFamily,
			place,
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
		const { font, editName, sort, ignoreNames, title, rotate, place, } = this.axisX;
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
			place,
			this.fontFamily,
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
		const x: IAxisXClass = axisX.drawPoints(chart.getGapsForXPoints(axisY, axisX, chart, { ...this.legend, ...legend, } as ILegendData));

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
					this.fontFamily,
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
		const chartEvents: IChartEventsClass = new ChartEvents(this.data, this, this.update, this.blockInfo, this.axisX, this.axisY, this.theme, this.legend, this.fontFamily);

		chartEvents.init(canvas, chart, points, legend);

		this._setGrid(canvas, axisX, axisY);
		this._drawChartByType(axisY, axisX, canvas);

		return this;
	}
}

export { Utils, Sinera, };