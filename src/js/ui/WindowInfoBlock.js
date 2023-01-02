import Text from "./Text";
import Rect from "./Rect";
import Line from "./Line";

class WindowInfoBlock {
	constructor({
		color = "rgba(0, 0, 0, .5)",
		colorText = "white",
		width = 150,
		height = 50,
		ctx,
		fontSize = 12,
		padding = {
			vertical: 10,
			horizontal: 10,
			fromCap: 10,
		},
	}) {
		// Цвет окна
		this.ctx = ctx;
		// Цвет содержимого
		this.color = color;
		// Цвет линии
		this.colorText = colorText;
		// Ширина окна
		this.width = width;
		// Высота окна
		this.height = height;
		// Контекст canvas
		this.padding = padding;
		// Размер шрифта
		this.fontSize = fontSize;
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
	 * @param {string|number} value значение текста
	 * @param {number} x позиция по оси абсцисс
	 * @param {number} y позиция по оси ординат
	 */
	drawContains(value, x, y) {
		new Text({
			text: value,
			color: this.colorText,
			font: `400 ${this.fontSize}px Arial, sans-serif`,
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
	 */
	drawGroupLine({ start: { x: startX, y: startY, }, to: { x: toX, y: toY, }, color, width, }) {
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

export default WindowInfoBlock;