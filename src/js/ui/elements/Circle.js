import Element from "./Element";
import setGradientColor from "../../helpers/setGradientColor";

class Circle extends Element {
  constructor(radius, x, y, color, ctx, opacity, startY, endY, stroke = {}) {
    super(x, y, color, ctx, null, opacity);

    // Радиус
    this.radius = radius;
    // Содержит данные обводки
    this.stroke = stroke;
    // Начальная позиция по оси ординат (для градиента)
    this.startY = startY;
    // Конечная позиция по оси ординат (для градиента)
    this.endY = endY;
  }

  /**
   * Устанавливает цвет
   * @private
   */
  _setColor() {
    if (Array.isArray(this.color)) {
      setGradientColor(this.color, this.startY, this.endY, "fillStyle", this.ctx);
    } else if (typeof this.color === "string") {
      this.ctx.fillStyle = this.color;
    }
  }

  // Рисует круг
  draw() {
    this.ctx.beginPath();
    this.ctx.setLineDash([0, 0]);
    this.ctx.globalAlpha = this.opacity;

    this._setColor();

    this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    this.ctx.fill();

    if (Object.keys(this.stroke).length) {
      this.ctx.lineWidth = this.stroke.width;
      this.ctx.strokeStyle = this.stroke.color;
      this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      this.ctx.stroke();
    }
  }
}

export default Circle;