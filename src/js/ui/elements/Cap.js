import Element from "./Element";
import Rect from "./Rect";
import Circle from "./Circle";

class Cap extends Element {
  constructor(size, x, y, color, format, ctx, opacity, startY, endY, rotateDeg, stroke = {}) {
    super(x, y, color, ctx, rotateDeg, opacity);

    this.format = format;
    this.size = size;
    this.stroke = stroke;
    this.startY = startY;
    this.endY = endY;
  }

  draw() {
    switch (this.format) {
      case "circle":
        new Circle(
          this.size,
          this.x,
          this.y,
          this.color,
          this.ctx,
          this.opacity,
          this.startY,
          this.endY,
          this.stroke
        ).draw();
        break;
      case "square":
        new Rect(
          this.x,
          this.y,
          this.color,
          this.ctx,
          this.rotateDeg,
          this.opacity,
          this.size,
          this.size,
          this.startY,
          this.endY,
          this.stroke
        ).draw();
        break;
    }
  }
}

export default Cap;