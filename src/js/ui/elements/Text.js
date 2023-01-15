import Element from "./Element";

class Text extends Element {
  constructor(font, ctx, x, y, color, rotateDeg, opacity) {
    super(x, y, color, ctx, rotateDeg, opacity);

    this.font = font;
  }

  getSizes() {
    this.ctx.font = this.font.str;

    const text = this.ctx.measureText(this.font.text);

    return {
      width: text.width,
      height: text.actualBoundingBoxAscent,
    };
  }

  draw() {
    const { str, color, text, } = this.font;
    const sizes = this.getSizes(str);

    this.ctx.save();

    this.ctx.globalAlpha = this.opacity;
    this.ctx.font = str;
    this.ctx.fillStyle = color;

    if (this.rotateDeg !== 0) {
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(this.rotateDeg);
      this.ctx.fillText(text, -(sizes.width / 2), -(sizes.height / 2));
    } else {
      this.ctx.fillText(text, this.x, this.y);
    }

    this.ctx.restore();
  }
}

export default Text;