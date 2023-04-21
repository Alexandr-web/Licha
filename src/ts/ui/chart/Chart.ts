import Text from "../elements/Text";

import isNumber from "../../helpers/isNumber";
import getTextStr from "../../helpers/getTextStr";
import getTextSize from "../../helpers/getTextSize";
import getPaddingObj from "../../helpers/getPaddingObj";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";

import { TEmptyObject, TTypeChart, } from "../../types/index";

import { IAxisXClass, IAxisXTitleData, } from "../../interfaces/axisX";
import { IAxisY, IAxisYClass, IAxisYTitleData, } from "../../interfaces/axisY";
import { IBounds, IPadding, IPos, ISize, IGaps, } from "../../interfaces/global";
import { IChartClass, IChartTitle, IChartTitleData, IChartTitleWithSizeAndPos, ITitleTheme, } from "../../interfaces/chart";
import { IData, } from "../../interfaces/data";
import { IFontWithText, ISpecialFontData, } from "../../interfaces/text";
import { ILegendData, ILegendGaps, } from "../../interfaces/legend";

class Chart implements IChartClass {
	public readonly padding: IPadding | TEmptyObject | number;
	public readonly data: IData;
	public readonly ctx: CanvasRenderingContext2D;
	public readonly width: number;
	public readonly height: number;
	public readonly title: IChartTitle | TEmptyObject;
	public readonly type: TTypeChart;
	public readonly defaultPadding: number;
	public readonly hideGroups: Array<string>;
	public readonly theme: ITitleTheme | TEmptyObject;
	public readonly fontFamily: string;
	public titleData: IChartTitleData;

