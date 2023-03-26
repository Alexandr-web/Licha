import Text from "./elements/Text";
import Circle from "./elements/Circle";
import getTextSize from "../helpers/getTextSize";
import getStyleByIndex from "../helpers/getStyleByIndex";
import Line from "./elements/Line";

import "../interfaces/index";

class Legend implements ILegendClass {
  public hideGroups: Array<string>;
  public showLegend: boolean;
  public line: ILine;
  public font: IFont;
  public data: IData;
  public ctx: CanvasRenderingContext2D;
  public bounds: IBounds;
  public circle: ICircleLegend;
  public maxCount: number;
  public legendGaps: ILegendGaps;
  public totalHeight: number;
  public themeForText: ILegendTheme;
  public themeForCircle: ILineTheme;
  public items: Array<IItemLegend>;

  constructor(showLegend, data, line, ctx, bounds, font, circle, hideGroups, legendGaps = {}, maxCount = 4, themeForText = {}, themeForCircle = {}) {
    // Содержит названия скрытых групп
    this.hideGroups = hideGroups;
    // Если включено, то легенда будет нарисована
    this.showLegend = showLegend;
    // Данные линии
    this.line = line;
    // Данные шрифта
    this.font = font;
    // Содержит данные групп
    this.data = data as any;
    // Контекст элемента canvas
    this.ctx = ctx;
    // Содержит объект границ диаграммы
    this.bounds = bounds;
    // Данные круга
    this.circle = circle;
    // Максимальное кол-во элементов в одной колонке
    this.maxCount = maxCount > 0 ? maxCount : 4;
    // Отступы
    this.legendGaps = legendGaps as any;
    // Высота легенды
    this.totalHeight = 0;
    // Стили для текста от темы
    this.themeForText = themeForText as any;
    // Стили для круга от темы
    this.themeForCircle = themeForCircle as any;
    // Содержит данные элементов легенды
    this.items = [];
  }

  /**
   * Определяет размеры у текста групп
   * @param {Array<IColumnLegend>} groups Содержит группы
   * @private
   * @returns {Array<IItemLegend>} Группы с их размером текста
   */
  private _getSizeGroups(groups: Array<IColumnLegend>): Array<IItemLegend> {
    const { size, weight = 400, } = this.font;

    return groups.map((groupItem: IColumnLegend) => {
      const sizes: ISize = getTextSize(size, weight, groupItem.group, this.ctx);

      return {
        ...sizes,
        ...groupItem,
        x: null,
        y: null,
      };
    });
  }

  /**
   * Определяет дистанцию между группами по горизонтали
   * @param {Array<IItemLegend>} groups Содержит группы
   * @private
   * @returns {number} Общая дистанция
   */
  private _getDistanceGroups(groups: Array<IItemLegend>): number {
    if (!groups.length) {
      return 0;
    }

    const { group: gapsGroup = {}, circle: gapsCircle = {}, } = this.legendGaps;
    const { radius, } = this.circle;

    return groups.reduce((acc: number, { width, }) => {
      acc += width + ((gapsGroup as any).right || 0) + radius * 2 + ((gapsCircle as any).right || 0);

      return acc;
    }, 0);
  }

  /**
   * Определяет дистанцию между группами по вертикали
   * @param {Array<IItemLegend>} groups Содержит группы
   * @private
   * @returns {number} Общая дистанция
   */
  private _getTopDistanceGroups(groups: Array<IItemLegend>): number {
    if (!groups.length) {
      return 0;
    }

    const { group: gapsGroup = {}, } = this.legendGaps as any;
    const { height, } = groups[0];

    return (gapsGroup.bottom || 0) + height;
  }

  /**
   * Определяет колонки относительно текущих групп
   * @private 
   * @returns {Array<IColumnLegend[]>} Колонки
   */
  private _getColumns(): Array<IColumnLegend[]> {
    const columns: Array<IColumnLegend[]> = [];
    const dataKeys: Array<string> = Object.keys(this.data);

    for (let i = 0; i < dataKeys.length; i += this.maxCount) {
      const column: Array<IColumnLegend> = dataKeys
        .map((group: string) => ({ ...this.data[group], group, }))
        .slice(i, i + this.maxCount)
        .map(({ group, line = {}, }) => {
          const idx: number = dataKeys.indexOf(group);
          const colorByTheme = getStyleByIndex(idx, this.themeForCircle.color) as string;
          const colorLine: Array<string> | string = (line.color || (this.line || {}).color || line.fill || (this.line || {}).fill) || colorByTheme;

          return {
            group,
            color: colorLine,
          };
        });

      columns.push(column);
    }

    return columns;
  }

