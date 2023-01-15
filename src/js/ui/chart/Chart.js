import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";

class Chart {
  constructor(
    data,
    ctx,
    width,
    height,
    title = {},
    type = "line",
    padding = {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    }
  ) {
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

    const font = { ...this.title.font, str: `600 ${this.title.font.size}px Arial, sans-serif`, };
    const sizes = new Text(font, this.ctx).getSizes();
    const bounds = this.getBounds();
    const posText = {
      x: bounds.horizontal.start + bounds.width / 2 - sizes.width / 2,
      y: bounds.vertical.start + sizes.height,
    };

    new Text(
      font,
      this.ctx,
      ...Object.values(posText)
    ).draw();

    this.title = {
      ...this.title,
      ...posText,
      ...sizes,
    };

    return this;
  }

  getGapsForYPoints(axisY, axisX, chartTitle, legendGroupItem, legend) {
    const { size, weight = 400, } = axisY.font;
    const { showText: showXText = Boolean(Object.keys(axisX.font).length), } = axisX.font;
    const firstName = axisY.getAxesData(this.data).names[0];
    const firstNameSizes = getTextSize(size, weight, firstName, this.ctx);

    return {
      left: ((axisY.title || {}).height || 0) + ((axisY.title || {}).gapRight || 0),
      top: ((chartTitle || {}).y || 0) + ((legendGroupItem || {}).height || 0) + ((legend || {}).gapBottom || 0),
      bottom: (showXText ? axisY.distanceFromXAxisToGraph + firstNameSizes.height : 0) + ((axisX.title || {}).height || 0) + (((axisX.title || {}).gapTop || 0)),
    };
  }

  getGapsForXPoints(axisY = {}, axisX = {}) {
    const { font: axisYFont = {}, title: axisYTitle = {}, distanceBetweenYAndChart, } = axisY;
    const { font: axisXFont = {}, title: axisXTitle = {}, } = axisX;

    const names = axisY.getAxesData(this.data).names;
    const lastName = names[names.length - 1];
    const firstName = names[0];
    const { weight = 400, size, showText: showXText = Boolean(Object.keys(axisXFont).length), } = axisXFont;
    const { showText: showYText = Boolean(Object.keys(axisYFont).length), } = axisYFont;
    const lastNameSizes = getTextSize(size, weight, axisX.getCorrectName(lastName), this.ctx);
    const firstNameSizes = getTextSize(size, weight, axisX.getCorrectName(firstName), this.ctx);
    const firstNameIsNotIgnore = (showXText && !(axisX.ignoreNames || []).includes(firstName));
    const lastNameIsNotIgnore = (showXText && !(axisX.ignoreNames || []).includes(lastName));

    return {
      left: (firstNameIsNotIgnore ? firstNameSizes.width / 2 : 0) + (axisYTitle.height || 0) + (axisYTitle.gapRight || 0) + (showYText ? axisY.getMaxTextWidthAtYAxis() + distanceBetweenYAndChart : 0),
      right: lastNameIsNotIgnore ? lastNameSizes.width / 2 : 0,
      bottom: (axisXTitle.height || 0) + ((axisXTitle.gapTop || 0)),
    };
  }

  getGapsForYTitle(chartTitle = {}, legend = {}, axisX = {}) {
    const { height: chartTitleHeight = 0, gapBottom: chartTitleGapBottom = 0, } = chartTitle;
    const { groupsData, gapBottom: legendGapBottom = 0, } = legend;
    const { title: axisXTitle = {}, } = axisX;
    const { font: axisXTitleFont = {}, gapTop = 0, } = axisXTitle;
    const { size, weight = 600, text, } = axisXTitleFont;
    const axisXTitleHeight = getTextSize(size, weight, text, this.ctx).height || 0;

    return {
      top: chartTitleHeight + legendGapBottom + chartTitleGapBottom + ((groupsData[0] || {}).height || 0),
      bottom: axisXTitleHeight + gapTop,
    };
  }

  getGapsForXTitle(axisY = {}) {
    const { title = {}, distanceBetweenYAndChart, } = axisY;

    return { left: (title.height || 0) + (title.gapRight || 0) + distanceBetweenYAndChart, };
  }

  getGapsForLegend(axisY = {}, chartTitle = {}) {
    const { y = 0, gapBottom = 0, } = chartTitle;
    const { font = {}, gapRight = 0, } = (axisY.title || {});
    const { size, weight = 600, text, } = font;
    const titleAxisYHeight = getTextSize(size, weight, text, this.ctx).height || 0;

    return {
      top: y + gapBottom,
      left: titleAxisYHeight + gapRight,
    };
  }
}

export default Chart;