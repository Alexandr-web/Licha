class Cap {
  constructor({
    color,
    x,
    y,
    size,
    ctx,
    opacity,
    format,
    stroke = {},
  }) {
    // Формат колпачка
    this.format = format;
    // Обводка колпачка
    this.stroke = stroke;
    // Размер колпачка
    this.size = size;
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
  }

  /**
   * Рисует обводку для круга
   * @private
   */
  _setCircleStroke() {
    if (Object.keys(this.stroke).length) {
      this.ctx.lineWidth = this.stroke.width;
      this.ctx.strokeStyle = this.stroke.color;
      this.ctx.arc(this.x, this.y, this.size, Math.PI * 2, false);
      this.ctx.stroke();
    }
  }

  /**
   * Рисует обводку для квадрата
   * @private
   */
  _setSquareStroke() {
    if (Object.keys(this.stroke).length) {
      this.ctx.lineWidth = this.stroke.width;
      this.ctx.strokeStyle = this.stroke.color;
      this.ctx.strokeRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
  }

  // Рисует колпачок
  draw() {
    this.setStyles();

    switch (this.format) {
      case "circle":
        this.ctx.arc(this.x, this.y, this.size, Math.PI * 2, false);
        this.ctx.fill();

        this._setCircleStroke();
        break;
      case "square":
        this.ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);

        this._setSquareStroke();
        break;
    }
  }
}

export default Cap;