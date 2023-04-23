import Element from "./Element";

import { IStroke, } from "../../interfaces/global";
import { ICircleClass, } from "../../interfaces/circle";

class Circle extends Element implements ICircleClass {
	public readonly radius: number;
	public readonly stroke?: IStroke;
	public readonly startY?: number;
	public readonly endY?: number;

	constructor(
		radius: number,
		x: number,
		y: number,
		color: string | Array<string>,
		ctx: CanvasRenderingContext2D,
		opacity?: number,
		startY?: number,
		endY?: number,
		stroke?: IStroke
	) {
		super(x, y, color, ctx, null, opacity);

		// Радиус
		this.radius = radius;
		// Содержит данные обводки
		this.stroke = stroke || {};
		// Начальная позиция по оси ординат (для градиента)
		this.startY = startY;
		// Конечная позиция по оси ординат (для градиента)
		this.endY = endY;
	}

	// Рисует круг
	public draw(): void {
		if (!this.color) {
			return;
		}

		this.ctx.beginPath();
		this.ctx.setLineDash([0, 0]);
		this.ctx.globalAlpha = this.opacity;

		this.setColor(this.startY, this.endY, "fillStyle");

		this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
		this.ctx.fill();

		if (Object.keys(this.stroke).length && Object.values(this.stroke).every(Boolean)) {
			this.ctx.lineWidth = this.stroke.width;
			this.ctx.strokeStyle = this.stroke.color;
			this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
			this.ctx.stroke();
		}
	}
}

export default Circle;