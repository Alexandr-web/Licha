import Element from "./Element";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";
import { ILineClass, ILineTo, } from "../../interfaces/line";

class Line extends Element implements ILineClass {
	public readonly lineTo: Array<ILineTo>;
	public readonly width?: number;
	public readonly dotted?: boolean;

	constructor(
		x: number,
		y: number,
		color: string | Array<string>,
		ctx: CanvasRenderingContext2D,
		lineTo: Array<ILineTo>,
		width?: number,
		dotted?: boolean
	) {
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
		if (!this.color) {
			return;
		}

		this.ctx.setLineDash(ifTrueThenOrElse(this.dotted, [10, 20], [0, 0]));

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