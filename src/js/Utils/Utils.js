import light from "./themes/light";
import dark from "./themes/dark";

class Utils {
  constructor() {
    this.themes = { dark, light, };
  }

  getTheme(num = 0) {
    if (!this.themes[num]) {
      return {};
    }

    return this.themes[num];
  }
}

export default Utils;