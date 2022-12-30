import Text from "./Text";
import Rect from "./Rect";
import Line from "./Line";

class WindowInfoBlock {
	constructor({
		color = "rgba(34,34,34, .8)",
		colorText = "white",
		colorLine = "white",
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
		// Внутренние отступы
		this.colorLine = colorLine;
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
	 */
	drawGroupLine({ start: { x: startX, y: startY, }, to: { x: toX, y: toY, }, }) {
		if (Array.isArray(this.colorLine)) {
			this.colorLine.forEach((color, idx) => {
				new Line({
					color,
					opacity: 1,
					width: 2,
					moveTo: { x: startX, y: idx !== 0 ? startY + 20 : startY, },
					lineTo: [{ x: toX, y: idx !== 0 ? toY + 20 : toY, }],
					ctx: this.ctx,
				}).draw();
			});
		} else if (typeof this.colorLine === "string") {
			new Line({
				color: this.colorLine,
				opacity: 1,
				width: 2,
				moveTo: { x: startX, y: startY, },
				lineTo: [{ x: toX, y: toY, }],
				ctx: this.ctx,
			}).draw();
		}
	}

	/**
	 * Проверка выхода блока за границы канваса
	 * @param {number} x Координата x активной группы
	 * @param {number} y Координата y активной группы
	 * @param {object} containPositions Объект, содержащий позиции элементов блока
	 * @param {number} radius Радиус
	 * @param {number} canvasWidth Ширина канваса
	 * @param {object} padding Содержит отступы
	 * @return {object} объект с координатами окна
	 */
	getWindowPosition({
		x,
		y,
		containPositions,
		windowBlock,
		radius,
		canvasWidth,
		padding,
	}) {
		const blockCoords = {
			x: x + padding.fromCap,
			y: y - this.height / 2,
		};
		const {
			width: blockWidth,
			height: blockHeight,
		} = windowBlock;
		const cp = { ...containPositions, };

		if ((x + this.width + padding.fromCap) > canvasWidth) {
			// блок с инфо
			blockCoords.x = x - blockWidth - padding.fromCap;

			cp.top.x = blockCoords.x - radius + padding.fromCap;
			cp.bottom.x = blockCoords.x - radius + padding.fromCap;

			// линия
			cp.line.start.x = x - blockWidth + radius - padding.fromCap + blockWidth - padding.horizontal;
			cp.line.to.x = x - blockWidth + radius - padding.fromCap + blockWidth - padding.horizontal;
		}

		if (blockCoords.y < 0) {
			// блок с инфо
			blockCoords.y = y + padding.vertical;

			cp.top.y = blockCoords.y + padding.vertical + padding.fromCap;
			cp.bottom.y = blockCoords.y + blockHeight / 2 + padding.fromCap + padding.vertical;

			// линия
			cp.line.start.y = blockCoords.y + padding.vertical;
			cp.line.to.y = blockCoords.y + blockHeight / 2 + padding.vertical + padding.fromCap + radius * 2;
		}

		return {
			block: blockCoords,
			contain: cp,
		};
	}
}

export default WindowInfoBlock;