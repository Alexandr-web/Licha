class Element {
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