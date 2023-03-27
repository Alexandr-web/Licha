import { ITextData, } from "../interfaces/index";
import Text from "../ui/elements/Text";

/**
 * Определяет размеры текста
 * @param {number} size Размер шрифта
 * @param {number} weight Жирность шрифта
 * @param {string} text Текст
 * @param {CanvasRenderingContext2D} ctx Контекст элемента canvas
 * @return {object} Размеры текста ({ width, height })
 */
export default (size: number, weight: number, text: string, ctx: CanvasRenderingContext2D) => {
	const font: ITextData = {
		size,
		str: `${weight} ${size}px Arial, sans-serif`,
		text,
	};

	return new Text(font, ctx).getSizes();
};