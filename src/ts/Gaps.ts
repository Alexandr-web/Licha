import defaultParams from "./helpers/defaultParams";
import getCorrectName from "./helpers/getCorrectName";
import getMaxSizePoint from "./helpers/getMaxSizePoint";
import getTextSize from "./helpers/getTextSize";
import ifTrueThenOrElse from "./helpers/ifTrueThenOrElse";

import { IAxisX, IAxisXClass, IAxisXTitle, IAxisXTitleData, } from "./interfaces/axisX";
import { IAxisYClass, IAxisYTitleData, } from "./interfaces/axisY";
import { IChartClass, IChartTitleData, } from "./interfaces/chart";
import { IData, } from "./interfaces/data";
import { IGapsClass, } from "./interfaces/gaps";
import { IGaps, } from "./interfaces/global";
import { ILegendClass, ILegendData, ILegendGaps, } from "./interfaces/legend";
import { IFontWithText, } from "./interfaces/text";

class Gaps implements IGapsClass {
    public readonly data: IData;
    public readonly fontFamily: string;
    public readonly ctx: CanvasRenderingContext2D;

    constructor(
        data: IData,
        ctx: CanvasRenderingContext2D,
        fontFamily: string
    ) {
        // Содержит данные групп
        this.data = data;
        // Семейство шрифтов
        this.fontFamily = fontFamily;
        // Контекст элемента canvas
        this.ctx = ctx;
    }

    /**
     * Определяет отступы для оси ординат
     * @param {IAxisYClass} axisY Экземпляр класса AxisY
     * @param {IAxisXClass} axisX Экземпляр класса AxisX
     * @param {IChartTitleData} chartTitle Содержит данные заголовка диаграммы
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
        const { showText: showXText = true, } = axisXFont;

        // Максимальная ширина точки оси абсцисс
        const { width: maxWidthPointX, height: maxHeightPointX, } = getMaxSizePoint(axisXFont, axisX.getAxesData(this.data).names, this.ctx, this.fontFamily, getCorrectName.bind(axisX));
        // Нижний отступ у легенды
        const legendGapBottom: number = legendGaps.bottom || 0;
        // Отступ справа у заголовка оси ординат
        const axisYTitleGapRight: number = axisYTitleDataGaps.right || 0;
        // Нижний отступ у заголовка диаграммы
        const chartTitleGapBottom: number = chartTitleGaps.bottom || 0;
        // Верхний отступ у заголовка оси абсцисс
        const axisXTitleGapTop: number = axisXTitleDataGaps.top || 0;
        // Отступ снизу, если правило rotate у axisX правдиво
        const gapBottomIfRotateX: number = ifTrueThenOrElse(axisX.rotate, maxWidthPointX, maxHeightPointX);
        // Отступ сверху, если позиция у оси абсцисс сверху и правило rotate у axisX правдиво
        const gapTopIfAxisXPlaceIsTopAndRotate: number = ifTrueThenOrElse([showXText, axisX.rotate, placeAxisX === "top"], maxWidthPointX + axisX.gapTopAxisX, 0);
        // Отступ сверху, если позиция у оси абсцисс сверху и правило rotate у axisX ложно
        const gapTopIfAxisXPlaceIsTop: number = ifTrueThenOrElse([showXText, !axisX.rotate, placeAxisX === "top"], maxHeightPointX + axisX.gapTopAxisX, 0);

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
        // Значения по умолчанию
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
        const { weight = defaultWeight, size = defaultSize, showText: showXText = true, } = axisXFont;
        // Правило, при котором элементы оси ординат будут отображаться на диаграмме
        const { showText: showYText = true, } = axisYFont;
        // Названия, которые не будут отображаться на диаграмме
        const ignoreNames: Array<string | number> = axisX.getIgnoreNames();
        // Все названия
        const names: Array<string | number> = axisY.getAxesData(this.data).names;
        // Последнее название
        const lastName: string | number = names[names.length - 1];
        // Первое название
        const firstName: string | number = names[0];

        // Ширина и высота первого названия
        const { width: firstNameWidth, height: firstNameHeight, } = getTextSize(size, weight, getCorrectName.call(axisX, firstName).toString(), this.ctx, this.fontFamily);
        // Отображено ли первое название
        const firstNameIsNotIgnore: boolean = showXText && !(ignoreNames || []).includes(firstName);
        // Ширина и высота последнего названия
        const { width: lastNameWidth, height: lastNameHeight, } = getTextSize(size, weight, getCorrectName.call(axisX, lastName).toString(), this.ctx, this.fontFamily);
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
        // Максимальная ширина значения точки
        const axisYPointWidth: number = axisY.getMaxTextWidthAtYAxis();
        // Отступ слева, если ось ординат находится слева
        const gapLeftIfAxisYPlaceIsLeft: number = ifTrueThenOrElse([showYText, axisYPlace === "left"], axisYPointWidth + gapRightAxisY, 0);
        // Отступ слева, если ось ординат находится справа
        const gapRightIfAxisYPlaceIsRight: number = ifTrueThenOrElse([axisYPlace === "right", showYText], axisYPointWidth + gapRightAxisY, 0);

        return {
            left: gapLeftIfFirstNameIsNotIgnoreAndRotateAxisXIsTrue + gapLeftIfFirstNameIsNotIgnoreAndRotateAxisXIsFalse + axisYTitleHeight + axisYTitleGapRight + gapLeftIfAxisYPlaceIsLeft,
            right: gapRightIfLastNameIsNotIgnoreAndRotateXIsTrue + gapRightIfLastNameIsNotIgnoreAndRotateXIsFalse + gapRightIfAxisYPlaceIsRight,
            bottom: axisXTitleHeight + axisXTitleGapTop,
            top: ifTrueThenOrElse([showXText, axisXPlace === "top"], legendGapBottom + legendHeight + chartTitleGapBottom + chartTitleHeight, 0),
        };
    }

    /**
     * Определяет отступы для легенды
     * @param {IChartTitleData} chartTitle Содержит данные заголовка диаграммы
     * @returns {IGaps} Отступы
     */
    public getGapsForLegend(chartTitle: IChartTitleData): IGaps {
        // Высота и отступы заголовка диаграммы
        const { height: chartTitleHeight = 0, gaps: chartTitleGaps, } = chartTitle;
        // Нижний отступ заголовка диаграммы
        const { bottom: chartTitleGapBottom = 0, } = chartTitleGaps;

        return { top: chartTitleHeight + chartTitleGapBottom, };
    }

