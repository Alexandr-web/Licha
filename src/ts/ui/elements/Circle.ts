import Element from "./Element";

import { IStroke, } from "../../interfaces/global";
import { ICircleClass, } from "../../interfaces/circle";

class Circle extends Element implements ICircleClass {
	public radius: number;
	public stroke?: IStroke;
	public startY?: number;
	public endY?: number;

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
		this.stroke = (stroke || {});
		// Начальная позиция по оси ординат (для градиента)
		this.startY = startY;
		// Конечная позиция по оси ординат (для градиента)
		this.endY = endY;
	}

	// Рисует круг
	public draw(): void {
		this.ctx.beginPath();
		this.ctx.setLineDash([0, 0]);
		this.ctx.globalAlpha = this.opacity;

		this.setColor(this.startY, this.endY, "fillStyle");

		this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
		this.ctx.fill();

		if (Object.keys(this.stroke).length) {
			this.ctx.lineWidth = this.stroke.width;
			this.ctx.strokeStyle = this.stroke.color;
			this.ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
			this.ctx.stroke();
		}
	}
}

export default Circle;