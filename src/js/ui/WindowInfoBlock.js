import Text from "./Text";
import Rect from "./Rect";
import Line from "./Line";

class WindowInfoBlock {
	constructor({
		color = "black",
		width = 150,
		height = 50,
		ctx,
	}) {
		// Цвет окна
		this.ctx = ctx;
		// Цвет содержимого
		this.color = color;
		// Ширина окна
		this.width = width;
		// Высота окна
		this.height = height;
	}

	/**
	 * Рисует блок
	 * @param {number} x позиция по оси абсцисс
	 * @param {number} y позиция по оси ординат
	 */
	drawWindow(x, y) {
		new Rect({
			x,
			y,
			ctx: this.ctx,
			width: this.width,
			height: this.height,
			color: this.color,
			opacity: 1,
		}).draw();
	}

	/**
	 * Рисует текст
	 * @param {string|number} text значение текста
	 * @param {number} x позиция по оси абсцисс
	 * @param {number} y позиция по оси ординат
	 * @param {number} fontSize размер шрифта
	 * @param {string} color Цвет текста
	 */
	drawContains({ text, x, y, fontSize, color, }) {
		new Text({
			text,
			color,
			font: `400 ${fontSize}px Arial, sans-serif`,
			x,
			y,
			ctx: this.ctx,
			opacity: 1,
		}).draw();
	}

	/**
	 * Рисует линию группы
	 * @param {object} start Объект, содержащий позиции начала линии
	 * @param {object} to Объект, содержащий позиции направления линии
	 * @param {string} color Цвет линии
	 * @param {number} width Ширина линии
	 */
	drawGroupLine({ start: { x: startX, y: startY, }, to: { x: toX, y: toY, }, color, width, }) {
		if (color) {
			new Line({
				color,
				opacity: 1,
				width,
				moveTo: { x: startX, y: startY, },
				lineTo: [{ x: toX, y: toY, }],
				ctx: this.ctx,
			}).draw();
		}
	}
}

export default WindowInfoBlock;