class Cap {
  constructor({
    color,
    x,
    y,
    radius,
    ctx,
    opacity,
    stroke = {},
  }) {
    // Обводка колпачка
    this.stroke = stroke;
    // Радиус колпачка
    this.radius = radius;
    // Прозрачность колпачка
    this.opacity = opacity;
    // Контекст canvas
    this.ctx = ctx;
    // Цвет колпачка
    this.color = color;
    // Позиция колпачка по оси абсцисс
    this.x = x;
    // Позиция колпачка по оси ординат
    this.y = y;
  }

  // Задает стили колпачку
  setStyles() {
    this.ctx.beginPath();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = this.color;

    if (Object.keys(this.stroke).length) {
      this.ctx.lineWidth = this.stroke.width;
      this.ctx.strokeStyle = this.stroke.color;
      this.ctx.stroke();
    }
  }

  // Рисует колпачок
  draw() {
    this.setStyles();
    this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
    this.ctx.fill();
  }
}

export default Cap;