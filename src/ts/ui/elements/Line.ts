import Element from "./Element";

import { ILineClass, ILineTo, } from "../../interfaces/line";

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

	// Рисует линию
	public draw(): void {
		this.ctx.setLineDash(this.dotted ? [10, 20] : [0, 0]);

		this.ctx.beginPath();
		this.ctx.moveTo(this.x, this.y);

		this.ctx.globalAlpha = this.opacity;
		this.ctx.lineWidth = this.width;
		this.ctx.lineCap = "round";

		this.lineTo.map(({ x, y, }) => {
			this.setColor(this.y, y, "strokeStyle", this.x, x);
			this.ctx.lineTo(x, y);
		});

		this.ctx.stroke();
	}
}

export default Line;