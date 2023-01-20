import Element from "./Element";
import getTextSize from "../../helpers/getTextSize";
import Rect from "./Rect";
import Text from "./Text";
import quickSort from "../../helpers/quickSort";
import Line from "./Line";

class BlockInfo extends Element {
  constructor(elements, titleData, groupsData, x, y, color, padding, ctx) {
    super(x, y, color, ctx);

    this.elements = elements;
    this.padding = padding;
    this.titleData = titleData;
    this.groupsData = groupsData;
    this.groupLineWidth = 2;
    this.title = elements[0].name;
  }

  _getElementsWithSize() {
    return this.elements.map(({ group, value, color, }) => {
      const groupName = `${group}: ${value}`;
      const { font: groupsFont, } = this.groupsData;
      const { font: titleFont, } = this.titleData;

      return {
        group: {
          name: groupName,
          color,
          ...getTextSize(groupsFont.size, groupsFont.weight, groupName, this.ctx),
        },
        value: {
          name: value,
          ...getTextSize(titleFont.size, titleFont.weight, value, this.ctx),
        },
      };
    });
  }

  _getTopGroupsDistance(groups) {
    const { gaps, } = this.groupsData;

    return groups.reduce((acc, { height, }) => {
      acc += height + gaps.bottom;

      return acc;
    }, 0);
  }

  _drawLines() {
    const padding = this.padding;

    for (let i = 0; i < this.elements.length; i++) {
      const { group, } = this._getElementsWithSize()[i];
      const groupPos = this._getGroupsCoordinates(i);
      const x = this.x + this._getWindowSize().width - padding.right;
      const linePos = {
        moveTo: {
          x,
          y: groupPos.y,
        },
        lineTo: [
          {
            x,
            y: groupPos.y - group.height,
          }
        ],
      };

      new Line(
        ...Object.values(linePos.moveTo),
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

  _drawTitle() {
    const padding = this.padding;
    const { font: titleFont, } = this.titleData;
    const { size, color, weight, } = titleFont;
    const font = {
      color,
      text: this.title,
      str: `${weight} ${size}px Arial, sans-serif`,
    };

    new Text(
      font,
      this.ctx,
      this.x + padding.left,
      this.y + padding.top + this._getTitleSize().height
    ).draw();
  }

  _getGroupsCoordinates(index) {
    const { gaps, } = this.titleData;
    const padding = this.padding;
    const prevGroups = this._getElementsWithSize().filter((element, idx) => idx < index);
    const top = this._getTopGroupsDistance(prevGroups.map(({ group: g, }) => g));

    return {
      x: this.x + padding.left,
      y: this.y + this._getTitleSize().height + padding.top + top + gaps.bottom,
    };
  }

  _drawGroups() {
    const { font: groupsFont, } = this.groupsData;
    const { size, weight, color, } = groupsFont;

    this._getElementsWithSize().map(({ group, }, index) => {
      const font = {
        text: group.name,
        color,
        str: `${weight} ${size}px Arial, sans-serif`,
      };

      new Text(
        font,
        this.ctx,
        ...Object.values(this._getGroupsCoordinates(index))
      ).draw();
    });
  }

  _getMaxContentWidth(elements) {
    const maxGroupWidth = quickSort(elements.map(({ group, }) => group), "width").reverse()[0].width;
    const titleWidth = this._getTitleSize().width;

    return Math.max(maxGroupWidth, titleWidth);
  }

  _getWindowSize() {
    const padding = this.padding;
    const { gaps, } = this.groupsData;
    const groups = this._getElementsWithSize().map(({ group, }) => group);
    const width = this._getMaxContentWidth(this._getElementsWithSize()) + padding.right + padding.left + gaps.right;
    const height = this._getTitleSize().height + this._getTopGroupsDistance(groups) + padding.bottom + padding.top;

    return { width, height, };
  }

  _drawWindow(width, height) {
    new Rect(
      this.x,
      this.y,
      this.color,
      this.ctx,
      width,
      height,
      this.y,
      this.y + height
    ).draw();
  }

  init() {
    this._drawWindow(...Object.values(this._getWindowSize()));
    this._drawTitle();
    this._drawGroups();
    this._drawLines();
  }
}

export default BlockInfo;