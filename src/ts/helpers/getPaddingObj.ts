import { IPadding, } from "../interfaces/global";

/**
 * Создает объект внутренних отступов от одного значения
 * @param {number} num Значение отступов
 * @return {IPadding}
 */
export default (num: number): IPadding => ({ top: num, right: num, bottom: num, left: num, });