import Element from "./Element";

import { ISize, } from "../../interfaces/global";
import { ISpecialFontData, ITextClass, } from "../../interfaces/text";

class Text extends Element implements ITextClass {
	public font: ISpecialFontData;
	public gapY?: number;
	public gapX?: number;

	constructor(font: ISpecialFontData, ctx: CanvasRenderingContext2D, x?: number, y?: number, color?: string, rotateDeg?: number, opacity?: number, gapX = 0, gapY = 0) {
		super(x, y, color, ctx, rotateDeg, opacity);

		// Содержит данные шрифта
		this.font = font;
		// Содержит отступ по оси ординат для всей диаграммы во воремя переворота текста
		this.gapY = gapY;
		// Содержит отступ по оси абсицсс для всей диаграммы во воремя переворота текста
		this.gapX = gapX;
	}

	/**
	 * Определяет размеры текста
	 * @returns {ISize} Размеры шрифта ({ width, height })
	 */
	public getSizes(): ISize {
		this.ctx.font = this.font.str;

		const text: TextMetrics = this.ctx.measureText(this.font.text);

		return {
			width: text.width,
			height: text.actualBoundingBoxAscent,
		};
	}

	// Рисует текст
	public draw(): void {
		const { str, color, text, } = this.font;
		const sizes: ISize = this.getSizes();

		this.ctx.save();

		this.ctx.globalAlpha = this.opacity;
		this.ctx.font = str;
		this.ctx.fillStyle = color;

		if (this.rotateDeg !== 0) {
			this.ctx.translate(this.x + this.gapX, this.y + this.gapY);
			this.ctx.rotate(this.rotateDeg);
			this.ctx.fillText(text, -(sizes.width / 2), -(sizes.height / 2));
		} else {
			this.ctx.fillText(text, this.x, this.y);
		}

		this.ctx.restore();
	}
}

export default Text;