  /**
   * Рисует текст группы
   * @param {string} group Содержит текст группы
   * @param {number} width Ширина текста группы
   * @param {number} height Высота текста группы
   * @param {Array<IItemLegend>} groups Содержит группы
   * @param {number} index Индекс группы
   * @param {IGapsForTextLegend} gaps Отступы
   * @private
   * @returns {IPos} Позиция текста
   */
  private _drawText(group: string, width: number, height: number, groups: Array<IItemLegend>, index: number, gaps: IGapsForTextLegend): IPos {
    const bounds: IBounds = this.bounds;
    const center: number = bounds.width / 2;
    const totalGroupsDistance: number = this._getDistanceGroups(groups);
    const { size, weight = 400, color = this.themeForText.color, } = this.font;
    const font: ISpecialFontData = {
      size,
      color,
      str: `${weight} ${size}px Arial, sans-serif`,
      text: group,
    };

    const prevGroups: Array<IItemLegend> = groups.filter((grp: IItemLegend, idx: number) => idx < index);
    const posGroup: IPos = {
      x: bounds.horizontal.start + (gaps.left || 0) + center - totalGroupsDistance / 2 + this._getDistanceGroups(prevGroups),
      y: bounds.vertical.start + (gaps.top || 0) + height,
    };

    new Text(
      font,
      this.ctx,
      posGroup.x,
      posGroup.y
    ).draw();

    if (this.hideGroups.includes(group)) {
      const endX: number = width + posGroup.x;
      const y: number = posGroup.y - height / 2;

      new Line(posGroup.x, y, color, this.ctx, [{ x: endX, y, }], 2).draw();
    }

    return posGroup;
  }

  /**
   * Рисует круг
   * @param {number} x Позиция по оси абсцисс
   * @param {number} y Позиция по оси ординат
   * @param {number} height Высота
   * @param {string} color Цвет
   * @private
   */
  private _drawCircle(x: number, y: number, height: number, color: Array<string> | string): void {
    const { radius, } = this.circle;
    const { circle = {}, } = this.legendGaps;
    const posCircle: IPos = {
      x: x - radius - ((circle as any).right || 0),
      y: y - Math.max(radius, height / 2),
    };

    new Circle(
      radius,
      posCircle.x,
      posCircle.y,
      color,
      this.ctx,
      1,
      posCircle.y - radius,
      posCircle.y + radius
    ).draw();
  }

  /**
   * Получает дистанцию между предыдущих колонок и текущей колонкой
   * @param {Array<IColumnLegend[]>} columns Содержит данные колонок
   * @param {number} index Индекс текущей колонки
   * @private
   * @returns {number} Дистанция
   */
  private _getDistanceTopFromPrevColumns(columns: Array<IColumnLegend[]>, index: number): number {
    const prevColumns: Array<IColumnLegend[]> = columns.filter((c: Array<IColumnLegend>, i: number) => i < index);

    return prevColumns.reduce((acc: number, prevColumn: Array<IColumnLegend>) => {
      acc += this._getTopDistanceGroups(this._getSizeGroups(prevColumn));

      return acc;
    }, 0);
  }

  /**
   * Рисует легенду
   * @param {IGapsForLegend} gaps Содержит отступы легенды
   * @returns {ILegendClass}
   */
  public draw(gaps: IGapsForLegend): ILegendClass {
    if (!this.showLegend) {
      return this;
    }

    const columns: Array<IColumnLegend[]> = this._getColumns();

    columns.map((groups: Array<IColumnLegend>, idx: number) => {
      const updateGroups: Array<IItemLegend> = this._getSizeGroups(groups);
      const gapFromPrevColumns: number = this._getDistanceTopFromPrevColumns(columns, idx);

      updateGroups.map(({ group, color: colorCap, height, width, }, index: number) => {
        const posGroup: IPos = this._drawText(
          group,
          width,
          height,
          updateGroups,
          index,
          { ...gaps, top: gaps.top + gapFromPrevColumns, }
        );

        this.items.push({ group, ...posGroup, height, width, color: colorCap, });
        this._drawCircle(posGroup.x, posGroup.y, height, colorCap);
      });

      this.totalHeight += this._getTopDistanceGroups(updateGroups);
    });

    return this;
  }
}

export default Legend;