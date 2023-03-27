import Axis from "./Axis";
import Text from "../elements/Text";
import getTextSize from "../../helpers/getTextSize";
import getRange from "../../helpers/getRange";
import quickSort from "../../helpers/quickSort";

import { TEmptyObject, TSort, } from "../../types/index";

import { ISpecialFontData, } from "../../interfaces/text";
import { IBounds, ISize, IGapsForYPoints, IGapsForYTitle, IPos, } from "../../interfaces/global";
import { IData, } from "../../interfaces/data";
import { IAxisYClass, IAxisYTitle, IAxisYTitleData, IPointY, } from "../../interfaces/axisY";

class AxisY extends Axis implements IAxisYClass {
	public step?: number;
	public editValue?: (value: number) => string | number;
	public data: IData;
	public sortValues?: TSort;
	public titleData?: IAxisYTitleData;

	constructor(
		editValue,
		data,
		ctx,
		title,
		bounds,
		font,
		sortNames,
		themeForTitle,
		themeForPoint,
		sortValues,
		step = 3
	) {
		super(ctx, sortNames, themeForPoint, themeForTitle, title, bounds, font);

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
			gapRight: null,
		};
	}

	/**
	 * Определяет корректное значение точки на оси ординат
	 * @param {number} value Значение точки
	 * @private
	 * @returns {string | number} Корректное значение точки
	 */
	private _getCorrectValue(value: number): string | number {
		return this.editValue instanceof Function ? this.editValue(value) : value;
	}

	/**
	 * Рисует заголовок на оси ординат
	 * @param {IGapsForYTitle} gaps Отступы заголовка
	 * @returns {IAxisYClass}
	 */
	public drawTitle(gaps: IGapsForYTitle): IAxisYClass {
		if (!Object.keys(this.title).length) {
			return this;
		}

		const bounds: IBounds | TEmptyObject = this.bounds;
		const { size, text, color = this.themeForTitle.color, weight = 600, } = this.title.font;
		const font: ISpecialFontData = {
			size,
			text,
			color,
			str: `${weight} ${size}px Arial, sans-serif`,
		};
		const sizes: ISize = getTextSize(size, weight, text, this.ctx);
		const startY: number = bounds.vertical.start + sizes.width / 2 + (gaps.top || 0);
		const endY: number = bounds.vertical.end - (gaps.bottom || 0) - sizes.width / 2;
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
			-90 * (Math.PI / 180)
		).draw();

		this.titleData = {
			...this.title as IAxisYTitle,
			...sizes,
			...posTitle,
		};

		return this;
	}

	/**
	 * Рисует точки на оси ординат
	 * @param {IGapsForYPoints} gaps Отступы оси ординат
	 * @returns {IAxisYClass}
	 */
	public drawPoints(gaps: IGapsForYPoints): IAxisYClass {
		const values: Array<number> = this.getAxesData(this.data).values;
		const bounds: IBounds | TEmptyObject = this.bounds;
		const { size, showText = Boolean(Object.keys(this.font).length), weight = 400, color = this.themeForPoint.color, } = this.font;
		const firstValue: number = Math.ceil(values[0]);
		const lastValue: number = Math.floor(values[values.length - 1]);
		const firstValueSizes: ISize = getTextSize(size, weight, firstValue.toString(), this.ctx);
		const range: Array<number> = getRange(Math.min(firstValue, lastValue), Math.max(firstValue, lastValue), this.step);
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

		points.map((value: number, index: number) => {
			// Содержит размеры значения
			const valueSizes: ISize = getTextSize(size, weight, this._getCorrectValue(value).toString(), this.ctx);
			// Начальная точка для отрисовки элементов
			const startPoint: number = bounds.vertical.start + firstValueSizes.height / 2 + (gaps.top || 0);
			// Конечная точка для отрисовки элементов
			const endPoint: number = bounds.vertical.end - startPoint - (gaps.bottom || 0);
			// Интервал для отрисовки элементов
			const step: number = endPoint / (points.length - 1);
			// Координаты для отрисовки элементов
			const posYItem: IPos = {
				x: bounds.horizontal.start + (gaps.left || 0),
				y: step * index + startPoint,
			};
			const font: ISpecialFontData = {
				...this.font,
				color,
				str: `${weight} ${size}px Arial, sans-serif`,
				text: this._getCorrectValue(value).toString(),
			};

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

		values.map((uValue: number) => {
			const maxValue: IPointY = (quickSort(this.points, "value") as Array<IPointY>).find(({ value, }) => value >= uValue);
			const minValue: IPointY = (quickSort(this.points, "value").reverse() as Array<IPointY>).find(({ value, }) => value <= uValue);
			const textSizes: ISize = getTextSize(size, weight, uValue.toString(), this.ctx);
			const posYItem: IPos = {
				x: showText ? bounds.horizontal.start : 0,
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

		this.font.showText = showText;

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