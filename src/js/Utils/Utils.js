import light from "./themes/light";
import dark from "./themes/dark";

class Utils {
  constructor() {
    this.themes = { dark, light, };
  }

  getTheme(num = 0, type = "dark") {
    if (!this.themes[type] || !this.themes[type][num]) {
      return {};
    }

    return this.themes[type][num];
  }
}

export default Utils;