	constructor(
		padding: IPadding | TEmptyObject | number,
		data: IData,
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		type: TTypeChart,
		title: IChartTitle | TEmptyObject,
		fontFamily: string,
		theme: ITitleTheme | TEmptyObject = {},
		hideGroups: Array<string> = []
	) {
		// Семейство шрифта
		this.fontFamily = fontFamily;
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
		this.padding = ifTrueThenOrElse(isNumber(padding), getPaddingObj(padding as number), padding);
		// Внутренний отступ по умолчанию
		this.defaultPadding = 10;
		// Содержит дополнительные данные заголовка диаграммы
		this.titleData = {
			font: {
				text: null,
				size: null,
				color: null,
				weight: null,
			},
			gaps: { bottom: null, },
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
		const padding = this.padding as IPadding;
		const bounds: IBounds = {
			width: null,
			height: null,
			horizontal: {
				start: ifTrueThenOrElse(isNumber(padding.left), padding.left, this.defaultPadding),
				end: this.width - ifTrueThenOrElse(isNumber(padding.right), padding.right, this.defaultPadding),
			},
			vertical: {
				start: ifTrueThenOrElse(isNumber(padding.top), padding.top, this.defaultPadding),
				end: this.height - ifTrueThenOrElse(isNumber(padding.bottom), padding.bottom, this.defaultPadding),
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
		const font: ISpecialFontData = { color, text, str: getTextStr(size, weight, this.fontFamily), };
		const sizes: ISize = getTextSize(size, weight, text, this.ctx, this.fontFamily);
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
	 * @returns {IGaps} Отступы
	 */
	public getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitleData, legend: ILegendData): IGaps {
		const { gaps: gapsLegend = {} as ILegendGaps, height: legendHeight = 0, } = legend;
		const { font: axisXFont = {}, place: placeAxisX = "top", } = axisX;
		const { showText: showXText = Boolean(Object.keys(axisX.font).length), } = axisXFont;

		const legendGapBottom: number = (gapsLegend.legend || {}).bottom || 0;
		const axisYTitleHeight: number = (axisY.titleData || {}).height || 0;
		const axisYTitleGapRight: number = ((axisY.titleData || {}).gaps || {}).right || 0;
		const chartTitleHeight: number = (chartTitle || {}).height || 0;
		const chartTitleGapBottom: number = ((chartTitle || {}).gaps || {}).bottom || 0;
		const axisXTitleHeight: number = (axisX.titleData || {}).height || 0;
		const axisXTitleGapTop: number = ((axisX.titleData || {}).gaps || {}).top || 0;
		const gapBottomIfRotateX: number = ifTrueThenOrElse(axisX.rotate, axisX.getMaxWidthTextPoint(), axisX.getMaxHeightTextPoint());
		const gapTopIfAxisXPlaceIsTopAndRotate: number = ifTrueThenOrElse([showXText, axisX.rotate, placeAxisX === "top"], axisX.getMaxWidthTextPoint() + axisX.gapTopAxisX, 0);
		const gapTopIfAxisXPlaceIsTop: number = ifTrueThenOrElse([showXText, !axisX.rotate, placeAxisX === "top"], axisX.getMaxHeightTextPoint() + axisX.gapTopAxisX, 0);

		return {
			left: axisYTitleHeight + axisYTitleGapRight,
			top: chartTitleHeight + gapTopIfAxisXPlaceIsTop + gapTopIfAxisXPlaceIsTopAndRotate + chartTitleGapBottom + legendHeight + legendGapBottom,
			bottom: ifTrueThenOrElse([showXText, placeAxisX === "bottom"], axisX.gapTopAxisX + gapBottomIfRotateX, 0) + axisXTitleHeight + axisXTitleGapTop,
		};
	}

	/**
	 * Определяет отступы для оси абсцисс
	 * @param {IAxisYClass} axisY Экземпляр класса AxisY
	 * @param {IAxisXClass} axisX Экземпляр класса AxisX
	 * @param {IChartClass} chart Экземпляр класса Chart
	 * @param {ILegendData} legend Содержит данные легенды
	 * @returns {IGaps} Отступы
	 */
	public getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass, chart: IChartClass, legend: ILegendData): IGaps {
		const { font: axisYFont = {}, titleData: axisYTitle = {} as IAxisYTitleData, gapRightAxisY, } = axisY;
		const { font: axisXFont = {}, titleData: axisXTitle = {} as IAxisXTitleData, place = "bottom", } = axisX;
		const { title: chartTitle = {}, titleData: chartTitleData, } = chart;
		const { gaps: chartTitleGaps = {}, } = chartTitle;
		const { gaps: gapsLegend = {}, height: legendHeight = 0, } = legend;
		const { legend: legendGaps = {}, } = gapsLegend as ILegendGaps;
		const { bottom: legendGapBottom = 0, } = legendGaps;
		const { bottom: chartTitleGapBottom = 0, } = chartTitleGaps as IGaps;
		const { weight = 400, size, showText: showXText = Boolean(Object.keys(axisXFont).length), } = axisXFont;
		const { showText: showYText = Boolean(Object.keys(axisYFont).length), } = axisYFont;
		const ignoreNames: Array<string | number> = axisX.getIgnoreNames();
		const names: Array<string | number> = axisY.getAxesData(this.data).names;
		const lastName: string | number = names[names.length - 1];
		const firstName: string | number = names[0];

		const firstNameWidth: number = getTextSize(size, weight, axisX.getCorrectName(firstName).toString(), this.ctx, this.fontFamily).width;
		const firstNameIsNotIgnore: boolean = showXText && !(ignoreNames || []).includes(firstName);
		const lastNameWidth: number = getTextSize(size, weight, axisX.getCorrectName(lastName).toString(), this.ctx, this.fontFamily).width;
		const lastNameIsNotIgnore: boolean = showXText && !(ignoreNames || []).includes(lastName);
		const axisYTitleHeight: number = axisYTitle.height || 0;
		const axisYTitleGapRight: number = (axisYTitle.gaps || {}).right || 0;
		const axisXTitleHeight: number = axisXTitle.height || 0;
		const axisXTitleGapTop: number = (axisXTitle.gaps || {}).top || 0;
		const chartTitleHeight: number = chartTitleData.height || 0;

		return {
			left: ifTrueThenOrElse(firstNameIsNotIgnore, firstNameWidth / 2, 0) + axisYTitleHeight + axisYTitleGapRight + ifTrueThenOrElse(showYText, axisY.getMaxTextWidthAtYAxis() + gapRightAxisY, 0),
			right: ifTrueThenOrElse(lastNameIsNotIgnore, lastNameWidth / 2, 0),
			bottom: axisXTitleHeight + axisXTitleGapTop,
			top: ifTrueThenOrElse([showXText, place === "top"], legendGapBottom + legendHeight + chartTitleGapBottom + chartTitleHeight, 0),
		};
	}

	/**
	 * Определяет отступы для легенды
	 * @param {IAxisY} axisY Содержит данные оси ординат
	 * @param {IChartTitleWithSizeAndPos} chartTitle Содержит данные заголовка диаграммы
	 * @returns {IGaps} Отступы
	 */
	public getGapsForLegend(axisY: IAxisY, chartTitle: IChartTitleWithSizeAndPos): IGaps {
		const { height: chartTitleHeight = 0, gaps: chartTitleGaps, } = chartTitle;
		const { bottom: chartTitleGapBottom = 0, } = chartTitleGaps;
		const { font = {}, } = (axisY.title || {});
		const { size, weight = 600, text, } = font as IFontWithText;
		const titleAxisYHeight: number = getTextSize(size, weight, text, this.ctx, this.fontFamily).height || 0;

		return {
			top: chartTitleHeight + chartTitleGapBottom,
			left: titleAxisYHeight,
		};
	}
}

export default Chart;
