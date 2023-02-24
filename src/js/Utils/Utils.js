import light from "./themes/light";
import dark from "./themes/dark";

class Utils {
  constructor() {
    // Содержит светлые и темные темы
    this.themes = { dark, light, };
  }

  /**
   * 
   * @param {number} num Индекс темы
   * @param {string} type Тип темы ("dark" или "light")
   * @returns {object} Данные темы
   */
  getTheme(num = 0, type = "dark") {
    if (!this.themes[type] || !this.themes[type][num]) {
      return {};
    }

    return this.themes[type][num];
  }
}

export default Utils;