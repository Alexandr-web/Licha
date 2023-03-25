import Rect from "./elements/Rect";

import "../interfaces/index";

class Canvas implements ICanvasClass {
  public selector: string;
  public background: string;
  public ctx: CanvasRenderingContext2D;
  public canvasElement: HTMLCanvasElement;
  public theme: ICanvasTheme;

  constructor(selector, background, theme = {}) {
    // HTML элемент canvas
    this.canvasElement = document.querySelector(selector);
    // Задний фон canvas
    this.background = background;
    // Контекст элемента canvas
    this.ctx = this.canvasElement.getContext("2d");
    // Содержит данные темы
    this.theme = theme as any;
  }

  /**
   * Устанавливает начальные стили холсту
   * @private
   */
  private _setDefaultStyles(): void {
    const { offsetWidth, offsetHeight, } = this.canvasElement;
    const defaultStyles: IDefaultStylesForCanvasElement = {
      display: "block",
      boxSizing: "border-box",
    };

    this.canvasElement.width = offsetWidth;
    this.canvasElement.height = offsetHeight;
    this.canvasElement.setAttribute("style", Object.keys(defaultStyles)
      .map((key) => `${key}:${defaultStyles[key]}`)
      .join(";"));
  }

  /**
   * Получает размеры элемента canvas
   * @returns {object} Ширина и высота элемента canvas
   */
  public getSizes(): ISize {
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
  private _setBackground(): void {
    const background: string = this.background || this.theme.background;

    new Rect(0, 0, background, this.ctx, this.getSizes().width, this.getSizes().height).draw();
  }

  // Рисует начальный холст
  public init(): ICanvasClass {
    this._setDefaultStyles();
    this._setBackground();

    return this;
  }
}

export default Canvas;