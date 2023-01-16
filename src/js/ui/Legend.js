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
    this.radiusCircle = 6;
    this.margin = {
      group: 10,
      circle: 10,
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

  _getDistanceGroups(groups) {
    if (!groups.length) {
      return 0;
    }

    return groups.reduce((acc, { width, }) => {
      acc += width + this.margin.group + this.radiusCircle * 2 + this.margin.circle;

      return acc;
    }, 0);
  }

  _getGroups() {
    const groups = [];

    for (const group in this.data) {
      const groupLineColor = ((this.data[group].line || {}).color || (this.line || {}).fill || (this.data[group].line || {}).fill || (this.line || {}).fill);

      groups.push({
        group,
        color: groupLineColor,
      });
    }

    return groups;
  }

  _drawText(group, height, groups, index, gaps) {
    const bounds = this.bounds;
    const center = bounds.width / 2;
    const totalGroupsDistance = this._getDistanceGroups(groups);
    const { size, weight = 400, color, } = this.font;
    const font = {
      size,
      color,
      str: `${weight} ${size}px Arial, sans-serif`,
      text: group,
    };

    const prevGroups = groups.filter((grp, idx) => idx < index);
    const posGroup = {
      x: bounds.horizontal.start + (gaps.left || 0) + center - totalGroupsDistance / 2 + this._getDistanceGroups(prevGroups),
      y: bounds.vertical.start + (gaps.top || 0) + height,
    };

    new Text(
      font,
      this.ctx,
      ...Object.values(posGroup)
    ).draw();

    return posGroup;
  }

  _drawCircle(x, y, height, color) {
    const posCircle = {
      x: x - this.radiusCircle - this.margin.circle,
      y: y - height / 2,
    };

    new Circle(
      this.radiusCircle,
      ...Object.values(posCircle),
      color,
      this.ctx,
      1,
      posCircle.y - this.radiusCircle,
      posCircle.y + this.radiusCircle
    ).draw();
  }

  draw(gaps) {
    if (!this.showLegend) {
      return this;
    }

    const groups = this._getGroups();
    const updateGroups = this._getUpdateGroups(groups);

    this.groupsData = updateGroups.map(({ group, color: colorCap, height, width, }, index) => {
      const posGroup = this._drawText(group, height, updateGroups, index, gaps);

      this._drawCircle(...Object.values(posGroup), height, colorCap);

      return { ...posGroup, height, width, };
    });

    return this;
  }
}

export default Legend;