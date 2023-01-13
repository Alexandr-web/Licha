import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";

class Chart {
  constructor(
    data,
    ctx,
    width,
    height,
    title = {},
    align = "center",
    type = "line",
    padding = {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    }
  ) {
    this.align = align;
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
      x: null,
      y: bounds.vertical.start + sizes.height,
    };

    switch (this.align) {
      case "left":
        posText.x = bounds.horizontal.start;
        break;
      case "center":
        posText.x = bounds.horizontal.start + bounds.width / 2 - sizes.width / 2;
        break;
      case "right":
        posText.x = bounds.horizontal.end - sizes.width;
        break;
    }

    new Text(
      font,
      this.ctx,
      ...Object.values(posText),
      undefined,
      0,
      1
    ).draw();

    this.title = {
      ...this.title,
      ...posText,
      ...sizes,
    };

    return this;
  }

  getGapsForYPoints(axisY, axisX, chartTitle, legendGroupItem, legend) {
    const { size, weight = 400, showText, } = axisY.font;
    const firstName = axisY.getAxesData(this.data).names[0];
    const firstNameSizes = getTextSize(size, weight, firstName, this.ctx);
    const showTxt = showText !== undefined ? showText : Boolean(Object.keys(axisY.font).length);

    return {
      left: ((axisY.title || {}).height || 0) + ((axisY.title || {}).gapRight || 0),
      top: ((chartTitle || {}).y || 0) + ((legendGroupItem || {}).height || 0) + ((legend || {}).gapBottom || 0),
      bottom: (showTxt ? axisY.distanceFromXAxisToGraph + firstNameSizes.height : 0) + ((axisX.title || {}).height || 0) + (((axisX.title || {}).gapTop || 0)),
    };
  }

  getGapsForXPoints(axisY, axisX) {
    const names = axisY.getAxesData(this.data).names;
    const lastName = names[names.length - 1];
    const firstName = names[0];
    const { weight = 400, size, showText, } = axisX.font;
    const lastNameSizes = getTextSize(size, weight, lastName, this.ctx);
    const firstNameSizes = getTextSize(size, weight, firstName, this.ctx);
    const showTxt = showText !== undefined ? showText : Boolean(Object.keys(axisX.font).length);
    const firstNameIsNotIgnore = (showTxt && !(axisX.ignoreNames || []).includes(firstName));
    const lastNameIsNotIgnore = (showTxt && !(axisX.ignoreNames || []).includes(lastName));

    return {
      left: (firstNameIsNotIgnore ? firstNameSizes.width / 2 : 0) + (showTxt ? axisY.getMaxTextWidthAtYAxis() + axisY.distanceBetweenYAndChart + ((axisY.title || {}).height || 0) + ((axisY.title || {}).gapRight || 0) : 0),
      right: lastNameIsNotIgnore ? lastNameSizes.width / 2 : 0,
      bottom: ((axisX.title || {}).height || 0) + (((axisX.title || {}).gapTop || 0)),
    };
  }
}

export default Chart;