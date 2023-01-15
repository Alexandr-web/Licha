import Element from "./Element";

class BlockInfo extends Element {
  constructor(padding, contains, x, y, color, ctx, rotateDeg, opacity) {
    super(x, y, color, ctx, rotateDeg, opacity);

    this.padding = padding;
    this.contains = contains;
  }
}

export default BlockInfo;