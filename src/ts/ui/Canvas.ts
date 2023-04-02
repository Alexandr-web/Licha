import Rect from "./elements/Rect";

import { ISize, } from "../interfaces/global";
import { ICanvasClass, ICanvasTheme, IDefaultStylesForCanvasElement, } from "../interfaces/canvas";
import { TEmptyObject, } from "../types/index";

class Canvas implements ICanvasClass {
	public selector: string;
	public background: string | Array<string>;
	public ctx: CanvasRenderingContext2D;
	public canvasElement: HTMLCanvasElement;
	public theme: ICanvasTheme | TEmptyObject;

	constructor(selector: string, background: string | Array<string>, theme = {}) {
		// HTML элемент canvas
		this.canvasElement = document.querySelector(selector);
		// Задний фон canvas
		this.background = background;
		// Контекст элемента canvas
		this.ctx = this.canvasElement.getContext("2d");
		// Содержит данные темы
		this.theme = theme;
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
	 * @returns {ISize} Ширина и высота элемента canvas
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
		const background: Array<string> | string = this.background || this.theme.background;
		const { width, height, } = this.getSizes();

		new Rect(0, 0, background, this.ctx, width, height, 0, height).draw();
	}

	/**
	 * Рисует начальный холст
	 * @returns {ICanvasClass} Экземпляр класса Canvas
	 */
	public init(): ICanvasClass {
		this._setDefaultStyles();
		this._setBackground();

		return this;
	}
}

export default Canvas;