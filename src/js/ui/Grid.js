import CustomFigure from "./elements/CustomFigure";
import Line from "./elements/Line";

class Grid {
  constructor(
    ctx,
    names,
    background,
    pointsY = [],
    pointsX = [],
    line = {},
    format = "default",
    theme = {}
  ) {
    // Содержит названия точек оси абсцисс
    this.names = names;
    // Контекст элемента canvas
    this.ctx = ctx;
    // Содержит данные точек оси ординат
    this.pointsY = pointsY;
    // Содержит данные точек оси абсцисс
    this.pointsX = pointsX;
    // Содержит данные линии
    this.line = line;
    // Формат сетки (horizontal или vertical)
    this.format = format;
    // Данные темы
    this.theme = theme;
    // Задний фон сетки
    this.background = background;
  }

  /**
   * Определяет точки, которые видны на диаграмме
   * @returns {array}
   */
  _getPointsYOnScreen() {
    return this.pointsY.filter(({ onScreen, }) => onScreen);
  }

  /**
   * Рисует задний фон сетке
   * @private
   */
  _drawBackground() {
    if (!this.background) {
      return;
    }

    const pointsYOnScreen = this._getPointsYOnScreen();
    const { x: startX, } = this.pointsX[0];
    const { y: startY, } = pointsYOnScreen[0];
    const { x: endX, } = this.pointsX[this.pointsX.length - 1];
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
    const { width, dotted, } = this.line;
    const firstXAxisItem = this.pointsX[0]; // Элемент для начальной позиции X линии
    const lastXAxisItem = this.pointsX[this.pointsX.length - 1]; // Элемент для конечной позиции X линии

    // Рисуем линии
    this._getPointsYOnScreen().map(({ y, }) => {
      new Line(
        firstXAxisItem.x,
        y,
        color,
        this.ctx,
        [{ x: lastXAxisItem.x, y, }],
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
    const { width, dotted, } = this.line;
    const axisYOnScreen = this._getPointsYOnScreen();
    const firstAxisYItem = axisYOnScreen[0]; // Элемент для начальной позиции Y линии
    const lastAxisYItem = axisYOnScreen[axisYOnScreen.length - 1]; // Элемент для конечной позиции Y линии

    // Рисуем линии
    this.names.map((name) => {
      const findAxisXItem = this.pointsX.find((axisXDataItem) => axisXDataItem.name === name); // Элемент для начальной и конечной позиции X линии

      new Line(
        findAxisXItem.x,
        firstAxisYItem.y,
        color,
        this.ctx,
        [{ x: findAxisXItem.x, y: lastAxisYItem.y, }],
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