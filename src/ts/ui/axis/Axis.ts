import quickSort from "../../helpers/quickSort";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";

import { TSort, TEmptyObject, } from "../../types/index";

import { IAxisClass, IFontAxis, IAxisThemePoint, IAxisThemeTitle, IAxesData, } from "../../interfaces/axis";
import { IAxisYTitle, IPointY, } from "../../interfaces/axisY";
import { IAxisXTitle, IPointX, } from "../../interfaces/axisX";
import { IBounds, } from "../../interfaces/global";
import { IData, IDataAtItemData, } from "../../interfaces/data";

class Axis implements IAxisClass {
  public readonly ctx: CanvasRenderingContext2D;
  public readonly title: IAxisYTitle | IAxisXTitle | TEmptyObject;
  public readonly font: IFontAxis | TEmptyObject;
  public readonly bounds: IBounds;
  public readonly points: Array<IPointX | IPointY>;
  public readonly sortNames: TSort;
  public readonly uniqueNames: Array<string | number>;
  public readonly uniqueValues: Array<number>;
  public readonly gapTopAxisX: number;
  public readonly gapRightAxisY: number;
  public readonly themeForPoint: IAxisThemePoint | TEmptyObject;
  public readonly themeForTitle: IAxisThemeTitle | TEmptyObject;

  constructor(
    ctx: CanvasRenderingContext2D,
    sortNames: TSort,
    bounds: IBounds,
    themeForPoint: IAxisThemePoint | TEmptyObject = {},
    themeForTitle: IAxisThemeTitle | TEmptyObject = {},
    title: IAxisYTitle | IAxisXTitle | TEmptyObject = {},
    font: IFontAxis | TEmptyObject = {}
  ) {
    // Контекст элемента canvas
    this.ctx = ctx;
    // Содержит входные данные заголовка оси
    this.title = title;
    // Стили шрифта оси
    this.font = font;
    // Содержит границы холста
    this.bounds = bounds;
    // Содержит данные точек, находящихся на этой оси
    this.points = [];
    // Тип сортировки точек ("less-more" или "more-less")
    this.sortNames = sortNames || "less-more";
    // Содержит уникальные названия точек оси абсцисс
    this.uniqueNames = [];
    // Содержит уникальные значения точек оси ординат
    this.uniqueValues = [];
    // Дистанция между осью абсцисс и графиком
    this.gapTopAxisX = 10;
    // Дистанция между осью ординат и графиком
    this.gapRightAxisY = 10;
    // Стили для точек от темы
    this.themeForPoint = themeForPoint;
    // Стили для заголовка от темы
    this.themeForTitle = themeForTitle;
  }

  /**
   * Сортирует значения и названия (если те имеют тип данных число) групп
   * @param {IData} data Содержит данные групп
   * @returns {IAxesData}
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
    const namesIsNumbers = !uniqueNames.some((name) => isNaN(+name));
    const sortedValues: Array<number | object> = quickSort(uniqueValues).reverse();
    const sortedNames: Array<string | number> = [];

    if (namesIsNumbers) {
      switch (this.sortNames) {
        case "less-more":
          sortedNames.push(...quickSort(uniqueNames as Array<number>) as Array<number>);
          break;
        case "more-less":
          sortedNames.push(...quickSort(uniqueNames as Array<number>).reverse() as Array<number>);
          break;
      }
    }

    return {
      values: sortedValues as Array<number>,
      names: ifTrueThenOrElse(namesIsNumbers, sortedNames, uniqueNames),
    };
  }
}

export default Axis;