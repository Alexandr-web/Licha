import Element from "./Element";
import getTextSize from "../../helpers/getTextSize";
import Rect from "./Rect";
import Text from "./Text";
import quickSort from "../../helpers/quickSort";
import Line from "./Line";
import CustomFigure from "./CustomFigure";

import { ISpecialFontData, } from "../../interfaces/text";
import { IActiveElement, ITitleBlockInfo, ITitleBlockInfoGaps, ITriangleData, IBlockInfoClass, IBlockInfoElementWithSize, IBlockInfoElementWithSizeGroup, IBlockInfoThemeGroup, IBlockInfoThemeTitle, IBlockInfoThemeWindow, IGroupsBlockInfo, } from "../../interfaces/blockInfo";
import { ILinePos, ILineTheme, } from "../../interfaces/line";
import { IPadding, IPos, ISize, IBounds, } from "../../interfaces/global";
import { IData, } from "../../interfaces/data";
import { TEmptyObject, } from "../../types/index";

class BlockInfo extends Element implements IBlockInfoClass {
	public editValue: (value: number) => string;
	public editName: (name: number | string) => string;
	public data: IData;
	public bounds: IBounds;
	public elements: Array<IActiveElement>;
	public padding?: IPadding | TEmptyObject;
	public titleData: ITitleBlockInfo;
	public groupsData: IGroupsBlockInfo;
	public readonly groupLineWidth: number;
	public readonly triangleSizes: ISize;
	public title: string;
	public themeForWindow: IBlockInfoThemeWindow;
	public themeForLine: ILineTheme;
	public themeForTitle: IBlockInfoThemeTitle;
	public themeForGroup: IBlockInfoThemeGroup;

