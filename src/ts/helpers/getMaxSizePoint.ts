import { ISize, } from "../interfaces/global";
import { IFont, } from "../interfaces/text";

import defaultParams from "./defaultParams";
import getTextSize from "./getTextSize";

import { TMethodForCorrectText, } from "../types/index";

/**
 * Определяет самые большие по размерам точки
 * @param {IFont} font Содержит данные шрифта точек
 * @param {Array<number | string>} arrayNamesOrValues Содержит массив названий точек или из значений
 * @param {CanvasRenderingContext2D} ctx Контекст элемента canvas
 * @param {string} fontFamily Семейство шрифтов
 * @param {(text: number | string) => number | string} methodForCorrectText Метод, который будет возвращать правильный и обработанное назание/значение точки
 * @returns {ISize}
 */
export default function (font: IFont, arrayNamesOrValues: Array<number | string>, ctx: CanvasRenderingContext2D, fontFamily: string, methodForCorrectText: TMethodForCorrectText): ISize {
    const { size: defaultSize, weight: defaultWeight, } = defaultParams.textFont;
    const { size = defaultSize, weight = defaultWeight, } = font;
    const heights: Array<number> = arrayNamesOrValues.map((text: string | number) => getTextSize(size, weight, `${methodForCorrectText(text)}`, ctx, fontFamily).height);
    const widths: Array<number> = arrayNamesOrValues.map((text: string | number) => getTextSize(size, weight, `${methodForCorrectText(text)}`, ctx, fontFamily).width);

    return {
        height: Math.max(...heights),
        width: Math.max(...widths),
    };
}