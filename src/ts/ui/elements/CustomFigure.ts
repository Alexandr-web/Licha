import Element from "./Element";

import { ILineTo, } from "../../interfaces/line";
import { ICustomFigureClass, } from "../../interfaces/customFigure";

class CustomFigure extends Element implements ICustomFigureClass {
	public lineTo: Array<ILineTo>;
	public startY?: number;
	public endY?: number;

	constructor(
		x: number,
		y: number,
		color: string | Array<string>,
		ctx: CanvasRenderingContext2D,
		lineTo: Array<ILineTo>,
		startY?: number,
		endY?: number,
		opacity?: number
	) {
		super(x, y, color, ctx, opacity);

		// Массив, содержащий данные позиций линии
		this.lineTo = lineTo;
		// Начальная позиция по оси ординат
		this.startY = startY;
		// Конечная позиция по оси ординат
		this.endY = endY;
	}

	// Рисует фигуру
	public draw(): void {
		if (!this.color) {
			return;
		}

		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);
		this.ctx.globalAlpha = this.opacity;
		this.ctx.lineCap = "round";

		this.lineTo.map(({ x, y, }) => this.ctx.lineTo(x, y));
		this.setColor(this.startY, this.endY, "fillStyle");
		this.ctx.fill();
	}
}

export default CustomFigure;