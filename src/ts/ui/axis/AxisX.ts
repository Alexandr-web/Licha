import Axis from "./Axis";
import Text from "../elements/Text";

import getTextSize from "../../helpers/getTextSize";
import getStyleByIndex from "../../helpers/getStyleByIndex";
import getTextStr from "../../helpers/getTextStr";
import isFunction from "../../helpers/isFunction";

import { TEmptyObject, TSort, } from "../../types/index";

import { ISpecialFontData, } from "../../interfaces/text";
import { IAxisXTitle, IAxisXClass, IAxisXTitleData, } from "../../interfaces/axisX";
import { IBounds, IGaps, ISize, IPos, } from "../../interfaces/global";
import { IData, IDataAtItemData, } from "../../interfaces/data";
import { ILine, ILineTheme, } from "../../interfaces/line";
import { IAxisYTitle, } from "../../interfaces/axisY";
import { IAxisThemePoint, IAxisThemeTitle, IFontAxis, } from "../../interfaces/axis";

class AxisX extends Axis implements IAxisXClass {
	public themeForLine: ILineTheme | TEmptyObject;
	public ignoreNames?: Array<string | number> | ((name: string, index: number) => boolean);
	public data: IData;
	public editName?: (name: string | number) => string;
	public line: ILine;
	public titleData?: IAxisXTitleData;
	public rotate?: boolean;

	constructor(
		ctx: CanvasRenderingContext2D,
		data: IData,
		line: ILine,
		title: IAxisYTitle | IAxisXTitle | TEmptyObject,
		bounds: IBounds,
		font: IFontAxis | TEmptyObject,
		editName: (name: string | number) => string,
		sortNames: TSort,
		rotate: boolean,
		themeForTitle: IAxisThemeTitle | TEmptyObject,
		themeForPoint: IAxisThemePoint | TEmptyObject,
		ignoreNames: Array<string | number> | ((name: string, index: number) => boolean),
		themeForLine: ILineTheme | TEmptyObject = {}
	) {
		super(ctx, sortNames, themeForPoint, themeForTitle, title, bounds, font);

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
		// Содержит дополнительные данные заголовка
		this.titleData = {
			x: null,
			y: null,
			width: null,
			height: null,
			font: {
				text: "",
				size: null,
				color: "",
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
			return this.getAxesData(this.data).names.filter(this.ignoreNames as (name: string, index: number) => boolean);
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

		const { size, weight = 600, color = this.themeForTitle.color, text, } = this.title.font;
		const font: ISpecialFontData = {
			size,
			color,
			text,
			weight,
			str: getTextStr(size, weight),
		};
		const bounds: IBounds | TEmptyObject = this.bounds;
		const sizes: ISize = getTextSize(size, weight, text, this.ctx);
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
	 * Определяет название точки на оси абсцисс
	 * @param {string | number} name Название точки
	 * @private
	 * @returns {string | number} Корректное название точки
	 */
	public getCorrectName(name: string | number): string | number {
		return isFunction(this.editName) ? this.editName(name) : name;
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
		const { size, weight = 400, showText = Boolean(Object.keys(this.font).length), color = this.themeForPoint.color, } = this.font;

		names.map((name: string | number, index: number) => {
			// Начальная точка для отрисовки элементов
			const startPoint: number = bounds.horizontal.start + (gaps.left || 0);
			// Конечная точка для отрисовки элементов
			const endPoint: number = bounds.horizontal.end - (gaps.right || 0) - startPoint;
			// Шаг, с которым отрисовываем элементы
			const step: number = endPoint / (names.length - 1);
			// Содержит размеры названия точки
			const nameSizes: ISize = getTextSize(size, weight, `${this.getCorrectName(name)}`, this.ctx);
			// Координаты элемента для отрисовки
			const posXItem: IPos = {
				x: step * index + startPoint,
				y: bounds.vertical.end - (gaps.bottom || 0),
			};

			// Если это уникальное название присутствует в какой-либо группе,
			// то мы добавляем его вместе с его значением
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

			// Рисуем текст
			if (showText && !ignoreNames.includes(name)) {
				const font: ISpecialFontData = {
					...this.font,
					color,
					str: getTextStr(size, weight),
					text: this.getCorrectName(name).toString(),
				};

				if (this.rotate) {
					new Text(
						font,
						this.ctx,
						posXItem.x + nameSizes.height / 2,
						posXItem.y,
						null,
						-90 * (Math.PI / 180)
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
		});

		this.font.showText = showText;

		return this;
	}

	/**
	 * Определяет наибольшую ширину текста среди точек оси абсцисс
	 * @returns {number}
	 */
	public getMaxWidthTextPoint(): number {
		const names: Array<string | number> = this.getAxesData(this.data).names;
		const { size, weight = 400, } = this.font;
		const widths: Array<number> = names.map((name: string | number) => getTextSize(size, weight, `${this.getCorrectName(name)}`, this.ctx).width);

		return Math.max(...widths);
	}

	/**
	 * Определяет наибольшую ширину текста среди точек оси абсцисс
	 * @returns {number}
	 */
	public getMaxHeightTextPoint(): number {
		const names: Array<string | number> = this.getAxesData(this.data).names;
		const { size, weight = 400, } = this.font;
		const heights: Array<number> = names.map((name: string | number) => getTextSize(size, weight, `${this.getCorrectName(name)}`, this.ctx).height);

		return Math.max(...heights);
	}
}

export default AxisX;