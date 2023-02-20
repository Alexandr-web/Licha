import Line from "./elements/Line";

class Grid {
  constructor(
    ctx,
    names,
    pointsY = [],
    pointsX = [],
    line = {},
    format = "default",
    theme = {}
  ) {
    this.names = names;
    this.ctx = ctx;
    this.pointsY = pointsY;
    this.pointsX = pointsX;
    this.line = line;
    this.format = format;
    this.theme = theme;
  }

  _drawHorizontalLines({ color, width, dotted, }) {
    const firstXAxisItem = this.pointsX[0]; // Элемент для начальной позиции X линии
    const lastXAxisItem = this.pointsX[this.pointsX.length - 1]; // Элемент для конечной позиции X линии

    // Рисуем линии
    this.pointsY.filter(({ onScreen, }) => onScreen).map(({ y, }) => {
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

  _drawVerticalLines({ color, width, dotted, }) {
    const axisYOnScreen = this.pointsY.filter(({ onScreen, }) => onScreen);
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

  init() {
    if (!Object.keys(this.line).length) {
      return;
    }

    this.line.color = this.line.color || this.theme.color;

    switch (this.format) {
      case "horizontal":
        this._drawHorizontalLines(this.line);
        break;
      case "vertical":
        this._drawVerticalLines(this.line);
        break;
      default:
        this._drawVerticalLines(this.line);
        this._drawHorizontalLines(this.line);
    }
  }
}

export default Grid;