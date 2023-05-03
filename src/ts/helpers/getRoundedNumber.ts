import ifTrueThenOrElse from "./ifTrueThenOrElse";

/**
 * Округляет число
 * @param {number} n Целое число
 * @param {string} method Метод класса Math, который будет применяться для округления
 * @returns {number}
 */
export default function (n: number, method = "ceil"): number {
    const num: number = Math.abs(n);
    const count: number = 10 ** (num.toString().length - 1);
    const res: number = Math[method](num / count) * count;

    return ifTrueThenOrElse(n < 0, -res, res);
}