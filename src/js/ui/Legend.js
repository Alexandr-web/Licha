import Text from "./elements/Text";
import Circle from "./elements/Circle";
import getTextSize from "../helpers/getTextSize";
import getStyleByIndex from "../helpers/getStyleByIndex";

class Legend {
  constructor(showLegend, data, line, ctx, bounds, font, circle, legendGaps = {}, maxCount = 4, themeForText = {}, themeForCircle = {}) {
    this.showLegend = showLegend;
    this.line = line;
    this.font = font;
    this.data = data;
    this.ctx = ctx;
    this.bounds = bounds;
    this.circle = circle;
    this.maxCount = maxCount;
    this.legendGaps = legendGaps;
    this.totalHeight = 0;
    this.themeForText = themeForText;
    this.themeForCircle = themeForCircle;
  }

  _getSizeGroups(groups) {
    const { size, weight = 400, } = this.font;

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

    const { group: gapsGroup = {}, circle: gapsCircle = {}, } = this.legendGaps;
    const { radius, } = this.circle;

    return groups.reduce((acc, { width, }) => {
      acc += width + (gapsGroup.right || 0) + radius * 2 + (gapsCircle.right || 0);

      return acc;
    }, 0);
  }

  _getTopDistanceGroups(groups) {
    if (!groups.length) {
      return 0;
    }

    const { group: gapsGroup = {}, } = this.legendGaps;
    const { height, } = groups[0];

    return (gapsGroup.bottom || 0) + height;
  }

  _getColumns() {
    const columns = [];
    const dataKeys = Object.keys(this.data);

    for (let i = 0; i < dataKeys.length; i += this.maxCount) {
      const column = dataKeys
        .map((group) => ({ ...this.data[group], group, }))
        .slice(i, i + this.maxCount)
        .map(({ group, line = {}, }) => {
          const idx = dataKeys.indexOf(group);
          const colorByTheme = getStyleByIndex(idx, this.themeForCircle.color);
          const colorLine = (line.color || (this.line || {}).color || line.fill || (this.line || {}).fill) || colorByTheme;

          return {
            group,
            color: colorLine,
          };
        });

      columns.push(column);
    }

    return columns;
  }

  _drawText(group, height, groups, index, gaps) {
    const bounds = this.bounds;
    const center = bounds.width / 2;
    const totalGroupsDistance = this._getDistanceGroups(groups);
    const { size, weight = 400, color = this.themeForText.color, } = this.font;
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
      posGroup.x,
      posGroup.y
    ).draw();

    return posGroup;
  }

  _drawCircle(x, y, height, color) {
    const { radius, } = this.circle;
    const { circle = {}, } = this.legendGaps;
    const posCircle = {
      x: x - radius - (circle.right || 0),
      y: y - Math.max(radius, height / 2),
    };

    new Circle(
      radius,
      posCircle.x,
      posCircle.y,
      color,
      this.ctx,
      1,
      posCircle.y - radius,
      posCircle.y + radius
    ).draw();
  }

  _getDistanceTopFromPrevColumns(columns, index) {
    const prevColumns = columns.filter((c, i) => i < index);

    return prevColumns.reduce((acc, prevColumn) => {
      acc += this._getTopDistanceGroups(this._getSizeGroups(prevColumn));

      return acc;
    }, 0);
  }

  draw(gaps) {
    if (!this.showLegend) {
      return this;
    }

    const columns = this._getColumns();

    columns.map((groups, idx) => {
      const updateGroups = this._getSizeGroups(groups);
      const gapFromPrevColumns = this._getDistanceTopFromPrevColumns(columns, idx);

      updateGroups.map(({ group, color: colorCap, height, }, index) => {
        const posGroup = this._drawText(group, height, updateGroups, index, { ...gaps, top: gaps.top + gapFromPrevColumns, });

        this._drawCircle(posGroup.x, posGroup.y, height, colorCap);
      });

      this.totalHeight += this._getTopDistanceGroups(updateGroups);
    });

    return this;
  }
}

export default Legend;