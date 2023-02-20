import Element from "./Element";
import getTextSize from "../../helpers/getTextSize";
import Rect from "./Rect";
import Text from "./Text";
import quickSort from "../../helpers/quickSort";
import Line from "./Line";
import CustomFigure from "./CustomFigure";
import getStyleByIndex from "../../helpers/getStyleByIndex";

class BlockInfo extends Element {
  constructor(
    data,
    bounds,
    elements,
    titleData,
    groupsData,
    x,
    y,
    color,
    padding,
    ctx,
    themeForWindow = {},
    themeForLine = {},
    themeForTitle = {},
    themeForGroup = {}
  ) {
    super(x, y, color, ctx);

    this.data = data;
    this.bounds = bounds;
    this.elements = elements;
    this.padding = padding;
    this.titleData = titleData;
    this.groupsData = groupsData;
    this.groupLineWidth = 5;
    this.triangleHeight = 10;
    this.title = elements[0].name;
    this.themeForWindow = themeForWindow;
    this.themeForLine = themeForLine;
    this.themeForTitle = themeForTitle;
    this.themeForGroup = themeForGroup;
  }

  _getElementsWithSize() {
    return this.elements.map(({ group, value, color, }) => {
      const groupName = `${group}: ${value}`;
      const { font: groupsFont, } = this.groupsData;
      const { font: titleFont, } = this.titleData;
      const dataKeys = Object.keys(this.data);
      const idx = dataKeys.indexOf(group);
      const themeColor = getStyleByIndex(idx, dataKeys.length, this.themeForLine.color);

      return {
        group: {
          name: groupName,
          color: color || themeColor,
          ...getTextSize(groupsFont.size, groupsFont.weight, groupName, this.ctx),
        },
        value: {
          name: value,
          ...getTextSize(titleFont.size, titleFont.weight, value, this.ctx),
        },
      };
    });
  }

  _getCoordinates() {
    return {
      x: this.x + this.triangleHeight,
      y: this.y,
    };
  }

  _getTopGroupsDistance(groups) {
    const { gaps, } = this.groupsData;

    return groups.reduce((acc, { height, }) => {
      acc += height + gaps.bottom;

      return acc;
    }, 0);
  }

  _drawLines(windowIsOutOfBounds, blockWidth) {
    const padding = this.padding;
    const { x, } = this._getCoordinates();

    for (let i = 0; i < this.elements.length; i++) {
      const { group, } = this._getElementsWithSize()[i];
      const groupPos = this._getGroupsCoordinates(i);
      const posX = x + blockWidth - (padding.right || 0);
      const linePos = {
        moveTo: {
          x: posX,
          y: groupPos.y,
        },
        lineTo: [
          {
            x: posX,
            y: groupPos.y - group.height,
          }
        ],
      };

      if (this._outOfBounds(blockWidth)) {
        Object.assign(linePos, {
          moveTo: {
            x: posX - (blockWidth + this.triangleHeight * 2),
            y: groupPos.y,
          },
          lineTo: [
            {
              x: posX - (blockWidth + this.triangleHeight * 2),
              y: groupPos.y - group.height,
            }
          ],
        });
      }

      new Line(
        linePos.moveTo.x,
        linePos.moveTo.y,
        group.color,
        this.ctx,
        linePos.lineTo,
        this.groupLineWidth
      ).draw();
    }
  }

  _getTitleSize() {
    const { font, } = this.titleData;
    const { size, weight, } = font;

    return getTextSize(size, weight, this.title, this.ctx);
  }

  _drawTitle(windowIsOutOfBounds, blockWidth) {
    const padding = this.padding;
    const { x, y, } = this._getCoordinates();
    const coordinates = {
      x: x + (padding.left || 0),
      y: y + (padding.top || 0) + this._getTitleSize().height,
    };

    if (windowIsOutOfBounds) {
      coordinates.x -= blockWidth + this.triangleHeight * 2;
    }

    const { font: titleFont, } = this.titleData;
    const { size, color = this.themeForTitle.color, weight, } = titleFont;
    const font = {
      color,
      text: this.title,
      str: `${weight} ${size}px Arial, sans-serif`,
    };

    new Text(
      font,
      this.ctx,
      coordinates.x,
      coordinates.y
    ).draw();
  }

