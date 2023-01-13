import Axis from "./Axis";
import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";

class AxisX extends Axis {
  constructor(
    ctx,
    data,
    line,
    title,
    bounds,
    font,
    ignoreNames = []
  ) {
    super(ctx, line, title, bounds, font);

    this.ignoreNames = ignoreNames;
    this.data = data;
  }

  drawTitle(align, gaps) {
    if (!Object.keys(this.title).length) {
      return this;
    }

    const font = {
      ...this.title.font,
      str: `400 ${this.title.font.size}px Arial, sans-serif`,
    };
    const sizes = new Text(font, this.ctx).getSizes();
    const posTitle = {
      x: null,
      y: this.bounds.vertical.end,
    };

    switch (align) {
      case "left":
        posTitle.x = this.bounds.horizontal.start + gaps.left;
        break;
      case "center":
        posTitle.x = this.bounds.horizontal.start + this.bounds.width / 2 - sizes.width / 2;
        break;
      case "right":
        posTitle.x = this.bounds.horizontal.end - sizes.width / 2;
        break;
    }

    new Text(
      font,
      this.ctx,
      ...Object.values(posTitle),
      undefined,
      0,
      1
    ).draw();

    this.title = {
      ...this.title,
      ...sizes,
      ...posTitle,
    };

    return this;
  }

  drawPoints(gaps) {
    const names = this.getAxesData(this.data).names;
    const bounds = this.bounds;
    const { size, weight = 400, showText, } = this.font;

    names.map((name, index) => {
      // Начальная точка для отрисовки элементов
      const startPoint = bounds.horizontal.start + (gaps.left || 0);
      // Конечная точка для отрисовки элементов
      const endPoint = bounds.horizontal.end - (gaps.right || 0) - startPoint;
      // Шаг, с которым отрисовываем элементы
      const step = endPoint / (names.length - 1);
      // Содержит размеры названия
      const nameSizes = getTextSize(size, weight, name, this.ctx);
      // Координаты элемента для отрисовки
      const posXItem = {
        x: step * index + startPoint,
        y: bounds.vertical.end - (gaps.bottom || 0),
      };

      // Если это уникальное название присутствует в какой-либо группе,
      // то мы добавляем его вместе с его значением в массив this.axisXData
      for (const group in this.data) {
        const groupData = this.data[group].data;

        groupData.map((groupDataItem) => {
          if (groupDataItem.name === name) {
            this.points.push({
              name,
              value: groupDataItem.value,
              group,
              ...posXItem,
              ...nameSizes,
            });
          }
        });
      }

      // Рисуем текст
      if (showText !== undefined ? showText : Object.keys(this.font).length && !this.ignoreNames.includes(name)) {
        new Text(
          { ...this.font, str: `${weight} ${size}px Arial, sans-serif`, text: name, },
          this.ctx,
          posXItem.x - nameSizes.width / 2,
          posXItem.y,
          undefined,
          0,
          1
        ).draw();
      }
    });

    return this;
  }
}

export default AxisX;