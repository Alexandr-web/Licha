import Text from "../elements/Text";

import isNumber from "../../helpers/isNumber";
import getTextStr from "../../helpers/getTextStr";
import getTextSize from "../../helpers/getTextSize";
import getPaddingObj from "../../helpers/getPaddingObj";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";
import defaultParams from "../../helpers/defaultParams";

import { TEmptyObject, TTypeChart, } from "../../types/index";

import { IAxisXClass, IAxisXTitleData, } from "../../interfaces/axisX";
import { IAxisY, IAxisYClass, IAxisYTitle, IAxisYTitleData, } from "../../interfaces/axisY";
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
	public readonly axisYTitle: IAxisYTitle | TEmptyObject;
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
		hideGroups: Array<string> = [],
		axisYTitle: IAxisYTitle | TEmptyObject = {}
	) {
		// Содержит данные заголовка оси ординат
		this.axisYTitle = axisYTitle;
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
	 * Определяет позицию заголовка по оси абсцисс
	 * @param {ISize} sizes Размеры текста заголовка
	 * @returns {number}
	 */
	private _getPosXForTitle(sizes: ISize): number {
		const bounds: IBounds = this.getBounds();
		const { place: defaultPlace, } = defaultParams.chartTitle;
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		const { place = defaultPlace, } = this.title;
		const { gaps: axisYTitleGaps = {}, font: axisYTitleFont = {}, } = this.axisYTitle;
		const { size: axisYTitleSize = defaultSize, weight: axisYTitleWeight = defaultWeight, text, } = axisYTitleFont as IFontWithText;
		const axisYTitleHeight: number = getTextSize(axisYTitleSize, axisYTitleWeight, text, this.ctx, this.fontFamily).height;
		const axisYTitleGapRight: number = axisYTitleGaps.right || 0;
		const startX: number = bounds.horizontal.start;
		const endX: number = bounds.horizontal.end - sizes.width;

		switch (place) {
			case "left":
				return startX + ifTrueThenOrElse("text" in axisYTitleFont, axisYTitleGapRight + axisYTitleHeight, 0);
			case "center":
				return startX + (endX - startX) / 2;
			case "right":
				return endX;
		}
	}

	/**
	 * Рисует заголовок диаграммы
	 * @returns {IChartClass}
	 */
	public drawTitle(): IChartClass {
		if (!Object.keys(this.title).length) {
			return this;
		}

		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		const { weight = defaultWeight, size = defaultSize, text, color = this.theme.color, } = this.title.font;
		const font: ISpecialFontData = { color, text, str: getTextStr(size, weight, this.fontFamily), };
		const sizes: ISize = getTextSize(size, weight, text, this.ctx, this.fontFamily);
		const bounds: IBounds = this.getBounds();
		const posText: IPos = {
			x: this._getPosXForTitle(sizes),
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
		const { place: defaultAxisXPlace, } = defaultParams.axisX;
		// Отступы всех элементов легенды и высота легенды
		const { gaps: gapsLegend = {} as ILegendGaps, height: legendHeight = 0, } = legend;
		// Отступы легенды
		const { legend: legendGaps = {}, } = gapsLegend;
		// Данные заголовка оси ординат
		const { titleData: axisYTitleData = {}, } = axisY;
		// Отступы заголовка оси ординат и его высота
		const { gaps: axisYTitleDataGaps = {}, height: axisYTitleHeight, } = axisYTitleData as IAxisYTitleData;
		// Высота и отступы заголовка диаграммы
		const { height: chartTitleHeight = 0, gaps: chartTitleGaps = {}, } = chartTitle;
		// Данные шрифта, позиция и данные заголовка оси абсцисс
		const { font: axisXFont = {}, place: placeAxisX = defaultAxisXPlace, titleData: axisXTitleData = {}, } = axisX;
		// Высота и отступы заголовка оси абсцисс
		const { height: axisXTitleDataHeight = 0, gaps: axisXTitleDataGaps = {}, } = axisXTitleData as IAxisXTitleData;
		// Правило, при котором элементы оси абсцисс будут отображаться на диаграмме
		const { showText: showXText = Boolean(Object.keys(axisX.font).length), } = axisXFont;

		// Нижний отступ у легенды
		const legendGapBottom: number = legendGaps.bottom || 0;
		// Отступ справа у заголовка оси ординат
		const axisYTitleGapRight: number = axisYTitleDataGaps.right || 0;
		// Нижний отступ у заголовка диаграммы
		const chartTitleGapBottom: number = chartTitleGaps.bottom || 0;
		// Верхний отступ у заголовка оси абсцисс
		const axisXTitleGapTop: number = axisXTitleDataGaps.top || 0;
		// Отступ снизу, если правило rotate у axisX правдиво
		const gapBottomIfRotateX: number = ifTrueThenOrElse(axisX.rotate, axisX.getMaxWidthTextPoint(), axisX.getMaxHeightTextPoint());
		// Отступ сверху, если позиция у оси абсцисс сверху и правило rotate у axisX правдиво
		const gapTopIfAxisXPlaceIsTopAndRotate: number = ifTrueThenOrElse([showXText, axisX.rotate, placeAxisX === "top"], axisX.getMaxWidthTextPoint() + axisX.gapTopAxisX, 0);
		// Отступ сверху, если позиция у оси абсцисс сверху и правило rotate у axisX ложно
		const gapTopIfAxisXPlaceIsTop: number = ifTrueThenOrElse([showXText, !axisX.rotate, placeAxisX === "top"], axisX.getMaxHeightTextPoint() + axisX.gapTopAxisX, 0);

		return {
			left: axisYTitleHeight + axisYTitleGapRight,
			top: chartTitleHeight + gapTopIfAxisXPlaceIsTop + gapTopIfAxisXPlaceIsTopAndRotate + chartTitleGapBottom + legendHeight + legendGapBottom,
			bottom: ifTrueThenOrElse([showXText, placeAxisX === "bottom"], axisX.gapTopAxisX + gapBottomIfRotateX, 0) + axisXTitleDataHeight + axisXTitleGapTop,
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
		const { place: defaultAxisYPlace, } = defaultParams.axisY;
		const { place: defaultAxisXPlace, } = defaultParams.axisX;
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.textFont;
		// Данные шрифта, заголовок, отступ между осями и позиция оси ординат
		const { font: axisYFont = {}, titleData: axisYTitle = {} as IAxisYTitleData, gapRightAxisY, place: axisYPlace = defaultAxisYPlace, } = axisY;
		// Данные шрифта, заголовок, позиция оси абсцисс и правило, при котором элементы оси абсцисс будут повернуты на 90 градусов
		const { font: axisXFont = {}, titleData: axisXTitle = {} as IAxisXTitleData, place: axisXPlace = defaultAxisXPlace, rotate: rotateAxisX, } = axisX;
		// Заголовок и дынные заголовка диаграммы
		const { title: chartTitle = {}, titleData: chartTitleData, } = chart;
		// Отступы у заголовка диаграммы
		const { gaps: chartTitleGaps = {}, } = chartTitle;
		// Отступы и высота легенды
		const { gaps: gapsLegend = {}, height: legendHeight = 0, } = legend;
		// Объект отступов легенды
		const { legend: legendGaps = {}, } = gapsLegend as ILegendGaps;
		// Отступы легенды
		const { bottom: legendGapBottom = 0, } = legendGaps;
		// Нижний отступ заголовка диаграммы
		const { bottom: chartTitleGapBottom = 0, } = chartTitleGaps as IGaps;
		// Жирность, размер элементов оси абсцисс и правило, при котором элементы оси абсцисс будут отображаться на диаграмме
		const { weight = defaultWeight, size = defaultSize, showText: showXText = Boolean(Object.keys(axisXFont).length), } = axisXFont;
		// Правило, при котором элементы оси ординат будут отображаться на диаграмме
		const { showText: showYText = Boolean(Object.keys(axisYFont).length), } = axisYFont;
		// Названия, которые не будут отображаться на диаграмме
		const ignoreNames: Array<string | number> = axisX.getIgnoreNames();
		// Все названия
		const names: Array<string | number> = axisY.getAxesData(this.data).names;
		const lastName: string | number = names[names.length - 1];
		const firstName: string | number = names[0];

		// Ширина и высота первого названия
		const { width: firstNameWidth, height: firstNameHeight, } = getTextSize(size, weight, axisX.getCorrectName(firstName).toString(), this.ctx, this.fontFamily);
		// Отображено ли первое название
		const firstNameIsNotIgnore: boolean = showXText && !(ignoreNames || []).includes(firstName);
		// Ширина и высота последнего названия
		const { width: lastNameWidth, height: lastNameHeight, } = getTextSize(size, weight, axisX.getCorrectName(lastName).toString(), this.ctx, this.fontFamily);
		// Отображено ли последнее название
		const lastNameIsNotIgnore: boolean = showXText && !(ignoreNames || []).includes(lastName);
		// Высота заголовка оси ординат
		const axisYTitleHeight: number = axisYTitle.height || 0;
		// Отступ справа у заголовка оси ординат
		const axisYTitleGapRight: number = (axisYTitle.gaps || {}).right || 0;
		// Высота заголовка оси абсцисс
		const axisXTitleHeight: number = axisXTitle.height || 0;
		// Отступ справа у заголовка оси абсцисс
		const axisXTitleGapTop: number = (axisXTitle.gaps || {}).top || 0;
		// Высота заголовка диаграммы
		const chartTitleHeight: number = chartTitleData.height || 0;
		// Отступ справа, если последнее название отображено и правило rotate у axisX ложно
		const gapRightIfLastNameIsNotIgnoreAndRotateXIsFalse: number = ifTrueThenOrElse([lastNameIsNotIgnore, !rotateAxisX], lastNameWidth / 2, 0);
		// Отступ справа, если последнее название отображено и правило rotate у axisX правдиво
		const gapRightIfLastNameIsNotIgnoreAndRotateXIsTrue: number = ifTrueThenOrElse([lastNameIsNotIgnore, rotateAxisX], lastNameHeight / 2, 0);
		// Отступ слева, если первое название отображено и правило rotate у axisX ложно
		const gapLeftIfFirstNameIsNotIgnoreAndRotateAxisXIsFalse: number = ifTrueThenOrElse([firstNameIsNotIgnore, !rotateAxisX], firstNameWidth / 2, 0);
		// Отступ слева, если первое название отображено и правило rotate у axisX правдиво
		const gapLeftIfFirstNameIsNotIgnoreAndRotateAxisXIsTrue: number = ifTrueThenOrElse([firstNameIsNotIgnore, rotateAxisX], firstNameHeight / 2, 0);
		// Отступ слева, если ось ординат находится слева
		const gapLeftIfAxisYPlaceIsLeft: number = ifTrueThenOrElse([showYText, axisYPlace === "left"], axisY.getMaxTextWidthAtYAxis() + gapRightAxisY, 0);
		// Отступ слева, если ось ординат находится справа
		const gapRightIfAxisYPlaceIsRight: number = ifTrueThenOrElse([axisYPlace === "right", showYText], axisY.getMaxTextWidthAtYAxis() + gapRightAxisY, 0);

		return {
			left: gapLeftIfFirstNameIsNotIgnoreAndRotateAxisXIsTrue + gapLeftIfFirstNameIsNotIgnoreAndRotateAxisXIsFalse + axisYTitleHeight + axisYTitleGapRight + gapLeftIfAxisYPlaceIsLeft,
			right: gapRightIfLastNameIsNotIgnoreAndRotateXIsTrue + gapRightIfLastNameIsNotIgnoreAndRotateXIsFalse + gapRightIfAxisYPlaceIsRight,
			bottom: axisXTitleHeight + axisXTitleGapTop,
			top: ifTrueThenOrElse([showXText, axisXPlace === "top"], legendGapBottom + legendHeight + chartTitleGapBottom + chartTitleHeight, 0),
		};
	}

	/**
	 * Определяет отступы для легенды
	 * @param {IAxisY} axisY Содержит данные оси ординат
	 * @param {IChartTitleWithSizeAndPos} chartTitle Содержит данные заголовка диаграммы
	 * @returns {IGaps} Отступы
	 */
	public getGapsForLegend(axisY: IAxisY, chartTitle: IChartTitleWithSizeAndPos): IGaps {
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		// Заголовок оси ординат
		const { title: axisYTitle = {}, } = axisY;
		// Высота и отступы заголовка диаграммы
		const { height: chartTitleHeight = 0, gaps: chartTitleGaps, } = chartTitle;
		// Нижний отступ заголовка диаграммы
		const { bottom: chartTitleGapBottom = 0, } = chartTitleGaps;
		// Данные шрифта у заголовка оси ординат
		const { font: axisYFont = {}, gaps: axisYGaps = {}, } = axisYTitle as IAxisYTitle;
		// Размер, жирность и текст у заголовка оси ординат
		const { size = defaultSize, weight = defaultWeight, text, } = axisYFont as IFontWithText;
		// Высота заголовка оси ординат
		const titleAxisYHeight: number = getTextSize(size, weight, text, this.ctx, this.fontFamily).height || 0;

		return {
			top: chartTitleHeight + chartTitleGapBottom,
			left: titleAxisYHeight + axisYGaps.right || 0,
		};
	}
}

export default Chart;