import ifTrueThenOrElse from "./ifTrueThenOrElse";

/**
 * Округляет число до "красивого" значения
 * @param {number} num Содержит массив чисел
 * @returns {number}
 */
export default function (num: number): number {
    const n: number = Math.abs(num);
    const count: number = 10 ** (Math.abs(n).toString().length - 1);
    const nextNum: number = n % count ? n + count - (n % count) : n;

    return ifTrueThenOrElse(num < 0, -nextNum, nextNum);
}