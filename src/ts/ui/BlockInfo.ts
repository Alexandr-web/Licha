import Element from "./elements/Element";
import Rect from "./elements/Rect";
import Text from "./elements/Text";
import Line from "./elements/Line";
import CustomFigure from "./elements/CustomFigure";

import quickSort from "../helpers/quickSort";
import getTextSize from "../helpers/getTextSize";
import getTextStr from "../helpers/getTextStr";
import isNumber from "../helpers/isNumber";
import getPaddingObj from "../helpers/getPaddingObj";
import isFunction from "../helpers/isFunction";
import ifTrueThenOrElse from "../helpers/ifTrueThenOrElse";
import defaultParams from "../helpers/defaultParams";

import { ISpecialFontData, } from "../interfaces/text";
import { ITitleBlockInfo, ITriangleData, IBlockInfoClass, IBlockInfoElementWithSize, IBlockInfoElementWithSizeGroup, IBlockInfoThemeGroup, IBlockInfoThemeTitle, IBlockInfoThemeWindow, IGroupsBlockInfo, ITriangleChangedData, } from "../interfaces/blockInfo";
import { ILinePos, ILineTheme, } from "../interfaces/line";
import { IPadding, IPos, ISize, IBounds, } from "../interfaces/global";
import { IData, } from "../interfaces/data";
import { IPointX, } from "../interfaces/axisX";

import { TEmptyObject, TEditValue, TEditName, } from "../types/index";

class BlockInfo extends Element implements IBlockInfoClass {
	public readonly editValue: TEditValue;
	public readonly editName: TEditName;
	public readonly data: IData;
	public readonly bounds: IBounds;
	public readonly elements: Array<IPointX>;
	public readonly padding?: IPadding | TEmptyObject | number;
	public readonly titleData: ITitleBlockInfo;
	public readonly groupsData: IGroupsBlockInfo;
	public readonly groupLineWidth: number;
	public readonly triangleSizes: ISize;
	public readonly title: string | number;
	public readonly themeForWindow: IBlockInfoThemeWindow | TEmptyObject;
	public readonly themeForLine: ILineTheme | TEmptyObject;
	public readonly themeForTitle: IBlockInfoThemeTitle | TEmptyObject;
	public readonly themeForGroup: IBlockInfoThemeGroup | TEmptyObject;
	public readonly fontFamily: string;

	constructor(
		editValue: TEditValue,
		editName: TEditName,
		data: IData,
		bounds: IBounds,
		elements: Array<IPointX>,
		titleData: ITitleBlockInfo,
		groupsData: IGroupsBlockInfo,
		x: number,
		y: number,
		color: string | Array<string>,
		ctx: CanvasRenderingContext2D,
		fontFamily: string,
		padding: IPadding | TEmptyObject | number = 10,
		themeForWindow: IBlockInfoThemeWindow | TEmptyObject = {},
		themeForLine: ILineTheme | TEmptyObject = {},
		themeForTitle: IBlockInfoThemeTitle | TEmptyObject = {},
		themeForGroup: IBlockInfoThemeGroup | TEmptyObject = {}
	) {
		super(x, y, color, ctx);

		// Семейство шрифта
		this.fontFamily = fontFamily;
		// Метод, который изменяет вид значения
		this.editValue = editValue;
		// Метод, который изменяет вид значения
		this.editName = editName;
		// Содержит данные групп
		this.data = data;
		// Содержит границы дигараммы
		this.bounds = bounds;
		// Содержит данные элементов, которые подходят по координатам мыши
		this.elements = elements;
		// Внутренние отступы
		this.padding = ifTrueThenOrElse(isNumber(padding), getPaddingObj(padding as number), padding);
		// Содержит данные заголовка
		this.titleData = titleData;
		// Содержит данные групп
		this.groupsData = groupsData;
		// Ширина линий
		this.groupLineWidth = 6;
		// Размеры треугольника
		this.triangleSizes = {
			height: 10,
			width: 15,
		};
		// Текст заголовка
		this.title = elements[0].name;
		// Стили для окна от темы
		this.themeForWindow = themeForWindow;
		// Стили для линии от темы
		this.themeForLine = themeForLine;
		// Стили для заголовка от темы
		this.themeForTitle = themeForTitle;
		// Стили для группы от темы
		this.themeForGroup = themeForGroup;
	}

