import Element from "./Element";
import setGradientColor from "../../helpers/setGradientColor";

import { ILineClass, ILineTo, } from "../../interfaces/index";

class Line extends Element implements ILineClass {
	public lineTo: Array<ILineTo>;
	public width?: number;
	public dotted?: boolean;

	constructor(x, y, color, ctx, lineTo: Array<ILineTo>, width?: number, dotted?: boolean) {
		super(x, y, color, ctx);

		// Массив, содержащий данные позиций линии
		this.lineTo = lineTo;
		// Ширина линии
		this.width = width || 1;
		// Правило, говорящее, что линия будет состоять из точек
		this.dotted = dotted;
	}

	/**
	 * Устанавливает цвет
	 * @param {number} x Позиция по оси абсцисс
	 * @param {number} y Позиция по оси ординат
	 * @private
	 */
	private _setColor(x: number, y: number): void {
		if (Array.isArray(this.color)) {
			setGradientColor(this.color, this.y, y, "strokeStyle", this.ctx, this.x, x);
		} else if (typeof this.color === "string") {
			this.ctx.strokeStyle = this.color;
		}
	}

	// Рисует линию
	public draw(): void {
		this.ctx.setLineDash(this.dotted ? [10, 20] : [0, 0]);

		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);

		this.ctx.globalAlpha = this.opacity;
		this.ctx.lineWidth = this.width;
		this.ctx.lineCap = "round";

		this.lineTo.map(({ x, y, }) => {
			this._setColor(x, y);
			this.ctx.lineTo(x, y);
		});

		this.ctx.stroke();
	}
}

export default Line;