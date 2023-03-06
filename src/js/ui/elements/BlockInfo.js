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

    // Содержит данные групп
    this.data = data;
    // Содержит границы дигараммы
    this.bounds = bounds;
    // Содержит данные элементов, которые подходят по координатам мыши
    this.elements = elements;
    // Внутренние отступы
    this.padding = padding;
    // Содержит данные заголовка
    this.titleData = titleData;
    // Содержит данные групп
    this.groupsData = groupsData;
    // Ширина линий
    this.groupLineWidth = 5;
    // Размеры треугольника
    this.triangleSizes = {
      height: 10,
      width: 15,
    };
    // Текст заголовка
    this.title = elements[0].name;
    // Стили для окна от темы
    this.themeForWindow = themeForWindow;
    // Стили для линии от темы
    this.themeForLine = themeForLine;
    // Стили для заголовка от темы
    this.themeForTitle = themeForTitle;
    // Стили для группы от темы
    this.themeForGroup = themeForGroup;
  }

  /**
   * Определяет размеры элементов
   * @private
   * @returns {array} Массив, содержащий данные элементов, включая их размеры
   */
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

  /**
   * Определяет позицию окна
   * @private
   * @returns {object} Позиция окна ({ x, y })
   */
  _getCoordinates() {
    return {
      x: this.x + this.triangleSizes.height,
      y: this.y,
    };
  }

  /**
   * Определяет дистанцию между группами
   * @param {array} elements Содержит данные элементов
   * @private
   * @returns {number} Дистанция
   */
  _getTopGroupsDistance(elements) {
    const { gaps, } = this.groupsData;

    return elements.reduce((acc, { height, }) => {
      acc += height + gaps.bottom;

      return acc;
    }, 0);
  }

  /**
   * Рисует линии
   * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
   * @param {number} blockWidth Ширина окна
   * @private
   */
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

      if (windowIsOutOfBounds) {
        Object.assign(linePos, {
          moveTo: {
            x: posX - (blockWidth + this.triangleSizes.height * 2),
            y: groupPos.y,
          },
          lineTo: [
            {
              x: posX - (blockWidth + this.triangleSizes.height * 2),
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

  /**
   * Определяет размеры заголовка
   * @private
   * @returns {object} Размеры ({ width, height })
   */
  _getTitleSize() {
    const { font, } = this.titleData;
    const { size, weight, } = font;

    return getTextSize(size, weight, this.title, this.ctx);
  }

  /**
   * Рисует заголовок
   * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
   * @param {number} blockWidth Ширина окна
   * @private
   */
  _drawTitle(windowIsOutOfBounds, blockWidth) {
    const padding = this.padding;
    const { x, y, } = this._getCoordinates();
    const coordinates = {
      x: x + (padding.left || 0),
      y: y + (padding.top || 0) + this._getTitleSize().height,
    };

    if (windowIsOutOfBounds) {
      coordinates.x -= blockWidth + this.triangleSizes.height * 2;
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

  /**
   * Определяет позицию группы
   * @param {number} index Индекс текущей группы
   * @private
   * @returns {object} Позиция группы ({ x, y })
   */
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

  /**
   * Рисует группы
   * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
   * @param {number} blockWidth Ширина окна
   * @private
   */
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
        coordinates.x -= blockWidth + this.triangleSizes.height * 2;
      }

      new Text(
        font,
        this.ctx,
        coordinates.x,
        coordinates.y
      ).draw();
    });
  }

  /**
   * Определяет максимальную ширину среди элементов
   * @param {array} elements Содержит данные элементов
   * @private
   * @returns {number} Максимальная ширина
   */
  _getMaxContentWidth(elements) {
    const maxGroupWidth = quickSort(elements.map(({ group, }) => group), "width").reverse()[0].width;
    const titleWidth = this._getTitleSize().width;

    return Math.max(maxGroupWidth, titleWidth);
  }

  /**
   * Проверяет на выход окна за границы диаграммы
   * @param {number} blockWidth Ширина окна
   * @private
   * @returns {boolean}
   */
  _outOfBounds(blockWidth) {
    return this._getCoordinates().x + blockWidth > this.bounds.width;
  }

  /**
   * Определяет размеры окна
   * @private
   * @returns {object} Размеры окна ({ width, height })
   */
  _getWindowSize() {
    const padding = this.padding;
    const { gaps: gapsGroups, } = this.groupsData;
    const { gaps: gapsTitle, } = this.titleData;
    const groups = this._getElementsWithSize().map(({ group, }) => group);
    const width = this._getMaxContentWidth(this._getElementsWithSize()) + (padding.right || 0) + (padding.left || 0) + (gapsGroups.right || 0) + this.groupLineWidth;
    const height = this._getTitleSize().height + this._getTopGroupsDistance(groups) + (gapsTitle.bottom || 0) + (padding.bottom || 0);

    return { width, height, };
  }

  /**
   * Рисует треугольник
   * @private
   * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
   */
  _drawTriangle(windowIsOutOfBounds) {
    const x = this.x;
    const y = this.y;
    const triangleData = {
      x: x + this.triangleSizes.height,
      y,
      lineTo: [
        { x, y: y + this.triangleSizes.width / 2, },
        { x: x + this.triangleSizes.height, y: y + this.triangleSizes.width, }
      ],
      startY: y,
      endY: y + this.triangleSizes.width,
    };

    if (windowIsOutOfBounds) {
      Object.assign(triangleData, {
        x: x - this.triangleSizes.height,
        y,
        lineTo: [
          { x, y: y + this.triangleSizes.width / 2, },
          { x: x - this.triangleSizes.height, y: y + this.triangleSizes.width, }
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

  /**
   * Рисует окно
   * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
   * @param {number} width Ширина окна
   * @param {number} height Высота окна
   * @private
   */
  _drawWindow(windowIsOutOfBounds, width, height) {
    const coordinates = this._getCoordinates();

    if (windowIsOutOfBounds) {
      coordinates.x -= (width + this.triangleSizes.height * 2);
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

  // Рисует окно об активной группе
  init() {
    const windowIsOutOfBounds = this._outOfBounds(this._getWindowSize().width);
    const { width, height, } = this._getWindowSize();

    this._drawTriangle(windowIsOutOfBounds);
    this._drawWindow(windowIsOutOfBounds, width, height);
    this._drawTitle(windowIsOutOfBounds, width);
    this._drawGroups(windowIsOutOfBounds, width);
    this._drawLines(windowIsOutOfBounds, width);
  }
}

export default BlockInfo;