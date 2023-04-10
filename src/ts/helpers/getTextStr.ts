/**
 * Определяет строку с данными шрифта
 * @param {number} size
 * @param {number} weight
 * @param {string}
 */
export default (size: number, weight: number): string => `${weight} ${size}px Arial, sans-serif`;