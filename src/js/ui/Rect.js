class Rect {
  constructor({
    color,
    x,
    y,
    width,
    height,
    ctx,
    opacity,
    moveTo = {},
  }) {
    // Ширина фигуры
    this.width = width;
    // Высота фигуры
    this.height = height;
    // Прозрачность фигуры
    this.opacity = opacity;
    // Контекст canvas
    this.ctx = ctx;
    // Цвет фигуры
    this.color = color;
    // Позиция фигуры по оси абсцисс
    this.x = x;
    // Позиция фигуры по оси ординат
    this.y = y;
    // Начальная позиция фигуры
    this.moveTo = moveTo;
  }

  // Задает стили фигуре, но не рисует ее
  setStyles() {
    this.ctx.globalAlpha = this.opacity;

    // Устанавливает цвет фигуре
    if (Array.isArray(this.color)) {
      const grd = this.ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);

      this.color.map((color, idx) => grd.addColorStop((idx > 0 ? 1 / (this.color.length - 1) : 0) * idx, color));
      this.ctx.fillStyle = grd;
    } else {
      this.ctx.fillStyle = this.color;
    }
  }

  // Рисует фигуру
  draw() {
    this.setStyles();

    if (Object.keys(this.moveTo).length) {
      this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
    }

    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

export default Rect;