import Element from "./Element";
import setGradientColor from "../../helpers/setGradientColor";

import "../../interfaces/index";

class CustomFigure extends Element implements ICustomFigureClass {
  public lineTo: Array<ILineTo>;
  public startY?: number;
  public endY?: number;

  constructor(x, y, color, ctx, lineTo, startY?: number, endY?: number, opacity?: number) {
    super(x, y, color, ctx, opacity);

    // Массив, содержащий данные позиций линии
    this.lineTo = lineTo;
    // Начальная позиция по оси ординат
    this.startY = startY;
    // Конечная позиция по оси ординат
    this.endY = endY;
  }

  /**
   * Устанавливает цвет
   * @private
   */
  private _setColor(): void {
    if (Array.isArray(this.color)) {
      setGradientColor(this.color, this.startY, this.endY, "fillStyle", this.ctx);
    } else if (typeof this.color === "string") {
      this.ctx.fillStyle = this.color;
    }
  }

  // Рисует фигуру
  public draw(): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineCap = "round";

    this.lineTo.map(({ x, y, }) => this.ctx.lineTo(x, y));
    this._setColor();
    this.ctx.fill();
  }
}

export default CustomFigure;