	/**
	 * Определяет корректное значение для точки
	 * @param {number} value Значение точки
	 * @private
	 * @returns {string | number}
	 */
	private _getCorrectGroupValue(value: number): string | number {
		return isFunction(this.editValue) ? this.editValue(value) : value;
	}

	/**
	 * Определяет размеры элементов
	 * @private
	 * @returns {Array<IBlockInfoElementWithSize>} Массив, содержащий данные элементов, включая их размеры
	 */
	private _getElementsWithSize(): Array<IBlockInfoElementWithSize> {
		const { size: defaultSizeText, weight: defaultWeightText, } = defaultParams.textFont;
		const { size: defaultSizeTitle, weight: defaultWeightTitle, } = defaultParams.titleFont;

		return this.elements.map(({ group, value, color, }) => {
			const correctGroupValue: string | number = this._getCorrectGroupValue(value);
			const groupName = `${group}: ${correctGroupValue}`;
			const { font: groupsFont = {}, } = this.groupsData;
			const { font: titleFont = {}, } = this.titleData;
			const { size: groupSize = defaultSizeText, weight: groupWeight = defaultWeightText, } = groupsFont;
			const { size: titleSize = defaultSizeTitle, weight: titleWeight = defaultWeightTitle, } = titleFont;

			return {
				group: {
					name: groupName,
					color,
					...getTextSize(groupSize, groupWeight, groupName, this.ctx, this.fontFamily),
				},
				value: {
					name: correctGroupValue.toString(),
					...getTextSize(titleSize, titleWeight, correctGroupValue.toString(), this.ctx, this.fontFamily),
				},
			};
		});
	}

	/**
	 * Определяет позицию окна
	 * @private
	 * @returns {IPos} Позиция окна
	 */
	private _getCoordinates(): IPos {
		return {
			x: this.x + this.triangleSizes.height,
			y: this.y,
		};
	}

	/**
	 * Определяет дистанцию между группами
	 * @param {Array<IBlockInfoElementWithSizeGroup>} elements Содержит данные элементов
	 * @private
	 * @returns {number} Дистанция
	 */
	private _getTopGroupsDistance(elements: Array<IBlockInfoElementWithSizeGroup>): number {
		const { gaps, } = this.groupsData;

		return elements.reduce((acc: number, { height, }, idx: number) => {
			acc += height + ifTrueThenOrElse(idx < elements.length - 1, gaps.bottom, 0);

			return acc;
		}, 0);
	}

	/**
	 * Определяет новую позицию линии, если окно вышло за пределы области графика
	 * @param {number} posX Позиция окна по оси абсцисс
	 * @param {number} blockWidth Ширина окна
	 * @param {IPos} groupPos Позиция группы
	 * @param {IBlockInfoElementWithSizeGroup} group Данные группы
	 * @private
	 * @returns {ILinePos}
	 */
	private _getNewLinesPosIfWindowIsOutOfBoundsWidth(posX: number, blockWidth: number, groupPos: IPos, group: IBlockInfoElementWithSizeGroup): ILinePos {
		return {
			moveTo: {
				x: posX - (blockWidth + this.triangleSizes.height * 2),
				y: groupPos.y - group.height,
			},
			lineTo: [
				{
					x: posX - (blockWidth + this.triangleSizes.height * 2),
					y: groupPos.y,
				}
			],
		};
	}

