import Element from "./Element";

import { ISize, } from "../../interfaces/global";
import { ISpecialFontData, ITextClass, } from "../../interfaces/text";

class Text extends Element implements ITextClass {
	public font: ISpecialFontData;

	constructor(font, ctx, x?: number, y?: number, color?: string, rotateDeg?: number, opacity?: number) {
		super(x, y, color, ctx, rotateDeg, opacity);

		// Содержит данные шрифта
		this.font = font;
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
			this.ctx.translate(this.x, this.y);
			this.ctx.rotate(this.rotateDeg);
			this.ctx.fillText(text, -(sizes.width / 2), -(sizes.height / 2));
		} else {
			this.ctx.fillText(text, this.x, this.y);
		}

		this.ctx.restore();
	}
}

export default Text;