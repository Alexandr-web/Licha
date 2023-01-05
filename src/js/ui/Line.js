class Line {
  constructor({
    color,
    fill,
    lineTo = [],
    width = 1,
    ctx,
    opacity,
    moveTo = {},
    dotted = false,
    minStartY,
  }) {
    // Начальная минимальная координата Y (для начала отрисовки градиента по оси ординат)
    this.minStartY = minStartY;
    // Задний фон линии
    this.fill = fill;
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

  /**
   * Устанавливает цвет линии
   * @param {string|array} background цвет
   * @param {boolean} isStroke проверка на обводку
   * @param {number} endX конечная позиция по оси абсцисс
   * @param {number} endY конечная позиция по оси ординат
   */
  _setColor(background, isStroke, endX, endY) {
    if (Array.isArray(background)) {
      // Для градиента
      let grd = null;

      if (isStroke) {
        // Для обводки
        grd = this.ctx.createLinearGradient(...Object.values(this.moveTo), endX, endY);
      } else {
        // Для заднего фона
        grd = this.ctx.createLinearGradient(0, this.minStartY, 0, endY);
      }

      // Создает градиент
      background.map((color, idx) => {
        if (idx > 0 && idx < background.length - 1) {
          grd.addColorStop((1 / background.length) * (idx + 1), color);
        } else if (idx === 0) {
          grd.addColorStop(0, color);
        } else if (idx === background.length - 1) {
          grd.addColorStop(1, color);
        }
      });

      this.ctx[isStroke ? "strokeStyle" : "fillStyle"] = grd;
    } else if (typeof background === "string") {
      // Для одного цвета
      this.ctx[isStroke ? "strokeStyle" : "fillStyle"] = background;
    }
  }

  // Задает стили линии, но не рисует ее
  setStyles() {
    this.ctx.setLineDash([this.dotted ? (0, 40) : (0, 0)]);

    this.ctx.beginPath();

    if (Object.keys(this.moveTo).length) {
      this.ctx.moveTo(this.moveTo.x, this.moveTo.y);
    }

    this.ctx.globalAlpha = this.opacity;
    this.ctx.lineWidth = this.width;
    this.ctx.lineCap = "round";

    this.lineTo.map(({ x, y, }) => {
      if (this.fill !== undefined) {
        this._setColor(this.fill, false, x, y);
      } else {
        this._setColor(this.color, true, x, y);
      }

      this.ctx.lineTo(x, y);
    });
  }

  // Рисует линию
  draw() {
    this.setStyles();
    this.ctx[this.fill === undefined ? "stroke" : "fill"]();
  }
}

export default Line;