import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";

import "../../interfaces/index";
import { TTypeChart, } from "../../types/index";

class Chart implements IChartClass {
  public padding: IPadding;
  public data: IData;
  public ctx: CanvasRenderingContext2D;
  public width: number;
  public height: number;
  public title: IChartTitle;
  public type: TTypeChart;
  public defaultPadding: number;
  public hideGroups: Array<string>;
  public theme: ITitleTheme;

  constructor(
    padding,
    data,
    ctx,
    width,
    height,
    type,
    title = {},
    theme = {},
    hideGroups = []
  ) {
    // Содержит скрытые группы
    this.hideGroups = hideGroups as any;
    // Содержит стили от темы
    this.theme = theme as any;
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
    this.title = title as any;
    // Внутренние отступы диаграммы
    this.padding = padding;
    // Внутренний отступ по умолчанию
    this.defaultPadding = 10;
  }

  /**
   * Определяет границы диаграммы
   * @returns {IBounds} Границы ({ width, height, horizontal: { start, end }, vertical: { start, end }, })
   */
  public getBounds(): IBounds {
    const bounds: IBounds = {
      width: null,
      height: null,
      horizontal: {
        start: this.padding.left || this.defaultPadding,
        end: this.width - (this.padding.right || this.defaultPadding),
      },
      vertical: {
        start: this.padding.top || this.defaultPadding,
        end: this.height - (this.padding.bottom || this.defaultPadding),
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
    const font: ISpecialFontData = { color, text, str: `${weight} ${size}px Arial, sans-serif`, };
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

    this.title = {
      ...this.title,
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
   * @returns {IGapsForYPoints} Отступы ({ left, top, bottom })
   */
  public getGapsForYPoints(axisY: IAxisYClass, axisX: IAxisXClass, chartTitle: IChartTitle, legend: ILegendData): IGapsForYPoints {
    const { size, weight = 400, } = axisY.font;
    const { gaps: gapsLegend = {}, totalHeight: legendHeight = 0, } = legend as any;
    const { showText: showXText = Boolean(Object.keys(axisX.font).length), } = axisX.font;
    const firstName: string | number = axisY.getAxesData(this.data).names[0];

    const firstNameHeight: number = getTextSize(size, weight, firstName.toString(), this.ctx).height;
    const legendGapBottom: number = (gapsLegend.legend || {}).bottom || 0;
    const axisYTitleHeight: number = ((axisY.title || {}) as any).height || 0;
    const axisYTitleGapRight: number = ((axisY.title || {}) as any).gapRight || 0;
    const chartTitleYPos: number = ((chartTitle || {}) as any).y || 0;
    const chartTitleGapBottom: number = (chartTitle || {}).gapBottom || 0;
    const axisXTitleHeight: number = ((axisX.title || {}) as any).height || 0;
    const axisXTitleGapTop: number = ((axisX.title || {}) as any).gapTop || 0;

    return {
      left: axisYTitleHeight + axisYTitleGapRight,
      top: chartTitleYPos + chartTitleGapBottom + legendHeight + legendGapBottom,
      bottom: (showXText ? axisY.gapTopAxisX + firstNameHeight : 0) + axisXTitleHeight + axisXTitleGapTop,
    };
  }

  /**
   * Определяет отступы для оси абсцисс
   * @param {IAxisYClass} axisY Экземпляр класса AxisY
   * @param {IAxisXClass} axisX Экземпляр класса AxisX
   * @returns {IGapsForXPoints} Отступы ({ left, right, bottom })
   */
  public getGapsForXPoints(axisY: IAxisYClass, axisX: IAxisXClass): IGapsForXPoints {
    const { font: axisYFont = {}, title: axisYTitle = {}, gapRightAxisY, } = axisY as any;
    const { font: axisXFont = {}, title: axisXTitle = {}, } = axisX as any;
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
   * @param {ILegendDataGaps} legend Содержит данные легенды
   * @param {IAxisX} axisX Содержит данные оси абсцисс
   * @returns {IGapsForYTitle} Отступы ({ top, bottom })
   */
  public getGapsForYTitle(chartTitle: IChartTitleWithSizeAndPos, legend: ILegendDataGaps, axisX: IAxisX): IGapsForYTitle {
    const { height: chartTitleHeight = 0, gapBottom: chartTitleGapBottom = 0, } = chartTitle;
    const { totalHeight: legendHeight, gaps: gapsLegend = {}, } = legend as any;
    const { title: axisXTitle = {}, } = axisX as any;
    const { font: axisXTitleFont = {}, gapTop = 0, } = axisXTitle;
    const { size, weight = 600, text, } = axisXTitleFont;
    const axisXTitleHeight: number = getTextSize(size, weight, text, this.ctx).height || 0;
    const legendGapBottom: number = (gapsLegend.legend || {}).bottom || 0;

    return {
      top: chartTitleHeight + legendGapBottom + chartTitleGapBottom + legendHeight,
      bottom: axisXTitleHeight + gapTop,
    };
  }

  /**
   * Определяет отступы для заголовка оси абсцисс
   * @param {IAxisYClass} axisY Экземпляр класса AxisY
   * @returns {IGapsForXTitle} Отступы ({ top, left })
   */
  public getGapsForXTitle(axisY: IAxisYClass): IGapsForXTitle {
    const { title = {}, gapRightAxisY, } = axisY as any;
    const { gapRight = 0, height = 0, } = title;

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
