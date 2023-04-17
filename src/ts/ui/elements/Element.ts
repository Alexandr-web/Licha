import { IElementClass, } from "../../interfaces/element";

import setGradientColor from "../../helpers/setGradientColor";
import isString from "../../helpers/isString";

class Element implements IElementClass {
	public readonly ctx: CanvasRenderingContext2D;
	public readonly x?: number;
	public readonly y?: number;
	public readonly color?: string | Array<string>;
	public readonly rotateDeg?: number;
	public readonly opacity?: number;

	constructor(
		x: number,
		y: number,
		color: string | Array<string>,
		ctx: CanvasRenderingContext2D,
		rotateDeg = 0,
		opacity = 1
	) {
		// Позиция по оси абсцисс
		this.x = x;
		// Позиция по оси ординат
		this.y = y;
		// Цвет
		this.color = color;
		// Контекст элемента canvas
		this.ctx = ctx;
		// Градус поворота
		this.rotateDeg = rotateDeg;
		// Прозрачность
		this.opacity = opacity;
	}

	/**
	 * Устанавливает цвет
	 * @param {number} startY Начальная позиция по оси ординат
	 * @param {number} endY Конечная позиция по оси ординат
	 * @param {string} propertyToStyle Свойство, к которому нужно применять градиент
	 * @param {number} startX Начальная позиция по оси абсцисс
	 * @param {number} endX Конечная позиция по оси абсцисс
	 */
	public setColor(startY: number, endY: number, propertyToStyle: string, startX = 0, endX = 0): void {
		if (Array.isArray(this.color) && this.color.length > 1) {
			setGradientColor(this.color, startY, endY, propertyToStyle, this.ctx, startX, endX);
		} else if (Array.isArray(this.color) && this.color.length === 1) {
			this.ctx[propertyToStyle] = this.color[0];
		} else if (isString(this.color)) {
			this.ctx[propertyToStyle] = this.color;
		}
	}
}

export default Element;