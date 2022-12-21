class WindowInfoBlock {
  constructor({
    color = "rgba(34,34,34, .8)",
    colorText = "white",
    colorLine = "white",
    width = 150,
    height = 50,
    ctx,
    fontSize = 12,
    padding = {
      vertical: 10,
      horizontal: 10,
      fromCap: 10,
    },
  }) {
    // Цвет окна
    this.ctx = ctx;
    // Цвет содержимого
    this.color = color;
    // Цвет линии
    this.colorText = colorText;
    // Ширина окна
    this.width = width;
    // Высота окна
    this.height = height;
    // Контекст canvas
    this.padding = padding;
    // Размер шрифта
    this.fontSize = fontSize;
    // Внутренние отступы
    this.colorLine = colorLine;
  }

  /**
   * Рисует блок
   * @param {number} x позиция по оси абсцисс
   * @param {number} y позиция по оси ординат
   */
  drawWindow(x, y) {
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(x, y, this.width, this.height);
  }

  /**
   * Рисует текст
   * @param {string|number} value значение текста
   * @param {number} x позиция по оси абсцисс
   * @param {number} y позиция по оси ординат
   */
  drawContains(value, x, y) {
    this.ctx.globalAlpha = 1;
    this.ctx.font = `400 ${this.fontSize}px Arial, sans-serif`;
    this.ctx.fontKerning = "none";
    this.ctx.fillStyle = this.colorText;
    this.ctx.fillText(value, x, y);
  }

  /**
   * Рисует линию группы
   * @param {object} start Объект, содержащий позиции начала линии
   * @param {object} to Объект, содержащий позиции направления линии
   */
  drawGroupLine({ start: { x: startX, y: startY, }, to: { x: toX, y: toY, }, }) {
    this.ctx.globalAlpha = 1;
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.colorLine;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(toX, toY);
    this.ctx.stroke();
  }
}

export default WindowInfoBlock;