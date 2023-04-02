import Element from "./Element";
import Rect from "./Rect";
import Circle from "./Circle";

import { TCapType, } from "../../types/index";

import { IStroke, } from "../../interfaces/global";
import { ICapClass, } from "../../interfaces/cap";

class Cap extends Element implements ICapClass {
	public format: TCapType;
	public size: number;
	public stroke?: IStroke;
	public startY?: number;
	public endY?: number;

	constructor(
		size: number,
		x: number,
		y: number,
		color: string | Array<string>,
		format: TCapType,
		ctx: CanvasRenderingContext2D,
		opacity?: number,
		startY?: number,
		endY?: number,
		rotateDeg?: number,
		stroke?: IStroke
	) {
		super(x, y, color, ctx, rotateDeg, opacity);

		// Формат колпачка
		this.format = format;
		// Размер колпачка
		this.size = size;
		// Объект, содержащий данные обводки ({ width, color })
		this.stroke = stroke;
		// Начальная позиция по оси ординат (для градиента)
		this.startY = startY;
		// Конечная позиция по оси ординат (для градиента)
		this.endY = endY;
	}

	// Рисует колпачок
	public draw(): void {
		switch (this.format) {
			case "circle":
				new Circle(
					this.size,
					this.x,
					this.y,
					this.color,
					this.ctx,
					this.opacity,
					this.startY,
					this.endY,
					this.stroke
				).draw();
				break;
			case "square":
				new Rect(
					this.x,
					this.y,
					this.color,
					this.ctx,
					this.size,
					this.size,
					this.startY,
					this.endY,
					this.rotateDeg,
					this.opacity,
					this.stroke
				).draw();
				break;
		}
	}
}

export default Cap;