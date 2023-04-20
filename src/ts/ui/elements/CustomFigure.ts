import Element from "./Element";

import { ILineTo, } from "../../interfaces/line";
import { ICustomFigureClass, } from "../../interfaces/customFigure";
import { IStroke, } from "../../interfaces/global";
import { TEmptyObject, } from "../../types/index";

class CustomFigure extends Element implements ICustomFigureClass {
	public readonly lineTo: Array<ILineTo>;
	public readonly startY?: number;
	public readonly endY?: number;
	public readonly stroke?: IStroke | TEmptyObject;

	constructor(
		x: number,
		y: number,
		color: string | Array<string>,
		ctx: CanvasRenderingContext2D,
		lineTo: Array<ILineTo>,
		startY?: number,
		endY?: number,
		opacity?: number,
		stroke?: IStroke
	) {
		super(x, y, color, ctx, opacity);

		// Массив, содержащий данные позиций линии
		this.lineTo = lineTo;
		// Начальная позиция по оси ординат
		this.startY = startY;
		// Конечная позиция по оси ординат
		this.endY = endY;
		// Содержит данные обводки
		this.stroke = stroke || {};
	}

	// Рисует фигуру
	public draw(): void {
		if (!this.color) {
			return;
		}

		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.setLineDash([0, 0]);
		this.ctx.globalAlpha = this.opacity;
		this.ctx.lineCap = "round";

		this.lineTo.map(({ x, y, }) => this.ctx.lineTo(x, y));
		this.setColor(this.startY, this.endY, "fillStyle");
		this.ctx.fill();

		if (Object.keys(this.stroke).length && Object.values(this.stroke).every(Boolean)) {
			this.ctx.lineWidth = (this.stroke as IStroke).width;
			this.ctx.strokeStyle = (this.stroke as IStroke).color;
			this.ctx.stroke();
		}
	}
}

export default CustomFigure;