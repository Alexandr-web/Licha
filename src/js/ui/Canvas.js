import Rect from "./elements/Rect";

class Canvas {
  constructor(selector, background = "white") {
    // HTML элемент canvas
    this.canvasElement = document.querySelector(selector);
    // Задний фон canvas
    this.background = background;
    // Контекст элемента canvas
    this.ctx = this.canvasElement.getContext("2d");
  }

  /**
   * Устанавливает начальные стили холсту
   * @private
   */
  _setDefaultStyles() {
    const { offsetWidth, offsetHeight, } = this.canvasElement;
    const defaultStyles = {
      display: "block",
      boxSizing: "border-box",
    };

    this.canvasElement.width = offsetWidth;
    this.canvasElement.height = offsetHeight;
    this.canvasElement.style = Object.keys(defaultStyles)
      .map((key) => `${key}:${defaultStyles[key]}`)
      .join(";");
  }

  /**
   * Получает размеры элемента canvas
   * @returns {object} Ширина и высота элемента canvas
   */
  getSizes() {
    const { width, height, } = this.canvasElement;

    return {
      width,
      height,
    };
  }

  /**
   * Устанавливает задний фон холсту
   * @private
   */
  _setBackground() {
    new Rect(0, 0, this.background, this.ctx, this.getSizes().width, this.getSizes().height).draw();
  }

  init() {
    this._setDefaultStyles();
    this._setBackground();

    return this;
  }
}

export default Canvas;