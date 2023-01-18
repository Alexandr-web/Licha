import Axis from "./Axis";
import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";
import getRange from "../../helpers/getRange";
import quickSort from "../../helpers/quickSort";

class AxisY extends Axis {
  constructor(
    step,
    editValue,
    data,
    ctx,
    line,
    title,
    bounds,
    font,
    sortValues,
    sortNames
  ) {
    super(ctx, line, title, bounds, sortNames, sortValues, font);

    // Шаг, с которым будут рисоваться значения на оси ординат
    this.step = step;
    // Метод, который позволяет изменить вид значения на оси ординат
    this.editValue = editValue;
    this.data = data;
  }

  /**
   * Возвращает валидное значение оси ординат
   * @param {number} value Значение точки по умолчанию
   * @returns {string|number} Измененное значение точки
   * @private
   */
  _getCorrectValue(value) {
    return this.editValue instanceof Function ? this.editValue(value) : value;
  }

  drawTitle(gaps) {
    if (!Object.keys(this.title).length) {
      return this;
    }

    const bounds = this.bounds;
    const { size, text, color, weight = 400, } = this.title.font;
    const font = {
      size,
      text,
      color,
      str: `${weight} ${size}px Arial, sans-serif`,
    };
    const sizes = getTextSize(size, weight, text, this.ctx);
    const startY = bounds.vertical.start + sizes.width / 2 + (gaps.top || 0);
    const endY = bounds.vertical.end - (gaps.bottom || 0) - sizes.width / 2;
    const posTitle = {
      x: bounds.horizontal.start + sizes.height,
      y: startY + (endY - startY) / 2,
    };

    new Text(
      font,
      this.ctx,
      ...Object.values(posTitle),
      undefined,
      -90 * (Math.PI / 180)
    ).draw();

    this.title = {
      ...this.title,
      ...sizes,
      ...posTitle,
    };

    return this;
  }

  drawPoints(gaps = {}) {
    const values = this.getAxesData(this.data).values;
    const bounds = this.bounds;
    // Стили оси
    const { size, showText = Boolean(Object.keys(this.font).length), weight = 400, } = this.font;
    // Самое максимальное и минимальное значения
    const firstValue = Math.ceil(values[0]);
    const lastValue = Math.floor(values[values.length - 1]);
    // Содержит размеры самого максимального значения
    const firstValueSizes = getTextSize(size, weight, firstValue, this.ctx);
    const range = getRange(Math.min(firstValue, lastValue), Math.max(firstValue, lastValue), this.step);
    // Содержит точки на оси ординат
    const points = [];

    switch (this.sortValues) {
      case "less-more":
        points.push(...range.reverse());
        break;
      case "more-less":
        points.push(...range);
        break;
    }

    if (!points.includes(lastValue)) {
      points.push(lastValue);
    }

    points.map((value, index) => {
      // Содержит размеры значения
      const valueSizes = getTextSize(size, weight, this._getCorrectValue(value), this.ctx);
      // Начальная точка для отрисовки элементов
      const startPoint = bounds.vertical.start + firstValueSizes.height / 2 + (gaps.top || 0);
      // Конечная точка для отрисовки элементов
      const endPoint = bounds.vertical.end - startPoint - (gaps.bottom || 0);
      // Интервал для отрисовки элементов
      const step = endPoint / (points.length - 1);
      // Координаты для отрисовки элементов
      const posYItem = {
        x: bounds.horizontal.start + (gaps.left || 0),
        y: step * index + startPoint,
      };

      this.points.push({
        onScreen: true,
        value,
        ...valueSizes,
        ...posYItem,
      });

      // Отрисовываем значения
      if (showText) {
        new Text(
          { ...this.font, str: `${weight} ${size}px Arial, sans-serif`, text: this._getCorrectValue(value), },
          this.ctx,
          posYItem.x,
          posYItem.y + valueSizes.height / 2
        ).draw();
      }
    });

    values.map((uValue) => {
      const maxValue = quickSort(this.points, "value").find(({ value, }) => value >= uValue);
      const minValue = quickSort(this.points, "value").reverse().find(({ value, }) => value <= uValue);
      const textSizes = getTextSize(size, weight, uValue, this.ctx);
      const posYItem = {
        x: showText ? bounds.horizontal.start : 0,
        y: minValue.y + (uValue - minValue.value) * ((maxValue.y - minValue.y) / ((maxValue.value - minValue.value) || 1)),
      };

      this.points.push({
        value: uValue,
        onScreen: false,
        ...posYItem,
        ...textSizes,
      });
    });

    return this;
  }

  getMaxTextWidthAtYAxis() {
    return Math.max(...this.points.filter(({ onScreen, }) => onScreen).map(({ width, }) => width));
  }
}

export default AxisY;