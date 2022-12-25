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
		new Line({
			color: this.colorLine,
			opacity: 1,
			width: 2,
			moveTo: { x: startX, y: startY, },
			lineTo: [{ x: toX, y: toY, }],
			ctx: this.ctx,
		}).draw();
	}

	/**
	 * Проверка выхода блока за границы канваса
	 * @param {number} x Координата x активной группы
	 * @param {number} y Координата y активной группы
	 * @param {number} capPadding Внутренний отступ
	 * @param {object} containPositions Объект, содержащий позиции элементов блока
	 * @param {number} radius Радиус
	 * @param {number} horizontalPadding Внутренний горизонтальный отступ
	 * @param {number} verticalPadding Внутренний вертикальный отступ
	 * @param {number} canvasWidth Ширина канваса
	 */
	getWindowPosition({
		x,
		y,
		capPadding,
		containPositions,
		windowBlock,
		radius,
		horizontalPadding,
		verticalPadding,
		canvasWidth,
	}) {
		const blockCoords = {
			x: x + capPadding,
			y: y - this.height / 2,
		};
		const {
			width: blockWidth,
			height: blockHeight,
		} = windowBlock;

		if ((x + this.width + capPadding) > canvasWidth) {
			// блок с инфо
			blockCoords.x = x - blockWidth - capPadding;
			containPositions.top.x = blockCoords.x - radius + capPadding;
			containPositions.bottom.x = blockCoords.x - radius + capPadding;

			// линия
			containPositions.line.start.x = x - blockWidth + radius - capPadding + blockWidth - horizontalPadding;
			containPositions.line.to.x = x - blockWidth + radius - capPadding + blockWidth - horizontalPadding;
		}

		if (blockCoords.y < 0) {
			// блок с инфо
			blockCoords.y = y + verticalPadding;
			containPositions.top.y = blockCoords.y + blockHeight / 2 - radius;
			containPositions.bottom.y = blockCoords.y + blockHeight / 2 + radius + verticalPadding;

			// линия
			containPositions.line.start.y = blockCoords.y + verticalPadding;
			containPositions.line.to.y = blockCoords.y + blockHeight / 2 + verticalPadding + capPadding - radius;
		}

		return blockCoords;
	}
}

export default WindowInfoBlock;