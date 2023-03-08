import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";

class Chart {
  constructor(
    padding,
    data,
    ctx,
    width,
    height,
    title = {},
    type = "line",
    theme = {},
    hideGroups = []
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
    this.title = title;
    // Внутренние отступы диаграммы
    this.padding = padding;
    // Внутренний отступ по умолчанию
    this.defaultPadding = 10;
  }

  /**
   * Определяет границы диаграммы
   * @returns {object} Границы ({ width, height, horizontal: { start, end }, vertical: { start, end }, })
   */
  getBounds() {
    const bounds = {
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
   * @returns {Chart}
   */
  drawTitle() {
    if (!Object.keys(this.title).length) {
      return this;
    }

    const { weight = 600, size, text, color = this.theme.color, } = this.title.font;
    const font = { color, text, str: `${weight} ${size}px Arial, sans-serif`, };
    const sizes = getTextSize(size, weight, text, this.ctx);
    const bounds = this.getBounds();
    const startX = bounds.horizontal.start;
    const endX = bounds.horizontal.end - sizes.width;
    const posText = {
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
   * @param {AxisY} axisY Экземпляр класса AxisY
   * @param {AxisX} axisX Экземпляр класса AxisX
   * @param {object} chartTitle Содержит данные заголовка диаграммы
   * @param {object} legend Содержит данные легенды
   * @returns {object} Отступы ({ left, top, bottom })
   */
  getGapsForYPoints(axisY, axisX, chartTitle, legend) {
    const { size, weight = 400, } = axisY.font;
    const { gaps: gapsLegend = {}, totalHeight: legendHeight = 0, } = legend;
    const { showText: showXText = Boolean(Object.keys(axisX.font).length), } = axisX.font;
    const firstName = axisY.getAxesData(this.data).names[0];

    const firstNameHeight = getTextSize(size, weight, firstName, this.ctx).height;
    const legendGapBottom = (gapsLegend.legend || {}).bottom || 0;
    const axisYTitleHeight = (axisY.title || {}).height || 0;
    const axisYTitleGapRight = (axisY.title || {}).gapRight || 0;
    const chartTitleYPos = (chartTitle || {}).y || 0;
    const chartTitleGapBottom = (chartTitle || {}).gapBottom || 0;
    const axisXTitleHeight = (axisX.title || {}).height || 0;
    const axisXTitleGapTop = (axisX.title || {}).gapTop || 0;

    return {
      left: axisYTitleHeight + axisYTitleGapRight,
      top: chartTitleYPos + chartTitleGapBottom + legendHeight + legendGapBottom,
      bottom: (showXText ? axisY.distanceFromXAxisToGraph + firstNameHeight : 0) + axisXTitleHeight + axisXTitleGapTop,
    };
  }

  /**
   * Определяет отступы для оси абсцисс
   * @param {AxisY} axisY Экземпляр класса AxisY
   * @param {AxisX} axisX Экземпляр класса AxisX
   * @returns {object} Отступы ({ left, right, bottom })
   */
  getGapsForXPoints(axisY = {}, axisX = {}) {
    const { font: axisYFont = {}, title: axisYTitle = {}, distanceBetweenYAndChart, } = axisY;
    const { font: axisXFont = {}, title: axisXTitle = {}, } = axisX;
    const ignoreNames = axisX.getIgnoreNames();
    const names = axisY.getAxesData(this.data).names;
    const lastName = names[names.length - 1];
    const firstName = names[0];
    const { weight = 400, size, showText: showXText = Boolean(Object.keys(axisXFont).length), } = axisXFont;
    const { showText: showYText = Boolean(Object.keys(axisYFont).length), } = axisYFont;

    const firstNameWidth = getTextSize(size, weight, axisX.getCorrectName(firstName), this.ctx).width;
    const firstNameIsNotIgnore = showXText && !(ignoreNames || []).includes(firstName);
    const lastNameWidth = getTextSize(size, weight, axisX.getCorrectName(lastName), this.ctx).width;
    const lastNameIsNotIgnore = showXText && !(ignoreNames || []).includes(lastName);
    const axisYTitleHeight = axisYTitle.height || 0;
    const axisYTitleGapRight = axisYTitle.gapRight || 0;
    const axisXTitleHeight = axisXTitle.height || 0;
    const axisXTitleGapTop = axisXTitle.gapTop || 0;

    return {
      left: (firstNameIsNotIgnore ? firstNameWidth / 2 : 0) + axisYTitleHeight + axisYTitleGapRight + (showYText ? axisY.getMaxTextWidthAtYAxis() + distanceBetweenYAndChart : 0),
      right: lastNameIsNotIgnore ? lastNameWidth / 2 : 0,
      bottom: axisXTitleHeight + axisXTitleGapTop,
    };
  }

  /**
   * Определяет отступы для заголовка оси ординат
   * @param {object} chartTitle Содержит данные заголовка диаграммы
   * @param {object} legend Содержит данные легенды
   * @param {AxisX} axisX Экземпляр класса AxisX
   * @returns {object} Отступы ({ top, bottom })
   */
  getGapsForYTitle(chartTitle = {}, legend = {}, axisX = {}) {
    const { height: chartTitleHeight = 0, gapBottom: chartTitleGapBottom = 0, } = chartTitle;
    const { totalHeight: legendHeight, gaps: gapsLegend = {}, } = legend;
    const { title: axisXTitle = {}, } = axisX;
    const { font: axisXTitleFont = {}, gapTop = 0, } = axisXTitle;
    const { size, weight = 600, text, } = axisXTitleFont;
    const axisXTitleHeight = getTextSize(size, weight, text, this.ctx).height || 0;
    const legendGapBottom = (gapsLegend.legend || {}).bottom || 0;

    return {
      top: chartTitleHeight + legendGapBottom + chartTitleGapBottom + legendHeight,
      bottom: axisXTitleHeight + gapTop,
    };
  }

  /**
   * Определяет отступы для заголовка оси абсцисс
   * @param {AxisY} axisY Экземпляр класса AxisY
   * @returns {object} Отступы ({ top, left })
   */
  getGapsForXTitle(axisY = {}) {
    const { title = {}, distanceBetweenYAndChart, } = axisY;
    const { gapRight = 0, height = 0, } = title;

    return { left: height + gapRight + distanceBetweenYAndChart, };
  }

  /**
   * Определяет отступы для легенды
   * @param {AxisY} axisY Экземпляр класса AxisY
   * @param {object} chartTitle Содержит данные заголовка диаграммы
   * @returns {object} Отступы ({ top, left })
   */
  getGapsForLegend(axisY = {}, chartTitle = {}) {
    const { y = 0, gapBottom = 0, } = chartTitle;
    const { font = {}, } = (axisY.title || {});
    const { size, weight = 600, text, } = font;
    const titleAxisYHeight = getTextSize(size, weight, text, this.ctx).height || 0;

    return {
      top: y + gapBottom,
      left: titleAxisYHeight,
    };
  }
}

export default Chart;
