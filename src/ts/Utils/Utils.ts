import light from "./themes/light";
import dark from "./themes/dark";
import colors from "./colors";

import { TEmptyObject, } from "../types/index";

import { IColors, ITheme, IThemes, IUtilsClass, } from "../interfaces/utils";

class Utils implements IUtilsClass {
	public themes: IThemes;
	public colors: IColors;

	constructor() {
		// Содержит светлые и темные темы
		this.themes = { dark, light, };
		// Содержит цвета
		this.colors = colors;
	}

	/**
	 * Определяет тему
	 * @param {number} num Индекс темы
	 * @param {TTypeTheme} type Тип темы ("dark" или "light")
	 * @returns {ITheme | {}} Данные темы
	 */
	public getTheme(num = 0, type = "dark"): ITheme | TEmptyObject {
		if (!this.themes[type] || !this.themes[type][num]) {
			return {};
		}

		return this.themes[type][num];
	}

	/**
	 * Определяет цвет
	 * @param {string} name Название ключа цвета
	 * @param {number} opacity Прозрачность (от 0 до 1)
	 * @returns {string} Цвет
	 */
	public getColor(name: string, opacity = 1): string {
		if (!(this.colors[name] instanceof Function)) {
			return "";
		}

		return this.colors[name](opacity);
	}
}

export default Utils;