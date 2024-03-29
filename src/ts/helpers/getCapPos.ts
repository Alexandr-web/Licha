import { ICapCoordinates, } from "../interfaces/cap";
import { TCapType, } from "../types/index";

/**
 * Определяет позицию колпачка в зависимости от его типа
 * @param {TCapType} format Формат колпачка
 * @param {number} x Позиция колпачка по оси абсцисс
 * @param {number} y Позиция колпачка по оси ординат
 * @param {number} size Размер колпачка
 * @returns {ICapCoordinates}
 */
export default (format: TCapType, y: number, x: number, size: number): ICapCoordinates => {
    const hypot = Math.hypot(size, size);

    switch (format) {
        case "triangle":
            return {
                startY: y - size / 2,
                endY: y,
                x: x + size / 2,
                y: y + size / 2,
            };
        case "rhomb":
            return {
                startY: 0,
                endY: size,
                x,
                y: y - hypot / 2,
            };
        case "square":
            return {
                startY: y,
                endY: y + size,
                x: x - size / 2,
                y: y - size / 2,
            };
        default:
            return {
                startY: y - size,
                endY: y + size,
                x,
                y,
            };
    }
};