	constructor(
		editValue,
		editName,
		data,
		bounds,
		elements,
		titleData,
		groupsData,
		x,
		y,
		color,
		ctx,
		padding = {},
		themeForWindow = {} as IBlockInfoThemeWindow,
		themeForLine = {},
		themeForTitle = {} as IBlockInfoThemeTitle,
		themeForGroup = {} as IBlockInfoThemeGroup
	) {
		super(x, y, color, ctx);

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
		this.padding = padding;
		// Содержит данные заголовка
		this.titleData = titleData;
		// Содержит данные групп
		this.groupsData = groupsData;
		// Ширина линий
		this.groupLineWidth = 5;
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
	 * @returns {string}
	 */
	private _getCorrectGroupValue(value): string {
		return this.editValue instanceof Function ? this.editValue(value) : value;
	}

	/**
	 * Определяет размеры элементов
	 * @private
	 * @returns {Array<IBlockInfoElementWithSize>} Массив, содержащий данные элементов, включая их размеры
	 */
	private _getElementsWithSize(): Array<IBlockInfoElementWithSize> {
		return this.elements.map(({ group, value, color, }) => {
			const correctGroupValue: string | number = this._getCorrectGroupValue(value);
			const groupName = `${group}: ${correctGroupValue}`;
			const { font: groupsFont, } = this.groupsData;
			const { font: titleFont, } = this.titleData;

			return {
				group: {
					name: groupName,
					color,
					...getTextSize(groupsFont.size, groupsFont.weight, groupName, this.ctx),
				},
				value: {
					name: correctGroupValue.toString(),
					...getTextSize(titleFont.size, titleFont.weight, correctGroupValue, this.ctx),
				},
			};
		});
	}

	/**
	 * Определяет позицию окна
	 * @private
	 * @returns {IPos} Позиция окна ({ x, y })
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

		return elements.reduce((acc: number, { height, }) => {
			acc += height + gaps.bottom;

			return acc;
		}, 0);
	}

	/**
	 * Рисует линии
	 * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
	 * @param {number} blockWidth Ширина окна
	 * @private
	 */
	private _drawLines(windowIsOutOfBounds: boolean, blockWidth: number): void {
		const padding: IPadding = this.padding;
		const { x, } = this._getCoordinates();

		for (let i = 0; i < this.elements.length; i++) {
			const { group, } = this._getElementsWithSize()[i];
			const groupPos: IPos = this._getGroupsCoordinates(i);
			const posX: number = x + blockWidth - (padding.right || 0);
			const linePos: ILinePos = {
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

			if (windowIsOutOfBounds) {
				Object.assign(linePos, {
					moveTo: {
						x: posX - (blockWidth + this.triangleSizes.height * 2),
						y: groupPos.y,
					},
					lineTo: [
						{
							x: posX - (blockWidth + this.triangleSizes.height * 2),
							y: groupPos.y - group.height,
						}
					],
				});
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
	 * @returns {ISize} Размеры ({ width, height })
	 */
	private _getTitleSize(): ISize {
		const { font, } = this.titleData;
		const { size, weight, } = font;

		return getTextSize(size, weight, this.title, this.ctx);
	}

	/**
	 * Рисует заголовок
	 * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
	 * @param {number} blockWidth Ширина окна
	 * @private
	 */
	private _drawTitle(windowIsOutOfBounds: boolean, blockWidth: number): void {
		const padding: IPadding = this.padding;
		const { x, y, } = this._getCoordinates();
		const coordinates: IPos = {
			x: x + (padding.left || 0),
			y: y + (padding.top || 0) + this._getTitleSize().height,
		};

		if (windowIsOutOfBounds) {
			coordinates.x -= blockWidth + this.triangleSizes.height * 2;
		}

		const { font: titleFont, } = this.titleData;
		const { size, color = this.themeForTitle.color, weight, } = titleFont;
		const font: ISpecialFontData = {
			color,
			text: this.title,
			str: `${weight} ${size}px Arial, sans-serif`,
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
	 * @private
	 * @returns {IPos} Позиция группы ({ x, y })
	 */
	private _getGroupsCoordinates(index: number): IPos {
		const { x, y, } = this._getCoordinates();
		const { gaps = {} as ITitleBlockInfoGaps, } = this.titleData;
		const padding: IPadding = this.padding;
		const prevGroups: Array<IBlockInfoElementWithSize> = this._getElementsWithSize().filter((element: IBlockInfoElementWithSize, idx: number) => idx <= index);
		const top: number = this._getTopGroupsDistance(prevGroups.map(({ group: g, }) => g));

		return {
			x: x + (padding.left || 0),
			y: y + top + this._getTitleSize().height + (gaps.bottom || 0),
		};
	}

	/**
	 * Рисует группы
	 * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
	 * @param {number} blockWidth Ширина окна
	 * @private
	 */
	private _drawGroups(windowIsOutOfBounds: boolean, blockWidth: number): void {
		const { font: groupsFont, } = this.groupsData;
		const { size, weight, color = this.themeForGroup.color, } = groupsFont;

		this._getElementsWithSize().map(({ group, }, index: number) => {
			const font: ISpecialFontData = {
				text: group.name,
				color,
				str: `${weight} ${size}px Arial, sans-serif`,
			};
			const coordinates: IPos = this._getGroupsCoordinates(index);

			if (windowIsOutOfBounds) {
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
	 * Проверяет на выход окна за границы диаграммы
	 * @param {number} blockWidth Ширина окна
	 * @private
	 * @returns {boolean}
	 */
	private _outOfBounds(blockWidth): boolean {
		return this._getCoordinates().x + blockWidth > this.bounds.width;
	}

	/**
	 * Определяет размеры окна
	 * @private
	 * @returns {ISize} Размеры окна ({ width, height })
	 */
	private _getWindowSize(): ISize {
		const padding: IPadding = this.padding;
		const { gaps: gapsGroups, } = this.groupsData;
		const { gaps: gapsTitle, } = this.titleData;
		const groups: Array<IBlockInfoElementWithSizeGroup> = this._getElementsWithSize().map(({ group, }) => group);
		const width: number = this._getMaxContentWidth(this._getElementsWithSize()) + (padding.right || 0) + (padding.left || 0) + (gapsGroups.right || 0) + this.groupLineWidth;
		const height: number = this._getTitleSize().height + this._getTopGroupsDistance(groups) + (gapsTitle.bottom || 0) + (padding.bottom || 0);

		return { width, height, };
	}

	/**
	 * Рисует треугольник
	 * @private
	 * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
	 */
	private _drawTriangle(windowIsOutOfBounds: boolean): void {
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

		if (windowIsOutOfBounds) {
			Object.assign(triangleData, {
				x: x - this.triangleSizes.height,
				y,
				lineTo: [
					{ x, y: y + this.triangleSizes.width / 2, },
					{ x: x - this.triangleSizes.height, y: y + this.triangleSizes.width, }
				],
			});
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
	 * @param {boolean} windowIsOutOfBounds Правило, говорящее, что окно вышло за границы диаграммы
	 * @param {number} width Ширина окна
	 * @param {number} height Высота окна
	 * @private
	 */
	private _drawWindow(windowIsOutOfBounds: boolean, width: number, height: number): void {
		const coordinates: IPos = this._getCoordinates();

		if (windowIsOutOfBounds) {
			coordinates.x -= (width + this.triangleSizes.height * 2);
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
		const windowIsOutOfBounds: boolean = this._outOfBounds(this._getWindowSize().width);
		const { width, height, } = this._getWindowSize();

		this._drawTriangle(windowIsOutOfBounds);
		this._drawWindow(windowIsOutOfBounds, width, height);
		this._drawTitle(windowIsOutOfBounds, width);
		this._drawGroups(windowIsOutOfBounds, width);
		this._drawLines(windowIsOutOfBounds, width);
	}
}

export default BlockInfo;