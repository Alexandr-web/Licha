import Element from "./Element";

import { IStroke, } from "../../interfaces/global";
import { IRectClass, } from "../../interfaces/rect";

class Rect extends Element implements IRectClass {
	public width: number;
	public height: number;
	public startY: number;
	public endY: number;
	public stroke?: IStroke | object;

	constructor(x, y, color, ctx, width, height, startY?: number, endY?: number, rotateDeg?: number, opacity?: number, stroke?: IStroke | object) {
		super(x, y, color, ctx, rotateDeg, opacity);

		// Ширина
		this.width = width;
		// Высота
		this.height = height;
		// Начальная позиция по оси ординат (для градиента)
		this.startY = startY;
		// Конечная позиция по оси ординат (для градиента)
		this.endY = endY;
		// Содержит данные обводки ({ color, width })
		this.stroke = stroke || {};
	}

	// Рисует прямоугольник
	public draw(): void {
		this.ctx.beginPath();
		this.ctx.setLineDash([0, 0]);
		this.ctx.globalAlpha = this.opacity;

		this.setColor(this.startY, this.endY, "fillStyle");

		this.ctx.fillRect(this.x, this.y, this.width, this.height);

		if (Object.keys(this.stroke).length) {
			this.ctx.lineWidth = (this.stroke as IStroke).width;
			this.ctx.strokeStyle = (this.stroke as IStroke).color;
			this.ctx.strokeRect(this.x, this.y, this.width, this.height);
		}
	}
}

export default Rect;