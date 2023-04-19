import Axis from "./Axis";
import Text from "../elements/Text";

import getTextSize from "../../helpers/getTextSize";
import getRange from "../../helpers/getRange";
import quickSort from "../../helpers/quickSort";
import getTextStr from "../../helpers/getTextStr";
import isFunction from "../../helpers/isFunction";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";
import getRadians from "../../helpers/getRadians";

import { TEmptyObject, TSort, } from "../../types/index";

import { ISpecialFontData, } from "../../interfaces/text";
import { IBounds, ISize, IGaps, IPos, } from "../../interfaces/global";
import { IData, } from "../../interfaces/data";
import { IAxisYClass, IAxisYTitle, IAxisYTitleData, IPointY, } from "../../interfaces/axisY";
import { IFontAxis, IAxisThemePoint, IAxisThemeTitle, } from "../../interfaces/axis";

class AxisY extends Axis implements IAxisYClass {
	public readonly step?: number;
	public readonly editValue?: (value: number) => string | number;
	public readonly data: IData;
	public readonly sortValues?: TSort;
	public titleData?: IAxisYTitleData;

	constructor(
		editValue: (value: number) => string | number,
		data: IData,
		ctx: CanvasRenderingContext2D,
		title: IAxisYTitle | TEmptyObject,
		bounds: IBounds,
		font: IFontAxis | TEmptyObject,
		sortNames: TSort,
		themeForTitle: IAxisThemeTitle | TEmptyObject,
		themeForPoint: IAxisThemePoint | TEmptyObject,
		sortValues: TSort,
		step = 3
	) {
		super(ctx, sortNames, bounds, themeForPoint, themeForTitle, title, font);

		// Шаг, с которым будут рисоваться значения на оси ординат
		this.step = step;
		// Метод, который позволяет изменить вид значения на оси ординат
		this.editValue = editValue;
		// Содержит данные групп
		this.data = data;
		// Тип сортировки точек оси ординат
		this.sortValues = sortValues || "less-more";
		// Содержит дополнительные данные заголовка оси ординат
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
			gaps: { right: null, },
		};
	}

	/**
	 * Определяет корректное значение точки на оси ординат
	 * @param {number} value Значение точки
	 * @private
	 * @returns {string | number} Корректное значение точки
	 */
	private _getCorrectValue(value: number): string | number {
		return isFunction(this.editValue) ? this.editValue(value) : value;
	}

	/**
	 * Рисует заголовок на оси ординат
	 * @returns {IAxisYClass}
	 */
	public drawTitle(): IAxisYClass {
		if (!Object.keys(this.title).length) {
			return this;
		}

		const bounds: IBounds | TEmptyObject = this.bounds;
		const { size, text, color = this.themeForTitle.color, weight = 600, } = this.title.font;
		const font: ISpecialFontData = {
			size,
			text,
			color,
			str: getTextStr(size, weight),
		};

		const sizes: ISize = getTextSize(size, weight, text, this.ctx);
		const startY: number = bounds.vertical.start + sizes.width;
		const endY: number = bounds.vertical.end;
		const posTitle: IPos = {
			x: bounds.horizontal.start + sizes.height,
			y: startY + (endY - startY) / 2,
		};

		new Text(
			font,
			this.ctx,
			posTitle.x,
			posTitle.y,
			null,
			getRadians(-90)
		).draw();

		this.titleData = {
			...this.title as IAxisYTitle,
			...sizes,
			...posTitle,
		};

		return this;
	}

	/**
	 * Определяет точки для оси ординат из диапазона
	 * @param {number} lastValue 
	 * @param {Array<number>} range 
	 * @private
	 * @returns {Array<number>}
	 */
	private _getPointsFromRange(lastValue: number, range: Array<number>): Array<number> {
		const points: Array<number> = [];

		switch (this.sortValues) {
			case "less-more":
				points.push(...range.reverse());
				break;
			case "more-less":
				points.push(...range);
				break;
		}

		if (!points.includes(lastValue)) {
			points.push(lastValue);
		}

		return points;
	}

	/**
	 * Заполняет массив points данными точек оси ординат
	 * @param {Array<number>} values Содержит значения всех точек
	 * @param {boolean} showText Правило, при котором текст будет виден на графике
	 * @param {IBounds} bounds Границы графика
	 * @param {number} size Размер текста
	 * @param {number} weight Жирность текста
	 * @private
	 */
	private _fillDataPoints(values: Array<number>, showText: boolean, bounds: IBounds, size: number, weight: number): void {
		values.map((uValue: number) => {
			const maxValue: IPointY = (quickSort(this.points, "value") as Array<IPointY>).find(({ value, }) => value >= uValue);
			const minValue: IPointY = (quickSort(this.points, "value").reverse() as Array<IPointY>).find(({ value, }) => value <= uValue);
			const textSizes: ISize = getTextSize(size, weight, uValue.toString(), this.ctx);
			const posYItem: IPos = {
				x: ifTrueThenOrElse(showText, bounds.horizontal.start, 0),
				y: minValue.y + (uValue - minValue.value) * ((maxValue.y - minValue.y) / ((maxValue.value - minValue.value) || 1)),
			};

			if (!this.points.find(({ value, }) => value === uValue)) {
				this.points.push({
					value: uValue,
					onScreen: false,
					...posYItem,
					...textSizes,
				});
			}
		});
	}

	/**
	 * Рисует точки на оси ординат
	 * @param {IGaps} gaps Отступы оси ординат
	 * @returns {IAxisYClass}
	 */
	public drawPoints(gaps: IGaps): IAxisYClass {
		const values: Array<number> = this.getAxesData(this.data).values;
		const bounds: IBounds = this.bounds;
		const { size, showText = Boolean(Object.keys(this.font).length), weight = 400, color = this.themeForPoint.color, } = this.font;
		const firstValue: number = Math.ceil(values[0]);
		const lastValue: number = Math.floor(values[values.length - 1]);
		const firstValueSizes: ISize = getTextSize(size, weight, firstValue.toString(), this.ctx);
		const range: Array<number> = getRange(Math.min(firstValue, lastValue), Math.max(firstValue, lastValue), this.step);
		const points: Array<number> = this._getPointsFromRange(lastValue, range);

		points.map((value: number, index: number) => {
			// Содержит размеры значения
			const valueSizes: ISize = getTextSize(size, weight, this._getCorrectValue(value).toString(), this.ctx);
			// Начальная точка для отрисовки элементов
			const startPoint: number = bounds.vertical.start + firstValueSizes.height / 2 + gaps.top;
			// Конечная точка для отрисовки элементов
			const endPoint: number = bounds.vertical.end - firstValueSizes.height / 2 - startPoint - gaps.bottom;
			// Интервал для отрисовки элементов
			const step: number = endPoint / (points.length - 1);
			// Координаты для отрисовки элементов
			const posYItem: IPos = {
				x: bounds.horizontal.start + gaps.left,
				y: step * index + startPoint,
			};
			const font: ISpecialFontData = {
				...this.font,
				color,
				str: getTextStr(size, weight),
				text: this._getCorrectValue(value).toString(),
			};

			// Добавляем данные нарисованных точек в массив
			this.points.push({
				onScreen: true,
				value,
				...valueSizes,
				...posYItem,
			});

			// Отрисовываем значения
			if (showText) {
				new Text(
					font,
					this.ctx,
					posYItem.x,
					posYItem.y + valueSizes.height / 2
				).draw();
			}
		});

		this._fillDataPoints(values, showText, bounds, size, weight);

		return this;
	}

	/**
	 * Определяет максимальную ширину среди всех значений оси ординат
	 * @returns {number} Максимальная ширина значения точки
	 */
	public getMaxTextWidthAtYAxis(): number {
		return Math.max(...this.points.filter(({ onScreen, }) => onScreen).map(({ width, }) => width));
	}
}

export default AxisY;