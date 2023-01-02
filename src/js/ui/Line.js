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
    this.ctx.setLineDash([this.dotted ? (0, 6) : (0, 0)]);

    this.ctx.beginPath();

    if (Object.keys(this.moveTo).length) {
      this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
    }

    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = "round";
    // Устанавливет цвет линии
    this.lineTo.map(({ x, y, }) => {
      // Устанавливает градиент, если color передан в качестве массива
      if (Array.isArray(this.color)) {
        const grd = this.ctx.createLinearGradient(this.moveTo.x, this.moveTo.y, x, y);

        this.color.map((color, idx) => grd.addColorStop((idx > 0 ? 1 / (this.color.length - 1) : 0) * idx, color));

        this.ctx.strokeStyle = grd;
      } else if (typeof this.color === "string") {
        this.ctx.strokeStyle = this.color;
      }

      this.ctx.lineTo(x, y);
    });
  }

  // Рисует линию
  draw() {
    this.setStyles();
    this.ctx.stroke();
  }
}

export default Line;