	/**
	 * Рисует линии
	 * @param {boolean} windowIsOutOfBoundsWidth Правило, согласно которому окно вышло за границы ширины графика
	 * @param {boolean} windowIsOutOfBoundsHeight Правило, согласно которому окно вышло за границы ширины графика
	 * @param {number} blockWidth Ширина окна
	 * @param {number} blockHeight Высота окна
	 * @private
	 */
	private _drawLines(windowIsOutOfBoundsWidth: boolean, windowIsOutOfBoundsHeight: boolean, blockWidth: number, blockHeight: number): void {
		const padding = this.padding as IPadding;
		const { x, } = this._getCoordinates();

		for (let i = 0; i < this.elements.length; i++) {
			const { group, } = this._getElementsWithSize()[i];
			const groupPos: IPos = this._getGroupsCoordinates(i, windowIsOutOfBoundsHeight, blockHeight);
			const posX: number = x + blockWidth - padding.right;

			let linePos: ILinePos = {
				moveTo: {
					x: posX,
					y: groupPos.y - group.height,
				},
				lineTo: [
					{
						x: posX,
						y: groupPos.y,
					}
				],
			};

			if (windowIsOutOfBoundsWidth) {
				linePos = this._getNewLinesPosIfWindowIsOutOfBoundsWidth(posX, blockWidth, groupPos, group);
			}

			new Line(
				linePos.moveTo.x,
				linePos.moveTo.y,
				group.color,
				this.ctx,
				linePos.lineTo,
				this.groupLineWidth
			).draw();
		}
	}

	/**
	 * Определяет размеры заголовка
	 * @private
	 * @returns {ISize} Размеры
	 */
	private _getTitleSize(): ISize {
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		const { font = {}, } = this.titleData;
		const { size = defaultSize, weight = defaultWeight, } = font;

		return getTextSize(size, weight, this.title.toString(), this.ctx, this.fontFamily);
	}

	/**
	 * Рисует заголовок
	 * @param {boolean} windowIsOutOfBoundsWidth Правило, согласно которому окно вышло за границы ширины графика
	 * @param {boolean} windowIsOutOfBoundsHeight Правило, согласно которому окно вышло за границы высоты графика
	 * @param {number} blockWidth Ширина окна
	 * @param {number} blockHeight Высота окна
	 * @private
	 */
	private _drawTitle(windowIsOutOfBoundsWidth: boolean, windowIsOutOfBoundsHeight: boolean, blockWidth: number, blockHeight: number): void {
		const padding = this.padding as IPadding;
		const { height: titleHeight, } = this._getTitleSize();
		const { x, y, } = this._getCoordinates();
		const coordinates: IPos = {
			x: x + padding.left,
			y: y + padding.top + titleHeight,
		};

		if (windowIsOutOfBoundsWidth) {
			coordinates.x -= blockWidth + this.triangleSizes.height * 2;
		}

		if (windowIsOutOfBoundsHeight) {
			coordinates.y -= blockHeight - titleHeight;
		}

		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		const { font: titleFont = {}, } = this.titleData;
		const { size = defaultSize, color = this.themeForTitle.color, weight = defaultWeight, } = titleFont;
		const font: ISpecialFontData = {
			color,
			text: this.title.toString(),
			str: getTextStr(size, weight, this.fontFamily),
		};

		new Text(
			font,
			this.ctx,
			coordinates.x,
			coordinates.y
		).draw();
	}

