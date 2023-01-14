import Axis from "./Axis";
import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";
import getRange from "../../helpers/getRange";

class AxisY extends Axis {
  constructor(
    step,
    editValue,
    data,
    ctx,
    line,
    title,
    bounds,
    font
  ) {
    super(ctx, line, title, bounds, font);

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

  drawTitle(align, gaps) {
    if (!Object.keys(this.title).length) {
      return this;
    }

    const { size, text, color, weight = 400, } = this.title.font;
    const font = {
      size,
      text,
      color,
      str: `${weight} ${size}px Arial, sans-serif`,
    };
    const sizes = getTextSize(size, 400, text, this.ctx);
    const posTitle = {
      x: this.bounds.horizontal.start + sizes.height,
      y: null,
    };

    switch (align) {
      case "left":
        posTitle.y = this.bounds.vertical.end - sizes.width / 2;
        break;
      case "center":
        posTitle.y = this.bounds.vertical.end - this.bounds.height / 2;
        break;
      case "right":
        posTitle.y = this.bounds.vertical.start + sizes.width / 2 + gaps.title.top;
        break;
    }

    new Text(
      font,
      this.ctx,
      ...Object.values(posTitle),
      undefined,
      -90 * (Math.PI / 180),
      1
    ).draw();

    this.title = {
      ...this.title,
      ...sizes,
      ...posTitle,
    };

    return this;
  }

  drawPoints(gaps) {
    const values = this.getAxesData(this.data).values;
    const bounds = this.bounds;
    // Стили оси
    const showText = this.font.showText !== undefined ? this.font.showText : Boolean(Object.keys(this.font).length);
    const { size, } = this.font;
    // Самое максимальное и минимальное значения
    const firstValue = Math.ceil(values[0]);
    const lastValue = Math.floor(values[values.length - 1]);
    // Содержит размеры самого максимального значения
    const firstValueSizes = getTextSize(size, 400, firstValue, this.ctx);
    // Содержит точки на оси ординат
    const points = getRange(Math.min(firstValue, lastValue), Math.max(firstValue, lastValue), this.step).reverse();

    if (!points.includes(lastValue)) {
      points.push(lastValue);
    }

    points.map((value, index) => {
      // Содержит размеры значения
      const valueSizes = getTextSize(size, 400, this._getCorrectValue(value), this.ctx);
      // Начальная точка для отрисовки элементов
      const startPoint = bounds.vertical.start + firstValueSizes.height / 2 + (gaps.top || 0);
      // Конечная точка для отрисовки элементов
      const endPoint = bounds.vertical.end - startPoint - (gaps.bottom || 0);
      // Интервал для отрисовки элементов
      const step = endPoint / (points.length - 1);
      // Координаты для отрисовки элементов
      const posYItem = {
        x: this.bounds.horizontal.start + (gaps.left || 0),
        y: step * index + startPoint,
      };

      this.points.push({
        onScreen: true,
        value,
        ...valueSizes,
        ...posYItem,
      });

      // Отрисовываем значения
      if (showText !== undefined ? showText : Object.keys(this.font).length) {
        new Text(
          { ...this.font, str: `400 ${size}px Arial, sans-serif`, text: this._getCorrectValue(value), },
          this.ctx,
          posYItem.x,
          posYItem.y + valueSizes.height / 2,
          undefined,
          0,
          1
        ).draw();
      }
    });

    values.map((uValue) => {
      const maxValue = [...this.points].sort(({ value: val1, }, { value: val2, }) => val1 - val2).find(({ value, }) => value >= uValue);
      const minValue = [...this.points].sort(({ value: val1, }, { value: val2, }) => val2 - val1).find(({ value, }) => value <= uValue);
      const textSizes = getTextSize(size, 400, uValue, this.ctx);
      const posYItem = {
        x: showText ? bounds.horizontal.start : 0,
        y: minValue.y + (uValue - minValue.value) * ((maxValue.y - minValue.y) / (maxValue.value - minValue.value)),
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