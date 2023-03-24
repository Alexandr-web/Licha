import light from "./themes/light";
import dark from "./themes/dark";
import colors from "./colors";

import "../interfaces/index";
import { TThemes, } from "../types/index";

class Utils {
  public themes: TThemes;
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
   * @param {string} type Тип темы ("dark" или "light")
   * @returns {object} Данные темы
   */
  public getTheme(num: number = 0, type: string = "dark"): ITheme | {} {
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
  public getColor(name: string, opacity: number = 1): string {
    if (!(this.colors[name] instanceof Function)) {
      return "";
    }

    return this.colors[name](opacity);
  }
}

export default Utils;