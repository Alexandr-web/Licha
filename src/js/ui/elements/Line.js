import Element from "./Element";
import setGradientColor from "../../helpers/setGradientColor";

class Line extends Element {
  constructor(x, y, color, ctx, lineTo = [], width = 1, dotted = false) {
    super(x, y, color, ctx);

    // Массив, содержащий данные позиций линии
    this.lineTo = lineTo;
    // Ширина линии
    this.width = width;
    // Правило, говорящее, что линия будет нарисована пошагово
    this.dotted = dotted;
  }

  /**
   * Устанавливает цвет
   * @param {number} x Позиция по оси абсцисс
   * @param {number} y Позиция по оси ординат
   * @private
   */
  _setColor(x, y) {
    if (Array.isArray(this.color)) {
      setGradientColor(this.color, this.y, y, "strokeStyle", this.ctx, this.x, x);
    } else if (typeof this.color === "string") {
      this.ctx.strokeStyle = this.color;
    }
  }

  // Рисует линию
  draw() {
    this.ctx.setLineDash([this.dotted ? (0, 10) : (0, 0)]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);

    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = "round";

    this.lineTo.map(({ x, y, }) => {
      this._setColor(x, y);
      this.ctx.lineTo(x, y);
    });

    this.ctx.stroke();
  }
}

export default Line;