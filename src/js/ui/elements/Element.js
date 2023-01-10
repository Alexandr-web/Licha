class Element {
  constructor(x, y, color, ctx, rotateDeg = 0, opacity = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.ctx = ctx;
    this.rotateDeg = rotateDeg;
    this.opacity = opacity;
  }
}

export default Element;