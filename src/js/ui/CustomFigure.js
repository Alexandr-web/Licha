class CustomFigure {
  constructor({
    fill,
    lineTo = [],
    moveTo = {},
    ctx,
    opacity,
    startY,
    endY,
  }) {
    // Минимальная координата Y (для начала отрисовки градиента по оси ординат)
    this.startY = startY;
    // Конечная координата Y (для конца отрисовки градиента по оси ординат)
    this.endY = endY;
    // Задний фон фигуры
    this.fill = fill;
    // Прозрачность фигуры
    this.opacity = opacity;
    // Контекст canvas
    this.ctx = ctx;
    // Содержит объекты следующих позиций линии
    this.lineTo = lineTo;
    // Начальная позиция линии
    this.moveTo = moveTo;
  }

  /**
   * Устанавливает задний фон фигуре
   * @private
   */
  _setFill() {
    if (Array.isArray(this.fill)) {
      const grd = this.ctx.createLinearGradient(0, this.startY, 0, this.endY);

      // Создает градиент
      this.fill.map((color, idx) => {
        if (idx > 0 && idx < this.fill.length - 1) {
          grd.addColorStop((1 / this.fill.length) * (idx + 1), color);
        } else if (idx === 0) {
          grd.addColorStop(0, color);
        } else if (idx === this.fill.length - 1) {
          grd.addColorStop(1, color);
        }
      });

      this.ctx.fillStyle = grd;
    } else if (typeof this.fill === "string") {
      this.ctx.fillStyle = this.fill;
    }
  }

  // Задает стили фигуре, но не рисует ее
  setStyles() {
    this.ctx.beginPath();

    if (Object.keys(this.moveTo).length) {
      this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
    }

    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = "round";

    this.lineTo.map(({ x, y, }) => this.ctx.lineTo(x, y));
    this._setFill();
  }

  // Рисует линию
  draw() {
    this.setStyles();
    this.ctx.fill();
  }
}

export default CustomFigure;