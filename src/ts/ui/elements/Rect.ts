import { IStroke, } from "../../interfaces/global";
import { IRectClass, } from "../../interfaces/rect";

import Element from "./Element";
import { TEmptyObject, } from "../../types/index";

class Rect extends Element implements IRectClass {
	public readonly width: number;
	public readonly height: number;
	public readonly startY: number;
	public readonly endY: number;
	public readonly stroke?: IStroke | TEmptyObject;

	constructor(
		x: number,
		y: number,
		color: string | Array<string>,
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		startY?: number,
		endY?: number,
		rotateDeg?: number,
		opacity?: number,
		stroke?: IStroke | TEmptyObject
	) {
		super(x, y, color, ctx, rotateDeg, opacity);

		// Ширина
		this.width = width;
		// Высота
		this.height = height;
		// Начальная позиция по оси ординат (для градиента)
		this.startY = startY;
		// Конечная позиция по оси ординат (для градиента)
		this.endY = endY;
		// Содержит данные обводки
		this.stroke = stroke || {};
	}

	// Рисует прямоугольник
	public draw(): void {
		if (!this.color) {
			return;
		}

		this.ctx.beginPath();
		this.ctx.setLineDash([0, 0]);
		this.ctx.globalAlpha = this.opacity;

		this.setColor(this.startY, this.endY, "fillStyle");

		this.ctx.fillRect(this.x, this.y, this.width, this.height);

		if (Object.keys(this.stroke).length && Object.values(this.stroke).every(Boolean)) {
			this.ctx.lineWidth = (this.stroke as IStroke).width;
			this.ctx.strokeStyle = (this.stroke as IStroke).color;
			this.ctx.strokeRect(this.x, this.y, this.width, this.height);
		}
	}
}

export default Rect;