import Element from "./Element";

class Line extends Element {
  constructor(x, y, color, ctx, rotateDeg, opacity, lineTo = [], width = 1, dotted = false) {
    super(x, y, color, ctx, rotateDeg, opacity);

    this.lineTo = lineTo;
    this.width = width;
    this.dotted = dotted;
  }

  _setColor(color, x, y) {
    if (Array.isArray(color)) {
      const grd = this.ctx.createLinearGradient(...Object.values(this.moveTo), x, y);

      // Создает градиент
      color.map((clr, idx) => {
        if (idx > 0 && idx < color.length - 1) {
          grd.addColorStop((1 / color.length) * (idx + 1), clr);
        } else if (idx === 0) {
          grd.addColorStop(0, clr);
        } else if (idx === color.length - 1) {
          grd.addColorStop(1, clr);
        }
      });

      this.ctx.strokeStyle = grd;
    } else if (typeof color === "string") {
      // Для одного цвета
      this.ctx.strokeStyle = color;
    }
  }

  draw() {
    this.ctx.setLineDash([this.dotted ? (0, 10) : (0, 0)]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);

    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = "round";

    this.lineTo.map(({ x, y, }) => {
      this._setColor(this.color, x, y);
      this.ctx.lineTo(x, y);
    });

    this.ctx.stroke();
  }
}

export default Line;