  _getGroupsCoordinates(index) {
    const { x, y, } = this._getCoordinates();
    const { gaps = {}, } = this.titleData;
    const padding = this.padding;
    const prevGroups = this._getElementsWithSize().filter((element, idx) => idx <= index);
    const top = this._getTopGroupsDistance(prevGroups.map(({ group: g, }) => g));
    
    return {
      x: x + (padding.left || 0),
      y: y + top + this._getTitleSize().height + (gaps.bottom || 0),
    };
  }

  _drawGroups(windowIsOutOfBounds, blockWidth) {
    const { font: groupsFont, } = this.groupsData;
    const { size, weight, color = this.themeForGroup.color, } = groupsFont;

    this._getElementsWithSize().map(({ group, }, index) => {
      const font = {
        text: group.name,
        color,
        str: `${weight} ${size}px Arial, sans-serif`,
      };
      const coordinates = this._getGroupsCoordinates(index);

      if (windowIsOutOfBounds) {
        coordinates.x -= blockWidth + this.triangleHeight * 2;
      }

      new Text(
        font,
        this.ctx,
        coordinates.x,
        coordinates.y
      ).draw();
    });
  }

  _getMaxContentWidth(elements) {
    const maxGroupWidth = quickSort(elements.map(({ group, }) => group), "width").reverse()[0].width;
    const titleWidth = this._getTitleSize().width;

    return Math.max(maxGroupWidth, titleWidth);
  }

  _outOfBounds(blockWidth) {
    return this._getCoordinates().x + blockWidth > this.bounds.width;
  }

  _getWindowSize() {
    const padding = this.padding;
    const { gaps: gapsGroups, } = this.groupsData;
    const { gaps: gapsTitle, } = this.titleData;
    const groups = this._getElementsWithSize().map(({ group, }) => group);
    const width = this._getMaxContentWidth(this._getElementsWithSize()) + (padding.right || 0) + (padding.left || 0) + (gapsGroups.right || 0) + this.groupLineWidth;
    const height = this._getTitleSize().height + this._getTopGroupsDistance(groups) + (gapsTitle.bottom || 0) + (padding.bottom || 0);

    return { width, height, };
  }

  _drawTriangle(windowIsOutOfBounds) {
    const { x, y, } = this._getCoordinates();
    const triangleData = {
      x,
      y,
      lineTo: [
        { x: x - this.triangleHeight, y: y + this.triangleHeight / 2, },
        { x, y: y + this.triangleHeight, }
      ],
      startY: y,
      endY: y + this.triangleHeight,
    };

    if (windowIsOutOfBounds) {
      Object.assign(triangleData, {
        ...triangleData,
        x: x - this.triangleHeight * 2,
        y,
        lineTo: [
          { x: x - this.triangleHeight, y: y + this.triangleHeight / 2, },
          { x: x - this.triangleHeight * 2, y: y + this.triangleHeight, }
        ],
      });
    }

    new CustomFigure(
      triangleData.x,
      triangleData.y,
      this.color || this.themeForWindow.color,
      this.ctx,
      triangleData.lineTo,
      triangleData.startY,
      triangleData.endY
    ).draw();
  }

  _drawWindow(windowIsOutOfBounds, width, height) {
    const coordinates = this._getCoordinates();

    if (windowIsOutOfBounds) {
      coordinates.x -= (width + this.triangleHeight * 2);
    }

    new Rect(
      coordinates.x,
      coordinates.y,
      this.color || this.themeForWindow.color,
      this.ctx,
      width,
      height,
      coordinates.y,
      coordinates.y + height
    ).draw();
  }

  init() {
    const windowIsOutOfBounds = this._outOfBounds(this._getWindowSize().width);
    const { width, height, } = this._getWindowSize();

    this._drawWindow(windowIsOutOfBounds, width, height);
    this._drawTriangle(windowIsOutOfBounds);
    this._drawTitle(windowIsOutOfBounds, width);
    this._drawGroups(windowIsOutOfBounds, width);
    this._drawLines(windowIsOutOfBounds, width);
  }
}

export default BlockInfo;