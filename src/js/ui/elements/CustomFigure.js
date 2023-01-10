import Element from "./Element";
import setGradientColor from "../../helpers/setGradientColor";

class CustomFigure extends Element {
  constructor(x, y, color, ctx, lineTo, startY, endY, opacity) {
    super(x, y, color, ctx, opacity);

    this.lineTo = lineTo;
    this.startY = startY;
    this.endY = endY;
  }

  _setColor() {
    if (Array.isArray(this.color)) {
      setGradientColor(this.color, this.startY, this.endY, "fillStyle", this.ctx);
    } else if (typeof this.color === "string") {
      this.ctx.fillStyle = this.color;
    }
  }

  draw() {
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