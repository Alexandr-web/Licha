import isFunction from "./isFunction";

/**
 * Определяет правильное значение точки
 * @param {number} value Значение точки
 * @returns {number | string}
 */
export default function (value: number): string | number {
    return isFunction(this.editValue) ? this.editValue(value) : value;
}