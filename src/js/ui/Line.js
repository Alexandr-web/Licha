class Line {
  constructor({
    color,
    lineTo = [],
    width = 1,
    ctx,
    opacity,
    moveTo = {},
    dotted = false,
  }) {
    // Ширина фигуры
    this.width = width;
    // Прозрачность линии
    this.opacity = opacity;
    // Контекст canvas
    this.ctx = ctx;
    // Цвет линии
    this.color = color;
    // Содержит объекты следующих позиций линии
    this.lineTo = lineTo;
    // Начальная позиция линии
    this.moveTo = moveTo;
    // Пунктирная линия
    this.dotted = dotted;
  }

  // Задает стили линии, но не рисует ее
  setStyles() {
    this.ctx.setLineDash([this.dotted ? (0, 8) : (0, 0)]);

    this.ctx.beginPath();

    if (Object.keys(this.moveTo).length) {
      this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
    }

    this.ctx.globalAlpha = this.opacity;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = "round";
    this.lineTo.map(({ x, y, }) => this.ctx.lineTo(x, y));
  }

  // Рисует фигуру
  draw() {
    this.setStyles();

    this.ctx.stroke();
  }
}

export default Line;