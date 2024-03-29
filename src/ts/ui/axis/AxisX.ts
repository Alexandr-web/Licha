import Axis from "./Axis";
import Text from "../elements/Text";
import { TAxisXPlace, TEmptyObject, TSort, TIgnoreNames, TEditName, TIgnoreNamesFunc, } from "../../types/index";

import getTextSize from "../../helpers/getTextSize";
import getStyleByIndex from "../../helpers/getStyleByIndex";
import getTextStr from "../../helpers/getTextStr";
import isFunction from "../../helpers/isFunction";
import defaultParams from "../../helpers/defaultParams";
import getCorrectName from "../../helpers/getCorrectName";
import getRadians from "../../helpers/getRadians";

import { ISpecialFontData, } from "../../interfaces/text";
import { IAxisXTitle, IAxisXClass, IAxisXTitleData, } from "../../interfaces/axisX";
import { IBounds, IGaps, ISize, IPos, } from "../../interfaces/global";
import { IData, IDataAtItemData, } from "../../interfaces/data";
import { ILine, ILineTheme, } from "../../interfaces/line";
import { IAxisYTitle, } from "../../interfaces/axisY";
import { IAxisThemePoint, IAxisThemeTitle, IFontAxis, } from "../../interfaces/axis";

class AxisX extends Axis implements IAxisXClass {
	public readonly themeForLine: ILineTheme | TEmptyObject;
	public readonly ignoreNames?: TIgnoreNames;
	public readonly data: IData;
	public readonly editName?: TEditName;
	public readonly line: ILine;
	public readonly rotate?: boolean;
	public readonly place?: TAxisXPlace;
	public titleData: IAxisXTitleData;

	constructor(
		ctx: CanvasRenderingContext2D,
		data: IData,
		line: ILine,
		title: IAxisYTitle | IAxisXTitle | TEmptyObject,
		bounds: IBounds,
		font: IFontAxis | TEmptyObject,
		editName: TEditName,
		sortNames: TSort,
		rotate: boolean,
		themeForTitle: IAxisThemeTitle | TEmptyObject,
		themeForPoint: IAxisThemePoint | TEmptyObject,
		ignoreNames: TIgnoreNames,
		place: TAxisXPlace,
		fontFamily: string,
		themeForLine: ILineTheme | TEmptyObject = {}
	) {
		super(ctx, sortNames, bounds, fontFamily, themeForPoint, themeForTitle, title, font);

		// Правило, при котором текст точек оси абсцисс будет повернут на 90 градусов
		this.rotate = rotate;
		// Стили для линии от темы
		this.themeForLine = themeForLine;
		/**
		 * Содержит названия точек оси абсцисс, которые не будут нарисованы на диаграмме
		 * Может быть функцией или массивом
		 */
		this.ignoreNames = ignoreNames || [];
		// Содержит данные групп
		this.data = data;
		// Метод, позволяющий изменить название точки оси абсцисс
		this.editName = editName;
		// Данные линии
		this.line = line;
		// Позиция оси абсцисс
		this.place = place || defaultParams.axisX.place;
		// Содержит дополнительные данные заголовка
		this.titleData = {
			x: null,
			y: null,
			width: null,
			height: null,
			font: {
				text: null,
				size: null,
				color: null,
				weight: null,
			},
			gaps: { top: null, },
		};
	}

	/**
	 * Отбирает названия точек оси абсцисс, которые не будут нарисованы на диаграмме
	 * @returns {Array<string | number>} Названия точек
	 */
	public getIgnoreNames(): Array<string | number> {
		if (isFunction(this.ignoreNames)) {
			return this.getAxesData(this.data).names.filter(this.ignoreNames as TIgnoreNamesFunc);
		}

		if (Array.isArray(this.ignoreNames)) {
			return this.ignoreNames;
		}

		return [];
	}

	/**
	 * Рисует заголовок на оси абсцисс
	 * @returns {IAxisXClass}
	 */
	public drawTitle(): IAxisXClass {
		if (!Object.keys(this.title).length) {
			return this;
		}

		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		const { size = defaultSize, weight = defaultWeight, color = this.themeForTitle.color, text, } = this.title.font;
		const font: ISpecialFontData = {
			size,
			color,
			text,
			weight,
			str: getTextStr(size, weight, this.fontFamily),
		};
		const bounds: IBounds | TEmptyObject = this.bounds;
		const sizes: ISize = getTextSize(size, weight, text, this.ctx, this.fontFamily);
		const startX: number = bounds.horizontal.start;
		const endX: number = bounds.horizontal.end - sizes.width;
		const posTitle: IPos = {
			x: startX + (endX - startX) / 2,
			y: bounds.vertical.end,
		};

		new Text(
			font,
			this.ctx,
			posTitle.x,
			posTitle.y
		).draw();

		this.titleData = {
			...this.title as IAxisXTitle,
			...sizes,
			...posTitle,
		};

		return this;
	}

