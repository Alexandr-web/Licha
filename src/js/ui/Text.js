class Text {
  constructor({
    text,
    color,
    font,
    x,
    y,
    ctx,
    align = "left",
    opacity,
    moveTo = {},
  }) {
    // Содержимое текста
    this.text = text;
    // Прозрачность текста
    this.opacity = opacity;
    // Контекст canvas
    this.ctx = ctx;
    // Данные текста в строковом виде
    this.font = font;
    // Цвет текста
    this.color = color;
    // Позиция текста по оси абсцисс
    this.x = x;
    // Позиция текста по оси ординат
    this.y = y;
    // Выравнивание текста
    this.align = align;
    // Начальная позиция текста
    this.moveTo = moveTo;
  }

  // Задает стили тексту, но не рисует его
  setStyles() {
    if (Object.keys(this.moveTo).length) {
      this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
    }

    this.ctx.globalAlpha = this.opacity;
    this.ctx.font = this.font;
    this.ctx.fillStyle = this.color;
    this.ctx.textAlign = this.align;
  }

  // Рисует текст
  draw() {
    this.setStyles();
    this.ctx.fillText(this.text, this.x, this.y);
  }
}

export default Text;