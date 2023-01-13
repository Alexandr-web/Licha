import Text from "./elements/Text";
import Circle from "./elements/Circle";
import getTextSize from "../helpers/getTextSize";

class Legend {
  constructor(showLegend, data, line, ctx, bounds, font) {
    this.showLegend = showLegend;
    this.line = line;
    this.font = font;
    this.data = data;
    this.ctx = ctx;
    this.bounds = bounds;
    this.groupsData = [];
    this.radiusCircle = 4;
    this.margin = {
      text: 20,
      circle: 0,
    };
  }

  _getUpdateGroups(groups) {
    const { size, weight, } = this.font;

    return groups.map((groupItem) => {
      const sizes = getTextSize(size, weight, groupItem.group, this.ctx);

      return {
        ...sizes,
        ...groupItem,
      };
    });
  }

  _getDistanceFromPrevGroups(prevGroups) {
    return prevGroups.reduce((acc, { width, }) => {
      acc += width + this.radiusCircle + this.margin.text + this.radiusCircle * 2;

      return acc;
    }, 0);
  }

  draw(gaps) {
    if (!this.showLegend) {
      return;
    }

    const groups = [];

    for (const group in this.data) {
      const groupLineColor = ((this.data[group].line || {}).color || (this.line || {}).fill || (this.data[group].line || {}).fill || (this.line || {}).fill);

      groups.push({
        group,
        color: groupLineColor,
      });
    }

    const bounds = this.bounds;
    const updateGroups = this._getUpdateGroups(groups);
    const { size, weight = 400, color, } = this.font;

    this.groupsData = updateGroups.map(({ group, color: colorCap, height, width, }, index) => {
      const font = {
        size,
        color,
        str: `${weight} ${size}px Arial, sans-serif`,
        text: group,
      };
      const prevGroups = updateGroups.filter((grp, idx) => idx < index);
      const posCircle = {
        x: bounds.horizontal.start + (gaps.left || 0) + (prevGroups.length ? this._getDistanceFromPrevGroups(prevGroups) : 0),
        y: bounds.vertical.start + (gaps.top || 0) - height / 2,
      };
      const posGroup = {
        x: posCircle.x + this.margin.circle + this.radiusCircle * 2,
        y: bounds.vertical.start + (gaps.top || 0),
      };

      new Circle(
        this.radiusCircle,
        ...Object.values(posCircle),
        colorCap,
        this.ctx,
        1,
        posCircle.y - this.radiusCircle,
        posCircle.y + this.radiusCircle
      ).draw();

      new Text(
        font,
        this.ctx,
        ...Object.values(posGroup)
      ).draw();

      return { ...posGroup, height, width, };
    });

    return this;
  }
}

export default Legend;