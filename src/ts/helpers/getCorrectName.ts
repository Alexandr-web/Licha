import isFunction from "./isFunction";

/**
 * Определяет правильное название точки
 * @param {string | number} name Название точки
 * @returns {string | number}
 */
export default function (name: string | number): string | number {
    return isFunction(this.editName) ? this.editName(name) : name;
}