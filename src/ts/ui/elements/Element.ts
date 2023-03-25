import "../../interfaces/index";

class Element implements IElementClass {
  public ctx: CanvasRenderingContext2D;
  public x?: number;
  public y?: number;
  public color?: string;
  public rotateDeg?: number;
  public opacity?: number;

  constructor(x, y, color, ctx, rotateDeg = 0, opacity = 1) {
    // Позиция по оси абсцисс
    this.x = x;
    // Позиция по оси ординат
    this.y = y;
    // Цвет
    this.color = color;
    // Контекст элемента canvas
    this.ctx = ctx;
    // Градус поворота
    this.rotateDeg = rotateDeg;
    // Прозрачность
    this.opacity = opacity;
  }
}

export default Element;