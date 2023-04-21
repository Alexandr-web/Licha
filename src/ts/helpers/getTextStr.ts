/**
 * Определяет строку с данными шрифта
 * @param {number} size Размер шрифта
 * @param {number} weight Жирность шрифта
 * @param {string} fontFamily Семейство шрифта
 * @returns {string}
 */
export default (size: number, weight: number, fontFamily: string): string => `${weight} ${size}px ${fontFamily}, sans-serif`;