	/**
	 * Определяет позицию группы
	 * @param {number} index Индекс текущей группы
	 * @param {boolean} windowIsOutOfBoundsHeight Правило, согласно которому окно вышло за границы высоты графика
	 * @param {number} blockHeight Высота окна
	 * @private
	 * @returns {IPos} Позиция группы
	 */
	private _getGroupsCoordinates(index: number, windowIsOutOfBoundsHeight: boolean, blockHeight: number): IPos {
		const { x, y, } = this._getCoordinates();
		const triangleWidth: number = this.triangleSizes.width;
		const { gaps = {}, } = this.titleData;
		const padding = this.padding as IPadding;
		const prevAndCurrentGroup: Array<IBlockInfoElementWithSize> = this._getElementsWithSize().filter((element: IBlockInfoElementWithSize, idx: number) => idx <= index);
		const top: number = this._getTopGroupsDistance(prevAndCurrentGroup.map(({ group: g, }) => g));
		const titleHeight: number = this._getTitleSize().height;
		const pos: IPos = {
			x: x + padding.left,
			y: y + top + padding.top + titleHeight + (gaps.bottom || 0),
		};

		if (windowIsOutOfBoundsHeight) {
			pos.y = y + triangleWidth - top;
		}

		return pos;
	}

	/**
	 * Рисует группы
	 * @param {boolean} windowIsOutOfBoundsWidth Правило, согласно которому окно вышло за границы ширины графика
	 * @param {boolean} windowIsOutOfBoundsHeight Правило, согласно которому окно вышло за границы высоты графика
	 * @param {number} blockWidth Ширина окна
	 * @param {number} blockHeight Высота окна
	 * @private
	 */
	private _drawGroups(windowIsOutOfBoundsWidth: boolean, windowIsOutOfBoundsHeight: boolean, blockWidth: number, blockHeight: number): void {
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.textFont;
		const { font: groupsFont = {}, } = this.groupsData;
		const { size = defaultSize, weight = defaultWeight, color = this.themeForGroup.color, } = groupsFont;

		this._getElementsWithSize().map(({ group, }, index: number) => {
			const font: ISpecialFontData = {
				text: group.name,
				color,
				str: getTextStr(size, weight, this.fontFamily),
			};
			const coordinates: IPos = this._getGroupsCoordinates(index, windowIsOutOfBoundsHeight, blockHeight);

			if (windowIsOutOfBoundsWidth) {
				coordinates.x -= blockWidth + this.triangleSizes.height * 2;
			}

			new Text(
				font,
				this.ctx,
				coordinates.x,
				coordinates.y
			).draw();
		});
	}

	/**
	 * Определяет максимальную ширину среди элементов
	 * @param {Array<IBlockInfoElementWithSize>} elements Содержит данные элементов
	 * @private
	 * @returns {number} Максимальная ширина
	 */
	private _getMaxContentWidth(elements: Array<IBlockInfoElementWithSize>): number {
		const sortGroup = quickSort(elements.map(({ group, }) => group), "width").reverse()[0] as IBlockInfoElementWithSizeGroup;
		const maxGroupWidth: number = sortGroup.width;
		const titleWidth: number = this._getTitleSize().width;

		return Math.max(maxGroupWidth, titleWidth);
	}

	/**
	 * Проверяет вышло ли окно за пределы ширины графика
	 * @param {number} blockWidth Ширина окна
	 * @private
	 * @returns {boolean}
	 */
	private _outOfBoundsWidth(blockWidth: number): boolean {
		return this._getCoordinates().x + blockWidth > this.bounds.width;
	}

	/**
	 * Проверяет вышло ли окно за пределы высоты графика
	 * @param {number} blockHeight Высота окна
	 * @private
	 * @returns {boolean}
	 */
	private _outOfBoundsHeight(blockHeight: number): boolean {
		return this._getCoordinates().y + blockHeight > this.bounds.height;
	}

	/**
	 * Определяет размеры окна
	 * @private
	 * @returns {ISize} Размеры окна
	 */
	private _getWindowSize(): ISize {
		const padding = this.padding as IPadding;
		const { gaps: gapsGroups, } = this.groupsData;
		const { gaps: gapsTitle, } = this.titleData;
		const groups: Array<IBlockInfoElementWithSizeGroup> = this._getElementsWithSize().map(({ group, }) => group);
		const width: number = this._getMaxContentWidth(this._getElementsWithSize()) + padding.right + padding.left + gapsGroups.right + this.groupLineWidth;
		const height: number = this._getTitleSize().height + this._getTopGroupsDistance(groups) + gapsTitle.bottom + padding.bottom + padding.top;

		return { width, height, };
	}

