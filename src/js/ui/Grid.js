import CustomFigure from "./elements/CustomFigure";
import Line from "./elements/Line";

class Grid {
  constructor(
    ctx,
    names,
    maxPointYWidth,
    background,
    axisY,
    axisX,
    line = {},
    format = "default",
    theme = {}
  ) {
    // Содержит максимальную ширину текста точки оси ординат
    this.maxPointYWidth = maxPointYWidth;
    // Содержит названия точек оси абсцисс
    this.names = names;
    // Контекст элемента canvas
    this.ctx = ctx;
    // Содержит точки оси ординат
    this.pointsY = axisY.points;
    // Содержит точки оси абсцисс
    this.pointsX = axisX.points;
    // Правило, говорящее, что точки на оси абсцисс будут отрисованы
    this.showPointsX = axisX.font.showText === undefined ? true : axisX.font.showText;
    // Правило, говорящее, что точки на оси ординат будут отрисованы
    this.showPointsY = axisY.font.showText === undefined ? true : axisY.font.showText;
    // Содержит данные линии
    this.line = line;
    // Формат сетки (horizontal или vertical)
    this.format = format;
    // Данные темы
    this.theme = theme;
    // Задний фон сетки
    this.background = background;
    // Дистанция между линией сетки и точкой оси
    this.distanceBetweenLineAndPoint = 5;
  }

  /**
   * Определяет точки, которые видны на диаграмме
   * @param {array} points Содержит точки оси
   * @private
   * @returns {array}
   */
  _getPointsOnScreen(points) {
    return points.filter(({ onScreen, }) => onScreen);
  }

  /**
   * Рисует задний фон сетке
   * @private
   */
  _drawBackground() {
    if (!this.background) {
      return;
    }

    const pointsYOnScreen = this._getPointsOnScreen(this.pointsY);
    const pointsXOnScreen = this._getPointsOnScreen(this.pointsX);
    const { x: startX, } = pointsXOnScreen[0];
    const { y: startY, } = pointsYOnScreen[0];
    const { x: endX, } = pointsXOnScreen[pointsXOnScreen.length - 1];
    const { y: endY, } = pointsYOnScreen[pointsYOnScreen.length - 1];

    new CustomFigure(
      startX,
      startY,
      this.background,
      this.ctx,
      [
        { x: endX, y: startY, },
        { x: endX, y: endY, },
        { x: startX, y: endY, },
        { x: startX, y: startY, }
      ],
      startY,
      endY
    ).draw();
  }

  /**
   * Рисует горизонтальные линии
   * @private
   * @param {string} color Цвет линии
   */
  _drawHorizontalLines(color) {
    const { width, dotted, stretch, } = this.line;
    const pointsXOnScreen = this._getPointsOnScreen(this.pointsX);
    const pointsYOnScreen = this._getPointsOnScreen(this.pointsY);
    const { x: startX, } = pointsXOnScreen[0];
    const { x: endX, } = pointsXOnScreen[pointsXOnScreen.length - 1];
    const useStretch = stretch && this.showPointsY;

    // Рисуем линии
    pointsYOnScreen.map(({ y, x, }) => {
      new Line(
        useStretch ? (x + this.maxPointYWidth + this.distanceBetweenLineAndPoint) : startX,
        y,
        color,
        this.ctx,
        [{ x: endX, y, }],
        width,
        dotted
      ).draw();
    });
  }

  /**
   * Рисует вертикальные линии
   * @private
   * @param {string} color Цвет линии
   */
  _drawVerticalLines(color) {
    const { width, dotted, stretch, } = this.line;
    const axisYOnScreen = this._getPointsOnScreen(this.pointsY);
    const axisXOnScreen = this._getPointsOnScreen(this.pointsX);
    const { y: startY, } = axisYOnScreen[0];
    const { y: endYPointX, } = axisXOnScreen[axisXOnScreen.length - 1];
    const { y: endYPointY, } = axisYOnScreen[axisYOnScreen.length - 1];

    // Рисуем линии
    this.names.map((name) => {
      const { x, height, } = this.pointsX.find((axisXDataItem) => axisXDataItem.name === name);
      const isOnScreen = axisXOnScreen.find((point) => point.name === name);
      const useStretch = stretch && isOnScreen && this.showPointsX;

      new Line(
        x,
        startY,
        color,
        this.ctx,
        [{ x, y: useStretch ? endYPointX - (height + this.distanceBetweenLineAndPoint) : endYPointY, }],
        width,
        dotted
      ).draw();
    });
  }

  // Рисует сетку
  init() {
    if (!Object.keys(this.line).length) {
      return;
    }

    this._drawBackground();

    const colorLine = this.line.color || this.theme.color;

    switch (this.format) {
      case "horizontal":
        this._drawHorizontalLines(colorLine);
        break;
      case "vertical":
        this._drawVerticalLines(colorLine);
        break;
      default:
        this._drawVerticalLines(colorLine);
        this._drawHorizontalLines(colorLine);
    }
  }
}

export default Grid;