import Text from "../elements/Text";

import isNumber from "../../helpers/isNumber";
import getTextStr from "../../helpers/getTextStr";
import getTextSize from "../../helpers/getTextSize";

import { TEmptyObject, TTypeChart, } from "../../types/index";

import { IAxisX, IAxisXClass, IAxisXTitle, IAxisXTitleData, } from "../../interfaces/axisX";
import { IAxisY, IAxisYClass, IAxisYTitleData, } from "../../interfaces/axisY";
import { IBounds, IPadding, IPos, ISize, IGapsForLegend, IGapsForXPoints, IGapsForXTitle, IGapsForYPoints, IGapsForYTitle, } from "../../interfaces/global";
import { IChartClass, IChartTitle, IChartTitleData, IChartTitleWithSizeAndPos, ITitleTheme, } from "../../interfaces/chart";
import { IData, } from "../../interfaces/data";
import { IFontWithText, ISpecialFontData, } from "../../interfaces/text";
import { ILegendData, ILegendGaps, } from "../../interfaces/legend";

class Chart implements IChartClass {
	public padding: IPadding;
	public data: IData;
	public ctx: CanvasRenderingContext2D;
	public width: number;
	public height: number;
	public title: IChartTitle | TEmptyObject;
	public type: TTypeChart;
	public defaultPadding: number;
	public hideGroups: Array<string>;
	public theme: ITitleTheme | TEmptyObject;
	public titleData: IChartTitleData;

	constructor(
		padding: IPadding,
		data: IData,
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		type: TTypeChart,
		title: IChartTitle | TEmptyObject,
		theme: ITitleTheme | TEmptyObject = {},
		hideGroups: Array<string> = []
	) {
		// Содержит скрытые группы
		this.hideGroups = hideGroups;
		// Содержит стили от темы
		this.theme = theme;
		// Содержит данные групп
		this.data = data;
		// Ширина элемента canvas
		this.width = width;
		// Высота элемента canvas
		this.height = height;
		// Контекст элемента canvas
		this.ctx = ctx;
		// Тип диаграммы
		this.type = type;
		// Заголовок диаграммы
		this.title = title || {};
		// Внутренние отступы диаграммы
		this.padding = padding;
		// Внутренний отступ по умолчанию
		this.defaultPadding = 10;
		// Содержит дополнительные данные заголовка диаграммы
		this.titleData = {
			font: {
				text: "",
				size: null,
				color: "",
				weight: null,
			},
			gapBottom: null,
			x: null,
			y: null,
			width: null,
			height: null,
		};
	}

	/**
	 * Определяет границы диаграммы
	 * @returns {IBounds} Границы
	 */
	public getBounds(): IBounds {
		const bounds: IBounds = {
			width: null,
			height: null,
			horizontal: {
				start: isNumber(this.padding.left) ? this.padding.left : this.defaultPadding,
				end: this.width - (isNumber(this.padding.right) ? this.padding.right : this.defaultPadding),
			},
			vertical: {
				start: isNumber(this.padding.top) ? this.padding.top : this.defaultPadding,
				end: this.height - (isNumber(this.padding.bottom) ? this.padding.bottom : this.defaultPadding),
			},
		};

		bounds.width = bounds.horizontal.end - bounds.horizontal.start;
		bounds.height = bounds.vertical.end - bounds.vertical.start;

		return bounds;
	}

	/**
	 * Рисует заголовок диаграммы
	 * @returns {IChartClass}
	 */
	public drawTitle(): IChartClass {
		if (!Object.keys(this.title).length) {
			return this;
		}

		const { weight = 600, size, text, color = this.theme.color, } = this.title.font;
		const font: ISpecialFontData = { color, text, str: getTextStr(size, weight), };
		const sizes: ISize = getTextSize(size, weight, text, this.ctx);
		const bounds: IBounds = this.getBounds();
		const startX: number = bounds.horizontal.start;
		const endX: number = bounds.horizontal.end - sizes.width;
		const posText: IPos = {
			x: startX + (endX - startX) / 2,
			y: bounds.vertical.start + sizes.height,
		};

		new Text(
			font,
			this.ctx,
			posText.x,
			posText.y
		).draw();

		this.titleData = {
			...this.title as IChartTitle,
			...posText,
			...sizes,
		};

		return this;
	}

