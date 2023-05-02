/**
 * Округляет число до "красивого" значения
 * @param {number} num Содержит массив чисел
 * @returns {number}
 */
export default function (num: number): number {
    const count: number = 10 ** (num.toString().length - 1);

    return num % count ? num + count - (num % count) : num;
}