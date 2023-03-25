import quickSort from "../../helpers/quickSort";

import "../../interfaces/index";
import { TSort, } from "../../types/index";

class Axis implements IAxisClass {
  public ctx: CanvasRenderingContext2D;
  public title: IAxisYTitle | IAxisXTitle;
  public font: IFontAxis;
  public bounds: IBounds;
  public points: Array<IPointX | IPointY>;
  public sortNames: TSort;
  public uniqueNames: Array<string | number>;
  public uniqueValues: Array<number>;
  public readonly gapTopAxisX: number;
  public readonly gapRightAxisY: number;
  public themeForPoint: IAxisThemePoint;
  public themeForTitle: IAxisThemeTitle;

  constructor(
    ctx,
    themeForPoint = {},
    themeForTitle = {},
    title = {},
    bounds = {},
    sortNames = "less-more",
    font = {}
  ) {
    // Контекст элемента canvas
    this.ctx = ctx;
    // Содержит данные заголовка оси
    this.title = title as any;
    // Стили шрифта оси
    this.font = font as any;
    // Содержит границы холста
    this.bounds = bounds as any;
    // Содержит данные точек, находящихся на этой оси
    this.points = [];
    // Тип сортировки точек ("less-more" или "more-less")
    this.sortNames = sortNames;
    // Содержит уникальные названия точек оси абсцисс
    this.uniqueNames = [];
    // Содержит уникальные значения точек оси ординат
    this.uniqueValues = [];
    // Дистанция между осью абсцисс и графиком
    this.gapTopAxisX = 10;
    // Дистанция между осью ординат и графиком
    this.gapRightAxisY = 10;
    // Стили для точек от темы
    this.themeForPoint = themeForPoint as any;
    // Стили для заголовка от темы
    this.themeForTitle = themeForTitle as any;
  }

  /**
   * Сортирует значения и названия (если те имеют тип данных число) групп
   * @param {object} data Содержит данные групп
   * @returns {object}
   */
  public getAxesData(data: IData): IAxesData {
    // Для оси ординат
    const values: Array<number> = [];
    // Для оси абсцисс
    const names: Array<string | number> = [];

    // Добавляем значения и названия в массивы данных осей
    for (const group in data) {
      const groupData: Array<IDataAtItemData> = data[group].data;

      names.push(...groupData.map(({ name, }) => name));
      values.push(...groupData.map(({ value, }) => value));
    }

    const uniqueNames: Array<number | string> = [...new Set(names)];
    const uniqueValues: Array<number> = [...new Set(values)];
    const namesIsNumbers: boolean = !uniqueNames.some((name) => isNaN(+name));
    const sortedValues: Array<number | object> = quickSort(uniqueValues).reverse();
    const sortedNames: Array<string | number | object> = [];

    if (namesIsNumbers) {
      switch (this.sortNames) {
        case "less-more":
          sortedNames.push(...quickSort(uniqueNames as Array<number | object>));
          break;
        case "more-less":
          sortedNames.push(...quickSort(uniqueNames as Array<number | object>).reverse());
          break;
      }
    }

    return {
      values: sortedValues as Array<number>,
      names: namesIsNumbers ? sortedNames : uniqueNames,
    };
  }
}

export default Axis;