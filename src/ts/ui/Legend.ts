import Text from "./elements/Text";
import Circle from "./elements/Circle";
import Line from "./elements/Line";

import getTextSize from "../helpers/getTextSize";
import getStyleByIndex from "../helpers/getStyleByIndex";
import getTextStr from "../helpers/getTextStr";
import ifTrueThenOrElse from "../helpers/ifTrueThenOrElse";
import defaultParams from "../helpers/defaultParams";

import { IBounds, ISize, IGaps, IPos, } from "../interfaces/global";
import { IData, } from "../interfaces/data";
import { IColumnLegend, ILegendTheme, ILegendGaps, ICircleLegend, IItemLegend, ILegendClass, } from "../interfaces/legend";
import { ILine, ILineTheme, } from "../interfaces/line";
import { IFont, ISpecialFontData, } from "../interfaces/text";
import { TEmptyObject, TLegendPlace, } from "../types/index";

class Legend implements ILegendClass {
	public readonly showLegend: boolean;
	public readonly line: ILine;
	public readonly font: IFont;
	public readonly data: IData;
	public readonly ctx: CanvasRenderingContext2D;
	public readonly bounds: IBounds;
	public readonly circle: ICircleLegend;
	public readonly maxCount: number;
	public readonly legendGaps: ILegendGaps | TEmptyObject;
	public readonly themeForText: ILegendTheme | TEmptyObject;
	public readonly themeForCircle: ILineTheme | TEmptyObject;
	public readonly fontFamily: string;
	public readonly place?: TLegendPlace;
	public height: number;
	public hideGroups: Array<string>;
	public items: Array<IItemLegend>;

	constructor(
		showLegend: boolean,
		data: IData,
		line: ILine,
		ctx: CanvasRenderingContext2D,
		bounds: IBounds,
		font: IFont,
		circle: ICircleLegend,
		hideGroups: Array<string>,
		fontFamily: string,
		place: TLegendPlace,
		legendGaps: ILegendGaps | TEmptyObject = {},
		maxCount = 4,
		themeForText: ILegendTheme | TEmptyObject = {},
		themeForCircle: ILineTheme | TEmptyObject = {}
	) {
		// Позиция легенды
		this.place = place || defaultParams.legend.place;
		// Семейство шрифта
		this.fontFamily = fontFamily;
		// Содержит названия скрытых групп
		this.hideGroups = hideGroups;
		// Если включено, то легенда будет нарисована
		this.showLegend = showLegend;
		// Данные линии
		this.line = line;
		// Данные шрифта
		this.font = font;
		// Содержит данные групп
		this.data = data;
		// Контекст элемента canvas
		this.ctx = ctx;
		// Содержит объект границ диаграммы
		this.bounds = bounds;
		// Данные круга
		this.circle = circle;
		// Максимальное кол-во элементов в одной колонке
		this.maxCount = ifTrueThenOrElse(maxCount > 0, maxCount, 4);
		// Отступы
		this.legendGaps = legendGaps;
		// Стили для текста от темы
		this.themeForText = themeForText;
		// Стили для круга от темы
		this.themeForCircle = themeForCircle;
		// Содержит данные элементов легенды
		this.items = [];
		// Высота легенды
		this.height = 0;
	}

	/**
	 * Определяет максимальную позицию текста по оси ординат
	 * @returns {number}
	 */
	public getMaxPosYAtLegendItems(): number {
		const allYPos: Array<number> = this.items.map(({ y, }) => y);

		return Math.max(...allYPos);
	}