	/**
	 * Заполняет массив points данными точек оси абсцисс
	 * @param {Array<string | number>} ignoreNames Содержит названия точек, которые не нужно рисовать
	 * @param {IPos} posXItem Содержит позицию точки оси абсцисс
	 * @param {ISize} nameSizes Содержит размеры названия точки
	 * @param {string | number} name Название точки
	 * @private
	 */
	private _fillPointsData(ignoreNames: Array<string | number>, posXItem: IPos, nameSizes: ISize, name: string | number): void {
		for (const group in this.data) {
			const groupData: Array<IDataAtItemData> = this.data[group].data;
			const dataKeys: Array<string> = Object.keys(this.data);
			const idx: number = dataKeys.indexOf(group);
			const colorByTheme = getStyleByIndex(idx, this.themeForLine.color) as string;

			groupData.map((groupDataItem: IDataAtItemData) => {
				if (groupDataItem.name === name) {
					const groupLine: ILine | TEmptyObject = (this.data[group].line || {});

					this.points.push({
						onScreen: !ignoreNames.includes(name),
						name,
						color: (groupLine.color || (this.line || {}).color || groupLine.fill || (this.line || {}).fill) || colorByTheme,
						value: groupDataItem.value,
						group,
						...posXItem,
						...nameSizes,
					});
				}
			});
		}
	}

	/**
	 * Рисует названия точек на оси абсцисс
	 * @param {boolean} showText Правило, при котором название точки будет рисоваться
	 * @param {Array<string | number>} ignoreNames Содержит названия точек, которые не будут рисоваться
	 * @param {string} color Цвет
	 * @param {number} size Размер шрифта
	 * @param {number} weight Жирность шрифта
	 * @param {string | number} name Название точки
	 * @param {IPos} posXItem Позиция точки оси басцисс
	 * @param {ISize} nameSizes Размеры текста названия точки оси абсцисс
	 * @private 
	 */
	private _drawText(showText: boolean, ignoreNames: Array<string | number>, color: string, size: number, weight: number, name: string | number, posXItem: IPos, nameSizes: ISize): void {
		if (showText && !ignoreNames.includes(name)) {
			const font: ISpecialFontData = {
				...this.font,
				color,
				str: getTextStr(size, weight, this.fontFamily),
				text: getCorrectName.call(this, name).toString(),
			};

			if (this.rotate) {
				new Text(
					font,
					this.ctx,
					posXItem.x + nameSizes.height / 2,
					posXItem.y,
					null,
					getRadians(-90)
				).draw();
			} else {
				new Text(
					font,
					this.ctx,
					posXItem.x - nameSizes.width / 2,
					posXItem.y
				).draw();
			}
		}
	}

	/**
	 * Определяет позицию по оси ординат для элементов оси абсцисс
	 * @param {IGaps} gaps Содержит отступы оси абсцисс
	 * @param {number} height Высота названия точки оси абсцисс
	 * @private
	 * @returns {number}
	 */
	private _getYPos(gaps: IGaps, height: number, width: number): number {
		const bounds = this.bounds;

		switch (this.place) {
			case "bottom":
				return bounds.vertical.end - gaps.bottom;
			case "top":
				if (this.rotate) {
					return bounds.vertical.start + width + gaps.top;
				}

				return bounds.vertical.start + height + gaps.top;
		}
	}

	/**
	 * Рисует точки на оси абсцисс
	 * @param {IGaps} gaps Отступы оси абсцисс
	 * @returns {IAxisXClass}
	 */
	public drawPoints(gaps: IGaps): IAxisXClass {
		const names: Array<string | number> = this.getAxesData(this.data).names;
		const bounds: IBounds | TEmptyObject = this.bounds;
		const ignoreNames: Array<string | number> = this.getIgnoreNames();
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.textFont;
		const { size = defaultSize, weight = defaultWeight, showText = true, color = this.themeForPoint.color, } = this.font;

		names.map((name: string | number, index: number) => {
			// Начальная точка для отрисовки элементов
			const startPoint: number = bounds.horizontal.start + gaps.left;
			// Конечная точка для отрисовки элементов
			const endPoint: number = bounds.horizontal.end - gaps.right - startPoint;
			// Шаг, с которым отрисовываем элементы
			const step: number = endPoint / (names.length - 1);
			// Содержит размеры названия точки
			const nameSizes: ISize = getTextSize(size, weight, getCorrectName.call(this, name).toString(), this.ctx, this.fontFamily);
			// Координаты элемента для отрисовки
			const posXItem: IPos = {
				x: step * index + startPoint,
				y: this._getYPos(gaps, nameSizes.height, nameSizes.width),
			};

			// Если это уникальное название присутствует в какой-либо группе,
			// то мы добавляем его вместе с его значением
			this._fillPointsData(ignoreNames, posXItem, nameSizes, name);
			// Рисуем текст
			this._drawText(showText, ignoreNames, color, size, weight, name, posXItem, nameSizes);
		});

		return this;
	}
}

export default AxisX;