    /**
     * Определяет отступы заголовку оси ординат
     * @param {IChartTitleData} chartTitle Содержит данные заголовка диаграммы
     * @param {ILegendClass} legend Экземпляр класса Legend
     * @param {IAxisX} axisX Содержит данные оси абсцисс
     * @param {Array<string | number>} names Содержит массив названий точек
     * @returns {IGaps}
     */
    public getGapsForAxisYTitle(chartTitle: IChartTitleData, legend: ILegendClass, axisX: IAxisX, names: Array<string | number>): IGaps {
        // Значения по умолчанию
        const { size: defaultTitleSize, weight: defaultTitleWeight, } = defaultParams.titleFont;
        // Высота и отступы легенды
        const { height: legendHeight, legendGaps = {}, } = legend;
        // Отступы легенды
        const { legend: gapsLegend = {}, } = legendGaps;
        // Высота и отступы заголовка диаграммы
        const { height: chartTitleHeight, gaps: chartTitleGaps = {}, } = chartTitle;
        // Заголовок и данные шрифта оси абсцисс
        const { title: axisXTitle = {}, font: axisXFont = {}, rotate: rotateAxisX, place: axisXPlace = defaultParams.axisX.place, } = axisX;
        // Правило, которое говорит, что текст на оси абсцисс будет отображен
        const { showText: showTextAxisX = true, } = axisXFont;
        // Данные шрифта и отступы заголовка оси абсцисс
        const { font: axisXTitleFont = {}, gaps: axisXTitleGaps = {}, } = axisXTitle as IAxisXTitle;
        // Размер, жирность и текст заголовка оси абсцисс
        const { size: axisXTitleSize = defaultTitleSize, weight: axisXTitleWeight = defaultTitleWeight, text, } = axisXTitleFont as IFontWithText;
        // Высота заголовка оси абсцисс
        const axisXTitleHeight: number = getTextSize(axisXTitleSize, axisXTitleWeight, text, this.ctx, this.fontFamily).height;
        // Максимальная высота и ширина точки оси абсцисс
        const { width: maxWidthPointX, height: maxHeightPointX, } = getMaxSizePoint(axisXFont, names, this.ctx, this.fontFamily, getCorrectName.bind(axisX));
        // Сработает отступ, если правило rotate будет ложным
        const gapIfRotateIsFalse: number = ifTrueThenOrElse([showTextAxisX, !rotateAxisX], defaultParams.gapTopAxisX + maxHeightPointX, 0);
        // Сработает отступ, если правило rotate будет правдивым
        const gapIfRotateIsTrue: number = ifTrueThenOrElse([showTextAxisX, rotateAxisX], defaultParams.gapTopAxisX + maxWidthPointX, 0);
        // Сработает нижний отступ, если заголовок оси абсцисс существует
        const gapBottomIfAxisXTitleExist: number = ifTrueThenOrElse("text" in axisXTitleFont, axisXTitleHeight + axisXTitleGaps.top || 0, 0);
        const gapBottomIfAxisXPlaceIsBottom: number = ifTrueThenOrElse([showTextAxisX, axisXPlace === "bottom"], gapIfRotateIsFalse + gapIfRotateIsTrue, 0);
        const gapBottomIfAxisXPlaceIsTop: number = ifTrueThenOrElse([showTextAxisX, axisXPlace === "top"], gapIfRotateIsFalse + gapIfRotateIsTrue, 0);

        return {
            top: gapBottomIfAxisXPlaceIsTop + legendHeight + chartTitleHeight + (gapsLegend.bottom || 0) + (chartTitleGaps.bottom || 0),
            bottom: gapBottomIfAxisXPlaceIsBottom + gapBottomIfAxisXTitleExist,
        };
    }
}

export default Gaps;