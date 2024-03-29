import Axis from "./Axis";
import Text from "../elements/Text";
import { TAxisYPlace, TEmptyObject, TSort, TEditValue, } from "../../types/index";

import getTextSize from "../../helpers/getTextSize";
import getRange from "../../helpers/getRange";
import quickSort from "../../helpers/quickSort";
import getTextStr from "../../helpers/getTextStr";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";
import getRadians from "../../helpers/getRadians";
import defaultParams from "../../helpers/defaultParams";
import getRoundedNumber from "../../helpers/getRoundedNumber";
import getCorrectValue from "../../helpers/getCorrectValue";

import { ISpecialFontData, } from "../../interfaces/text";
import { IBounds, ISize, IGaps, IPos, } from "../../interfaces/global";
import { IData, } from "../../interfaces/data";
import { IAxisYClass, IAxisYTitle, IAxisYTitleData, IPointY, } from "../../interfaces/axisY";
import { IFontAxis, IAxisThemePoint, IAxisThemeTitle, } from "../../interfaces/axis";

class AxisY extends Axis implements IAxisYClass {
	public readonly step?: number;
	public readonly editValue?: TEditValue;
	public readonly data: IData;
	public readonly sortValues?: TSort;
	public readonly place?: TAxisYPlace;
	public titleData?: IAxisYTitleData;

	constructor(
		editValue: TEditValue,
		data: IData,
		ctx: CanvasRenderingContext2D,
		title: IAxisYTitle | TEmptyObject,
		bounds: IBounds,
		font: IFontAxis | TEmptyObject,
		sortNames: TSort,
		themeForTitle: IAxisThemeTitle | TEmptyObject,
		themeForPoint: IAxisThemePoint | TEmptyObject,
		sortValues: TSort,
		fontFamily: string,
		place: TAxisYPlace,
		step = 3
	) {
		super(ctx, sortNames, bounds, fontFamily, themeForPoint, themeForTitle, title, font);

		// Шаг, с которым будут рисоваться значения на оси ординат
		this.step = Math.floor(step);
		// Метод, который позволяет изменить вид значения на оси ординат
		this.editValue = editValue;
		// Содержит данные групп
		this.data = data;
		// Тип сортировки точек оси ординат
		this.sortValues = sortValues || defaultParams.axisY.sort;
		// Позиция оси ординат
		this.place = place || defaultParams.axisY.place;
		// Содержит дополнительные данные заголовка оси ординат
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
			gaps: { right: null, },
		};
	}

	/**
	 * Рисует заголовок на оси ординат
	 * @param {IGaps} gaps Отступы заголовка
	 * @returns {IAxisYClass}
	 */
	public drawTitle(gaps: IGaps): IAxisYClass {
		if (!Object.keys(this.title).length) {
			return this;
		}

		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		const bounds: IBounds | TEmptyObject = this.bounds;
		const { size = defaultSize, text, color = this.themeForTitle.color, weight = defaultWeight, } = this.title.font;
		const font: ISpecialFontData = {
			size,
			text,
			color,
			str: getTextStr(size, weight, this.fontFamily),
		};

		const sizes: ISize = getTextSize(size, weight, text, this.ctx, this.fontFamily);
		const startY: number = bounds.vertical.start + sizes.width + gaps.top;
		const endY: number = bounds.vertical.end - gaps.bottom;
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
	 * @param {Array<number>} range 
	 * @private
	 * @returns {Array<number>}
	 */
	private _getPointsFromRange(range: Array<number>): Array<number> {
		switch (this.sortValues) {
			case "less-more":
				return range.reverse();
			case "more-less":
				return range;
		}
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
			const correctValue: string = getCorrectValue.call(this, uValue).toString();
			const maxValue: IPointY = (quickSort(this.points, "value") as Array<IPointY>).find(({ value, }) => value >= uValue);
			const minValue: IPointY = (quickSort(this.points, "value").reverse() as Array<IPointY>).find(({ value, }) => value <= uValue);
			const textSizes: ISize = getTextSize(size, weight, correctValue, this.ctx, this.fontFamily);
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
	 * Определяет позицию по оси абсцисс точек оси ординат
	 * @param {IBounds} bounds Содержит границы холста
	 * @param {IGaps} gaps Содержит отступы оси ординат
	 * @param {number} width Ширина точки оси ординат
	 * @private
	 * @returns {number}
	 */
	private _getPosXForPoints(bounds: IBounds, gaps: IGaps, width: number): number {
		switch (this.place) {
			case "left":
				return bounds.horizontal.start + gaps.left;
			case "right":
				return bounds.horizontal.end - width;
		}
	}

	/**
	 * Рисует точки на оси ординат
	 * @param {IGaps} gaps Отступы оси ординат
	 * @returns {IAxisYClass}
	 */
	public drawPoints(gaps: IGaps): IAxisYClass {
		const values: Array<number> = this.getAxesData(this.data).values;
		const bounds: IBounds = this.bounds;
		const { size: defaultSize, weight: defaultWeight, } = defaultParams.textFont;
		const { size = defaultSize, showText = true, weight = defaultWeight, color = this.themeForPoint.color, } = this.font;
		const firstValue: number = Math.ceil(values[0]);
		const lastValue: number = Math.floor(values[values.length - 1]);
		const minValue: number = Math.min(firstValue, lastValue);
		const maxValue: number = Math.max(firstValue, lastValue);
		const methodToRoundMinValue: string = ifTrueThenOrElse(minValue < 0, "ceil", "floor");
		const methodToRoundMaxValue: string = ifTrueThenOrElse(maxValue < 0, "floor", "ceil");
		const range: Array<number> = getRange(getRoundedNumber(minValue, methodToRoundMinValue), getRoundedNumber(maxValue, methodToRoundMaxValue), this.step);
		const points: Array<number> = this._getPointsFromRange(range);

		points.map((value: number, index: number) => {
			const correctValue: string = getCorrectValue.call(this, value).toString();
			// Содержит размеры значения
			const valueSizes: ISize = getTextSize(size, weight, correctValue, this.ctx, this.fontFamily);
			// Начальная точка для отрисовки элементов
			const startPoint: number = bounds.vertical.start + valueSizes.height / 2 + gaps.top;
			// Конечная точка для отрисовки элементов
			const endPoint: number = bounds.vertical.end - valueSizes.height / 2 - startPoint - gaps.bottom;
			// Интервал для отрисовки элементов
			const step: number = endPoint / (points.length - 1);
			// Координаты для отрисовки элементов
			const posYItem: IPos = {
				x: this._getPosXForPoints(bounds, gaps, valueSizes.width),
				y: step * index + startPoint,
			};
			const font: ISpecialFontData = {
				...this.font,
				color,
				str: getTextStr(size, weight, this.fontFamily),
				text: correctValue,
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

		// Добавляем остальные точки в массив, не рисуя их
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