	/**
	 * Определяет размеры у текста групп
	 * @param {Array<IColumnLegend>} column Содержит группы колонки
	 * @private
	 * @returns {Array<IItemLegend>} Группы с их размером текста
	 */
	private _getSizeGroups(column: Array<IColumnLegend>): Array<IItemLegend> {
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.textFont;
		const { size = defaultSize, weight = defaultWeight, } = this.font;

		return column.map((groupItem: IColumnLegend) => {
			const sizes: ISize = getTextSize(size, weight, groupItem.group, this.ctx, this.fontFamily);

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
	private _getHorizontalDistance(groups: Array<IItemLegend>): number {
		if (!groups.length) {
			return 0;
		}

		const { group: gapsGroup, circle: gapsCircle, } = this.legendGaps;
		const { radius, } = this.circle;

		return groups.reduce((acc: number, { width, }) => {
			acc += width + gapsGroup.right + radius * 2 + gapsCircle.right;

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

		const { group: gapsGroup, } = this.legendGaps;
		const height: number = this._getMaxGroupTextHeight(groups);

		return height + gapsGroup.bottom;
	}

	/**
	 * Определяет ширину одной колонки
	 * @param {Array<IItemLegend>} groups Содержит данные групп
	 * @private
	 * @returns {number}
	 */
	private _getWidthColumn(groups: Array<IItemLegend>): number {
		const { group: groupGaps, circle: circleGaps, } = this.legendGaps;
		const { radius, } = this.circle;

		return groups.reduce((acc: number, { width, }, idx: number) => {
			acc += width + circleGaps.right + radius + ifTrueThenOrElse(idx === groups.length - 1, 0, groupGaps.right);

			return acc;
		}, 0);
	}

	/**
	 * Определяет максимальную высоту текста среди групп
	 * @param {Array<IItemLegend>} groups Содержит группы
	 * @private
	 * @returns {number}
	 */
	private _getMaxGroupTextHeight(groups: Array<IItemLegend>): number {
		const heights: Array<number> = groups.map(({ height, }) => height);

		return Math.max(...heights);
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
	 * Определяет позицию текста на оси абсцисс
	 * @param {IBounds} bounds Границы холста
	 * @param {IGaps} gaps Отступы легенды
	 * @param {Array<IItemLegend>} groups Содержит группы колонки
	 * @param {number} gapsCircleRight Отступ справа у круга
	 * @param {number} index Индекс текущей колонки
	 * @private
	 * @returns {number}
	 */
	private _getPosX(bounds: IBounds, gaps: IGaps, groups: Array<IItemLegend>, gapsCircleRight: number, index: number): number {
		const center: number = bounds.width / 2;
		const { radius, } = this.circle;
		const widthColumn: number = this._getWidthColumn(groups);
		const currentGroup: IItemLegend = groups[index];
		const prevGroups: Array<IItemLegend> = groups.filter((grp: IItemLegend, idx: number) => idx < index);
		const nextGroups: Array<IItemLegend> = groups.filter((grp: IItemLegend, idx: number) => idx > index);
		const horizontalDistanceAtPrevGroups: number = this._getHorizontalDistance(prevGroups);
		const horizontalDistanceAtNextGroups: number = this._getHorizontalDistance(nextGroups);
		const horizontalDistanceLeft: number = ifTrueThenOrElse(groups.length === 1, 0, horizontalDistanceAtPrevGroups);
		const horizontalDistanceRight: number = ifTrueThenOrElse(!nextGroups.length, 0, horizontalDistanceAtNextGroups);

		switch (this.place) {
			case "left":
				return bounds.horizontal.start + gaps.left + horizontalDistanceLeft + gapsCircleRight + radius * 2;
			case "center":
				return bounds.horizontal.start + gaps.left + horizontalDistanceLeft + gapsCircleRight + center - widthColumn / 2;
			case "right":
				return (bounds.horizontal.end - currentGroup.width) - (horizontalDistanceRight + gapsCircleRight);
		}
	}

	/**
	 * Рисует текст группы
	 * @param {string} group Содержит текст группы
	 * @param {number} width Ширина текста группы
	 * @param {number} height Высота текста группы
	 * @param {Array<IItemLegend>} groups Содержит группы
	 * @param {number} index Индекс группы
	 * @param {IGaps} gaps Отступы
	 * @private
	 * @returns {IPos} Позиция текста
	 */
	private _drawText(group: string, width: number, height: number, groups: Array<IItemLegend>, index: number, gaps: IGaps): IPos {
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.textFont;
		const bounds: IBounds = this.bounds;
		const { size = defaultSize, weight = defaultWeight, color = this.themeForText.color, } = this.font;
		const { circle: gapsCircle, } = this.legendGaps;
		const font: ISpecialFontData = {
			size,
			color,
			str: getTextStr(size, weight, this.fontFamily),
			text: group,
		};

		const posGroup: IPos = {
			x: this._getPosX(bounds, gaps, groups, gapsCircle.right, index),
			y: bounds.vertical.start + gaps.top + height,
		};

		new Text(
			font,
			this.ctx,
			posGroup.x,
			posGroup.y
		).draw();

		// Перечеркиваем название, если оно есть в скрытых группах
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
	 * @param {Array<string> | string} color Цвет
	 * @private
	 */
	private _drawCircle(x: number, y: number, height: number, color: Array<string> | string): void {
		const { radius, } = this.circle;
		const { circle: gapsCircle, } = this.legendGaps;
		const posCircle: IPos = {
			x: x - (radius + gapsCircle.right),
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
	 * Получает дистанцию между предыдущими колонками и текущей колонкой
	 * @param {Array<IColumnLegend[]>} columns Содержит данные колонок
	 * @param {number} index Индекс текущей колонки
	 * @private
	 * @returns {number} Дистанция
	 */
	private _getDistanceTopFromPrevColumns(columns: Array<IColumnLegend[]>, index: number): number {
		const prevColumns: Array<IColumnLegend[]> = columns.filter((c: Array<IColumnLegend>, i: number) => i < index);

		return prevColumns.reduce((acc: number, prevColumn: Array<IColumnLegend>) => {
			const groups: Array<IItemLegend> = this._getSizeGroups(prevColumn);

			acc += this._getTopDistanceGroups(groups);

			return acc;
		}, 0);
	}

	/**
	 * Рисует легенду
	 * @param {IGaps} gaps Содержит отступы легенды
	 * @returns {ILegendClass}
	 */
	public draw(gaps: IGaps): ILegendClass {
		if (!this.showLegend) {
			return this;
		}

		const { group: groupGaps, } = this.legendGaps;
		const columns: Array<IColumnLegend[]> = this._getColumns();

		columns.map((column: Array<IColumnLegend>, idx: number) => {
			const updateGroups: Array<IItemLegend> = this._getSizeGroups(column);
			const maxHeightGroup: number = this._getMaxGroupTextHeight(updateGroups);
			const gapFromPrevColumns: number = this._getDistanceTopFromPrevColumns(columns, idx);

			// Считаем высоту легенды
			this.height += maxHeightGroup + ifTrueThenOrElse(idx === columns.length - 1, 0, groupGaps.bottom);

			// Рисуем текст и круги
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
		});

		return this;
	}
}

export default Legend;