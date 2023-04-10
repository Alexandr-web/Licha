import getRange from "./getRange";

/**
 * Устанавливает градиент фигуре/линии
 * @param {Array<string>} color Содержит цвета
 * @param {number} startY Начальная позиция по оси ординат
 * @param {number} endY Конечная позиция по оси ординат
 * @param {string} propertyToStyle Свойство, к которому нужно применять градиент
 * @param {CanvasRenderingContext2D} ctx Контекст элемента canvas
 * @param {number} startX Начальная позиция по оси абсцисс
 * @param {number} endX Конечная позиция по оси абсцисс
 */
export default (colors: Array<string>, startY: number, endY: number, propertyToStyle: string, ctx: CanvasRenderingContext2D, startX = 0, endX = 0): void => {
	const grd: CanvasGradient = ctx.createLinearGradient(startX, startY, endX, endY);
	const range: Array<number> = getRange(0, 1, colors.length - 1);

	// Создает градиент
	colors.map((clr, idx) => grd.addColorStop(range[idx], clr));

	ctx[propertyToStyle] = grd;
};