	/**
	 * Определяет новую позицию треугольника, если ширина окна выходит за пределы графика
	 * @param {number} x Позиция окна по оси абсцисс
	 * @param {number} y Позиция окна по оси ординат
	 * @private
	 * @returns {ITriangleChangedData}
	 */
	private _getNewPosTriangleIfWindowIsOutOfBounds(x: number, y: number): ITriangleChangedData {
		return {
			x: x - this.triangleSizes.height,
			y,
			lineTo: [
				{ x, y: y + this.triangleSizes.width / 2, },
				{ x: x - this.triangleSizes.height, y: y + this.triangleSizes.width, }
			],
		};
	}

	/**
	 * Рисует треугольник
	 * @private
	 * @param {boolean} windowIsOutOfBoundsWidth Правило, согласно которому окно вышло за границы ширины графика
	 */
	private _drawTriangle(windowIsOutOfBoundsWidth: boolean): void {
		const x: number = this.x;
		const y: number = this.y;
		const triangleData: ITriangleData = {
			x: x + this.triangleSizes.height,
			y,
			lineTo: [
				{ x, y: y + this.triangleSizes.width / 2, },
				{ x: x + this.triangleSizes.height, y: y + this.triangleSizes.width, }
			],
			startY: y,
			endY: y + this.triangleSizes.width,
		};

		if (windowIsOutOfBoundsWidth) {
			const { x: newX, y: newY, lineTo, } = this._getNewPosTriangleIfWindowIsOutOfBounds(x, y);

			Object.assign(triangleData, { x: newX, y: newY, lineTo, });
		}

		new CustomFigure(
			triangleData.x,
			triangleData.y,
			this.color || this.themeForWindow.color,
			this.ctx,
			triangleData.lineTo,
			triangleData.startY,
			triangleData.endY
		).draw();
	}

	/**
	 * Рисует окно
	 * @param {boolean} windowIsOutOfBoundsWidth Правило, согласно которому окно вышло за границы ширины графика
	 * @param {boolean} windowIsOutOfBoundsHeight Правило, согласно которому окно вышло за границы высоты графика
	 * @param {number} width Ширина окна
	 * @param {number} height Высота окна
	 * @private
	 */
	private _drawWindow(windowIsOutOfBoundsWidth: boolean, windowIsOutOfBoundsHeight: boolean, width: number, height: number): void {
		const coordinates: IPos = this._getCoordinates();

		if (windowIsOutOfBoundsWidth) {
			coordinates.x -= (width + this.triangleSizes.height * 2);
		}

		if (windowIsOutOfBoundsHeight) {
			coordinates.y -= height - this.triangleSizes.width;
		}

		new Rect(
			coordinates.x,
			coordinates.y,
			this.color || this.themeForWindow.color,
			this.ctx,
			width,
			height,
			coordinates.y,
			coordinates.y + height
		).draw();
	}

	// Рисует окно об активной группе
	public init(): void {
		const { width, height, } = this._getWindowSize();
		const windowIsOutOfBoundsWidth: boolean = this._outOfBoundsWidth(width);
		const windowIsOutOfBoundsHeight: boolean = this._outOfBoundsHeight(height);

		this._drawTriangle(windowIsOutOfBoundsWidth);
		this._drawWindow(windowIsOutOfBoundsWidth, windowIsOutOfBoundsHeight, width, height);
		this._drawTitle(windowIsOutOfBoundsWidth, windowIsOutOfBoundsHeight, width, height);
		this._drawGroups(windowIsOutOfBoundsWidth, windowIsOutOfBoundsHeight, width, height);
		this._drawLines(windowIsOutOfBoundsWidth, windowIsOutOfBoundsHeight, width, height);
	}
}

export default BlockInfo;