	/**
	 * Определяет отступы для оси ординат
	 * @param {IAxisYClass} axisY Экземпляр класса AxisY
	 * @param {IAxisXClass} axisX Экземпляр класса AxisX
	 * @param {IChartTitle} chartTitle Содержит данные заголовка диаграммы
	 * @param {ILegendData} legend Содержит данные легенды
	 * @returns {IGapsForYPoints} Отступы
	 */
	public getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitleData, legend: ILegendData): IGapsForYPoints {
		const { gaps: gapsLegend = {} as ILegendGaps, totalHeight: legendHeight = 0, } = legend;
		const { showText: showXText = Boolean(Object.keys(axisX.font).length), } = axisX.font;

		const legendGapBottom: number = (gapsLegend.legend || {}).bottom || 0;
		const axisYTitleHeight: number = ((axisY.titleData || {})).height || 0;
		const axisYTitleGapRight: number = ((axisY.titleData || {})).gapRight || 0;
		const chartTitleYPos: number = ((chartTitle || {})).y || 0;
		const chartTitleGapBottom: number = (chartTitle || {}).gapBottom || 0;
		const axisXTitleHeight: number = ((axisX.titleData || {})).height || 0;
		const axisXTitleGapTop: number = ((axisX.titleData || {})).gapTop || 0;
		const gapBottomIfRotateX: number = axisX.rotate ? axisX.getMaxWidthTextPoint() : axisX.getMaxHeightTextPoint();

		return {
			left: axisYTitleHeight + axisYTitleGapRight,
			top: chartTitleYPos + chartTitleGapBottom + legendHeight + legendGapBottom,
			bottom: (showXText ? axisX.gapTopAxisX + gapBottomIfRotateX : 0) + axisXTitleHeight + axisXTitleGapTop,
		};
	}

	/**
	 * Определяет отступы для оси абсцисс
	 * @param {IAxisYClass} axisY Экземпляр класса AxisY
	 * @param {IAxisXClass} axisX Экземпляр класса AxisX
	 * @returns {IGapsForXPoints} Отступы ({ left, right, bottom })
	 */
	public getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass): IGapsForXPoints {
		const { font: axisYFont = {}, titleData: axisYTitle = {} as IAxisYTitleData, gapRightAxisY, } = axisY;
		const { font: axisXFont = {}, titleData: axisXTitle = {} as IAxisXTitleData, } = axisX;
		const ignoreNames: Array<string | number> = axisX.getIgnoreNames();
		const names: Array<string | number> = axisY.getAxesData(this.data).names;
		const lastName: string | number = names[names.length - 1];
		const firstName: string | number = names[0];
		const { weight = 400, size, showText: showXText = Boolean(Object.keys(axisXFont).length), } = axisXFont;
		const { showText: showYText = Boolean(Object.keys(axisYFont).length), } = axisYFont;

		const firstNameWidth: number = getTextSize(size, weight, axisX.getCorrectName(firstName).toString(), this.ctx).width;
		const firstNameIsNotIgnore: boolean = showXText && !(ignoreNames || []).includes(firstName);
		const lastNameWidth: number = getTextSize(size, weight, axisX.getCorrectName(lastName).toString(), this.ctx).width;
		const lastNameIsNotIgnore: boolean = showXText && !(ignoreNames || []).includes(lastName);
		const axisYTitleHeight: number = axisYTitle.height || 0;
		const axisYTitleGapRight: number = axisYTitle.gapRight || 0;
		const axisXTitleHeight: number = axisXTitle.height || 0;
		const axisXTitleGapTop: number = axisXTitle.gapTop || 0;

		return {
			left: (firstNameIsNotIgnore ? firstNameWidth / 2 : 0) + axisYTitleHeight + axisYTitleGapRight + (showYText ? axisY.getMaxTextWidthAtYAxis() + gapRightAxisY : 0),
			right: lastNameIsNotIgnore ? lastNameWidth / 2 : 0,
			bottom: axisXTitleHeight + axisXTitleGapTop,
		};
	}

	/**
	 * Определяет отступы для заголовка оси ординат
	 * @param {IChartTitleWithSizeAndPos} chartTitle Содержит данные заголовка диаграммы
	 * @param {ILegendData} legend Содержит данные легенды
	 * @param {IAxisX} axisX Содержит данные оси абсцисс
	 * @returns {IGapsForYTitle} Отступы ({ top, bottom })
	 */
	public getGapsForYTitle(chartTitle: IChartTitleData, legend: ILegendData, axisX: IAxisX): IGapsForYTitle {
		const { y: chartTitleY = 0, gapBottom: chartTitleGapBottom = 0, } = chartTitle;
		const { totalHeight: legendHeight, gaps: gapsLegend = {} as ILegendGaps, } = legend;
		const { title: axisXTitle = {} as IAxisXTitle, } = axisX;
		const { font: axisXTitleFont = {} as IFontWithText, gapTop: axisXTitleGapTop = 0, } = axisXTitle;
		const { size, weight = 600, text, } = axisXTitleFont;
		const axisXTitleHeight: number = getTextSize(size, weight, text, this.ctx).height || 0;
		const legendGapBottom: number = (gapsLegend.legend || {}).bottom || 0;

		return {
			top: chartTitleY + legendGapBottom + chartTitleGapBottom + legendHeight,
			bottom: axisXTitleHeight + axisXTitleGapTop,
		};
	}

	/**
	 * Определяет отступы для заголовка оси абсцисс
	 * @param {IAxisYClass} axisY Экземпляр класса AxisY
	 * @returns {IGapsForXTitle} Отступы ({ top, left })
	 */
	public getGapsForXTitle(axisY: IAxisYClass): IGapsForXTitle {
		const { titleData = {} as IAxisYTitleData, gapRightAxisY, } = axisY;
		const { gapRight = 0, height = 0, } = titleData;

		return { left: height + gapRight + gapRightAxisY, };
	}

	/**
	 * Определяет отступы для легенды
	 * @param {IAxisY} axisY Содержит данные оси ординат
	 * @param {IChartTitleWithSizeAndPos} chartTitle Содержит данные заголовка диаграммы
	 * @returns {IGapsForLegend} Отступы ({ top, left })
	 */
	public getGapsForLegend(axisY: IAxisY, chartTitle: IChartTitleWithSizeAndPos): IGapsForLegend {
		const { y = 0, gapBottom = 0, } = chartTitle;
		const { font = {}, } = (axisY.title || {});
		const { size, weight = 600, text, } = font as IFontWithText;
		const titleAxisYHeight: number = getTextSize(size, weight, text, this.ctx).height || 0;

		return {
			top: y + gapBottom,
			left: titleAxisYHeight,
		};
	}
}

export default Chart;
