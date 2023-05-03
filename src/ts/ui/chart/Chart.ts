import Text from "../elements/Text";

import isNumber from "../../helpers/isNumber";
import getTextStr from "../../helpers/getTextStr";
import getTextSize from "../../helpers/getTextSize";
import getPaddingObj from "../../helpers/getPaddingObj";
import ifTrueThenOrElse from "../../helpers/ifTrueThenOrElse";
import defaultParams from "../../helpers/defaultParams";

import { TEmptyObject, TTypeChart, } from "../../types/index";

import { IBounds, IPadding, IPos, ISize, } from "../../interfaces/global";
import { IChartClass, IChartTitle, IChartTitleData, ITitleTheme, } from "../../interfaces/chart";
import { IData, } from "../../interfaces/data";
import { ISpecialFontData, } from "../../interfaces/text";

class Chart implements IChartClass {
	public readonly padding: IPadding | TEmptyObject | number;
	public readonly data: IData;
	public readonly ctx: CanvasRenderingContext2D;
	public readonly width: number;
	public readonly height: number;
	public readonly title: IChartTitle | TEmptyObject;
	public readonly type: TTypeChart;
	public readonly defaultPadding: number;
	public readonly hideGroups: Array<string>;
	public readonly theme: ITitleTheme | TEmptyObject;
	public readonly fontFamily: string;
	public titleData: IChartTitleData;

	constructor(
		padding: IPadding | TEmptyObject | number,
		data: IData,
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number,
		type: TTypeChart,
		title: IChartTitle | TEmptyObject,
		fontFamily: string,
		theme: ITitleTheme | TEmptyObject = {},
		hideGroups: Array<string> = []
	) {
		// Семейство шрифта
		this.fontFamily = fontFamily;
		// Содержит скрытые группы
		this.hideGroups = hideGroups;
		// Содержит стили от темы
		this.theme = theme;
		// Содержит данные групп
		this.data = data;
		// Ширина элемента canvas
		this.width = width;
		// Высота элемента canvas
		this.height = height;
		// Контекст элемента canvas
		this.ctx = ctx;
		// Тип диаграммы
		this.type = type;
		// Заголовок диаграммы
		this.title = title || {};
		// Внутренние отступы диаграммы
		this.padding = ifTrueThenOrElse(isNumber(padding), getPaddingObj(padding as number), padding);
		// Внутренний отступ по умолчанию
		this.defaultPadding = 10;
		// Содержит дополнительные данные заголовка диаграммы
		this.titleData = {
			font: {
				text: null,
				size: null,
				color: null,
				weight: null,
			},
			gaps: { bottom: null, },
			x: null,
			y: null,
			width: null,
			height: null,
		};
	}

	/**
	 * Определяет границы диаграммы
	 * @returns {IBounds} Границы
	 */
	public getBounds(): IBounds {
		const padding = this.padding as IPadding;
		const bounds: IBounds = {
			width: null,
			height: null,
			horizontal: {
				start: ifTrueThenOrElse(isNumber(padding.left), padding.left, this.defaultPadding),
				end: this.width - ifTrueThenOrElse(isNumber(padding.right), padding.right, this.defaultPadding),
			},
			vertical: {
				start: ifTrueThenOrElse(isNumber(padding.top), padding.top, this.defaultPadding),
				end: this.height - ifTrueThenOrElse(isNumber(padding.bottom), padding.bottom, this.defaultPadding),
			},
		};

		bounds.width = bounds.horizontal.end - bounds.horizontal.start;
		bounds.height = bounds.vertical.end - bounds.vertical.start;

		return bounds;
	}

	/**
	 * Определяет позицию заголовка по оси абсцисс
	 * @param {ISize} sizes Размеры текста заголовка
	 * @private
	 * @returns {number}
	 */
	private _getPosXForTitle(sizes: ISize): number {
		const bounds: IBounds = this.getBounds();
		const { place: defaultPlace, } = defaultParams.chartTitle;
		const { place = defaultPlace, } = this.title;
		const startX: number = bounds.horizontal.start;
		const endX: number = bounds.horizontal.end - sizes.width;

		switch (place) {
			case "left":
				return startX;
			case "center":
				return startX + (endX - startX) / 2;
			case "right":
				return endX;
		}
	}

	/**
	 * Рисует заголовок диаграммы
	 * @returns {IChartClass}
	 */
	public drawTitle(): IChartClass {
		if (!Object.keys(this.title).length) {
			return this;
		}

		const { size: defaultSize, weight: defaultWeight, } = defaultParams.titleFont;
		const { weight = defaultWeight, size = defaultSize, text, color = this.theme.color, } = this.title.font;
		const font: ISpecialFontData = { color, text, str: getTextStr(size, weight, this.fontFamily), };
		const sizes: ISize = getTextSize(size, weight, text, this.ctx, this.fontFamily);
		const bounds: IBounds = this.getBounds();
		const posText: IPos = {
			x: this._getPosXForTitle(sizes),
			y: bounds.vertical.start + sizes.height,
		};

		new Text(
			font,
			this.ctx,
			posText.x,
			posText.y
		).draw();

		this.titleData = {
			...this.title as IChartTitle,
			...posText,
			...sizes,
		};

		return this;
	}
}

export default Chart;