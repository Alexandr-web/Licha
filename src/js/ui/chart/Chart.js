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
    theme = {}
  ) {
    this.theme = theme;
    this.data = data;
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    // Тип диаграммы
    this.type = type;
    // Заголовок диаграммы
    this.title = title;
    // Внутренние отступы диаграммы
    this.padding = padding;
  }

  getBounds() {
    const bounds = {
      width: null,
      height: null,
      horizontal: {
        start: this.padding.left,
        end: this.width - this.padding.right,
      },
      vertical: {
        start: this.padding.top,
        end: this.height - this.padding.bottom,
      },
    };

    bounds.width = bounds.horizontal.end - bounds.horizontal.start;
    bounds.height = bounds.vertical.end - bounds.vertical.start;

    return bounds;
  }

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

  getGapsForXTitle(axisY = {}) {
    const { title = {}, distanceBetweenYAndChart, } = axisY;
    const { gapRight = 0, height = 0, } = title;

    return { left: height + gapRight + distanceBetweenYAndChart, };
  }

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
