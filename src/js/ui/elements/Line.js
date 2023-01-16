import Element from "./Element";
import setGradientColor from "../../helpers/setGradientColor";

class Line extends Element {
  constructor(x, y, color, ctx, lineTo = [], width = 1, dotted = false) {
    super(x, y, color, ctx);

    this.lineTo = lineTo;
    this.width = width;
    this.dotted = dotted;
  }

  _setColor(color, x, y) {
    if (Array.isArray(color)) {
      setGradientColor(color, this.y, y, "strokeStyle", this.ctx, this.x, x);
    } else if (typeof color === "string") {
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