import Text from "./elements/Text";
import Circle from "./elements/Circle";
import getTextSize from "../helpers/getTextSize";
import getStyleByIndex from "../helpers/getStyleByIndex";

class Legend {
  constructor(showLegend, data, line, ctx, bounds, font, circle, legendGaps = {}, maxCount = 4, themeForText = {}, themeForCircle = {}) {
    // Если включено, то легенда будет нарисована
    this.showLegend = showLegend;
    // Данные линии
    this.line = line;
    // Данные шрифта
    this.font = font;
    // Содержит данные групп
    this.data = data;
    // Контекст элемента canvas
    this.ctx = ctx;
    // Содержит объект границ диаграммы
    this.bounds = bounds;
    // Данные круга
    this.circle = circle;
    // Максимальное кол-во элементов в одной колонке
    this.maxCount = maxCount > 0 ? maxCount : 4;
    // Отступы
    this.legendGaps = legendGaps;
    // Высота легенды
    this.totalHeight = 0;
    // Стили для текста от темы
    this.themeForText = themeForText;
    // Стили для круга от темы
    this.themeForCircle = themeForCircle;
    // Содержит данные элементов легенды
    this.items = [];
  }

  /**
   * Определяет размеры у текста групп
   * @param {array} groups Содержит группы
   * @private
   * @returns {array} Группы с их размером текста
   */
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

  /**
   * Определяет дистанцию между группами по горизонтали
   * @param {array} groups Содержит группы
   * @private
   * @returns {number} Общая дистанция
   */
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

  /**
   * Определяет дистанцию между группами по вертикали
   * @param {array} groups Содержит группы
   * @private
   * @returns {number} Общая дистанция
   */
  _getTopDistanceGroups(groups) {
    if (!groups.length) {
      return 0;
    }

    const { group: gapsGroup = {}, } = this.legendGaps;
    const { height, } = groups[0];

    return (gapsGroup.bottom || 0) + height;
  }

  /**
   * Определяет колонки относительно текущих групп
   * @private 
   * @returns {array} Колонки
   */
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

  /**
   * Рисует текст группы
   * @param {string} group Содержит текст группы
   * @param {number} height Высота текста группы
   * @param {array} groups Содержит группы
   * @param {number} index Индекс группы
   * @param {object} gaps Отступы
   * @private
   * @returns {object} Позиция текста
   */
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

  /**
   * Рисует круг
   * @param {number} x Позиция по оси абсцисс
   * @param {number} y Позиция по оси ординат
   * @param {number} height Высота
   * @param {string} color Цвет
   * @private
   */
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

  /**
   * Получает дистанцию между текущей колонкой и предыдущих
   * @param {array} columns Содержит данные колонок
   * @param {number} index Индекс текущей колонки
   * @private
   * @returns {number} Дистанция
   */
  _getDistanceTopFromPrevColumns(columns, index) {
    const prevColumns = columns.filter((c, i) => i < index);

    return prevColumns.reduce((acc, prevColumn) => {
      acc += this._getTopDistanceGroups(this._getSizeGroups(prevColumn));

      return acc;
    }, 0);
  }

  /**
   * Рисует легенду
   * @param {object} gaps Содержит отступы легенды
   * @returns {Legend}
   */
  draw(gaps) {
    if (!this.showLegend) {
      return this;
    }

    const columns = this._getColumns();

    columns.map((groups, idx) => {
      const updateGroups = this._getSizeGroups(groups);
      const gapFromPrevColumns = this._getDistanceTopFromPrevColumns(columns, idx);

      updateGroups.map(({ group, color: colorCap, height, width, }, index) => {
        const posGroup = this._drawText(group, height, updateGroups, index, { ...gaps, top: gaps.top + gapFromPrevColumns, });

        this.items.push({ group, ...posGroup, height, width, });
        this._drawCircle(posGroup.x, posGroup.y, height, colorCap);
      });

      this.totalHeight += this._getTopDistanceGroups(updateGroups);
    });
    
    return this;
  }
}

export default Legend;