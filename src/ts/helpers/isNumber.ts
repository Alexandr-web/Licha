/**
 * Проверяет тип данных на число
 * @param {any} data Данные
 * @return {boolean}
 */
export default (data: any): boolean => typeof data === "number" && !isNaN(data);