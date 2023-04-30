import { ISpecialFontData, } from "../interfaces/text";
import { ISize, } from "../interfaces/global";

import Text from "../ui/elements/Text";
import getTextStr from "./getTextStr";

/**
 * Определяет размеры текста
 * @param {number} size Размер шрифта
 * @param {number} weight Жирность шрифта
 * @param {string} text Текст
 * @param {CanvasRenderingContext2D} ctx Контекст элемента canvas
 * @param {string} fontFamily Семейство шрифта
 * @returns {ISize} Размеры текста
 */
export default (size: number, weight: number, text: string, ctx: CanvasRenderingContext2D, fontFamily: string): ISize => {
	const font: ISpecialFontData = {
		size,
		str: getTextStr(size, weight, fontFamily),
		text,
	};

	return new Text(font, ctx).getSizes();
};