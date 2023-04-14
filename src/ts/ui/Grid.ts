import CustomFigure from "./elements/CustomFigure";
import Line from "./elements/Line";

import { TEmptyObject, TGridFormat, } from "../types/index";

import isUndefined from "../helpers/isUndefined";
import ifTrueThenOrElse from "../helpers/ifTrueThenOrElse";

import { IPointX, IAxisXClass, } from "../interfaces/axisX";
import { IPointY, IAxisYClass, } from "../interfaces/axisY";
import { IGridClass, ILineGrid, IGridTheme, } from "../interfaces/grid";

class Grid implements IGridClass {
	public maxPointYWidth: number;
	public names: Array<string | number>;
	public ctx: CanvasRenderingContext2D;
	public pointsY: Array<IPointY>;
	public pointsX: Array<IPointX>;
	public showPointsX: boolean;
	public showPointsY: boolean;
	public line?: ILineGrid | TEmptyObject;
	public format?: TGridFormat;
	public theme: IGridTheme | TEmptyObject;
	public background?: string | Array<string>;
	public distanceBetweenLineAndPoint: number;
	public readonly rotateAxisX: boolean;

	constructor(
		ctx: CanvasRenderingContext2D,
		names: Array<string | number>,
		maxPointYWidth: number,
		axisY: IAxisYClass,
		axisX: IAxisXClass,
		background?: string | Array<string>,
		format?: TGridFormat,
		line: ILineGrid | TEmptyObject = {},
		theme: IGridTheme | TEmptyObject = {}
	) {
		// Содержит максимальную ширину текста точки оси ординат
		this.maxPointYWidth = maxPointYWidth;
		// Содержит названия точек оси абсцисс
		this.names = names;
		// Контекст элемента canvas
		this.ctx = ctx;
		// Содержит точки оси ординат
		this.pointsY = axisY.points as Array<IPointY>;
		// Содержит точки оси абсцисс
		this.pointsX = axisX.points as Array<IPointX>;
		// Правило, при котором текст оси абсцисс будет повернут на 90 градусов
		this.rotateAxisX = axisX.rotate;
		// Правило, говорящее, что точки на оси абсцисс будут отрисованы
		this.showPointsX = ifTrueThenOrElse(isUndefined(axisX.font.showText), Boolean(Object.keys(axisX.font).length), axisX.font.showText);
		// Правило, говорящее, что точки на оси ординат будут отрисованы
		this.showPointsY = ifTrueThenOrElse(isUndefined(axisY.font.showText), Boolean(Object.keys(axisY.font).length), axisY.font.showText);
		// Содержит данные линии
		this.line = line;
		// Формат сетки (horizontal или vertical)
		this.format = format || "default";
		// Данные темы
		this.theme = theme;
		// Задний фон сетки
		this.background = background;
		// Дистанция между линией сетки и точкой оси
		this.distanceBetweenLineAndPoint = 5;
	}

	/**
	 * Определяет точки, которые видны на диаграмме
	 * @param {Array<IPointX | IPointY>} points Содержит точки оси
	 * @private
	 * @returns {Array<IPointX | IPointY>}
	 */
	private _getPointsOnScreen(points: Array<IPointX | IPointY>): Array<IPointX | IPointY> {
		return points.filter(({ onScreen, }) => onScreen);
	}

	/**
	 * Рисует задний фон сетке
	 * @private
	 */
	private _drawBackground(): void {
		if (!this.background) {
			return;
		}

		const pointsYOnScreen = this._getPointsOnScreen(this.pointsY) as Array<IPointY>;
		const pointsXOnScreen = this._getPointsOnScreen(this.pointsX) as Array<IPointX>;
		const { x: startX, } = pointsXOnScreen[0];
		const { y: startY, } = pointsYOnScreen[0];
		const { x: endX, } = pointsXOnScreen[pointsXOnScreen.length - 1];
		const { y: endY, } = pointsYOnScreen[pointsYOnScreen.length - 1];

		new CustomFigure(
			startX,
			startY,
			this.background,
			this.ctx,
			[
				{ x: endX, y: startY, },
				{ x: endX, y: endY, },
				{ x: startX, y: endY, },
				{ x: startX, y: startY, }
			],
			startY,
			endY
		).draw();
	}

	/**
	 * Рисует горизонтальные линии
	 * @private
	 * @param {string | Array<string>} color Цвет линии
	 */
	private _drawHorizontalLines(color: string | Array<string>): void {
		const { width, dotted, stretch, } = this.line;
		const pointsYOnScreen: Array<IPointY> = this._getPointsOnScreen(this.pointsY);
		const { x: startX, } = this.pointsX[0];
		const { x: endX, } = this.pointsX[this.pointsX.length - 1];
		const useStretch: boolean = stretch && this.showPointsY;

		// Рисуем линии
		pointsYOnScreen.map(({ y, x, }) => {
			new Line(
				ifTrueThenOrElse(useStretch, x + this.maxPointYWidth + this.distanceBetweenLineAndPoint, startX),
				y,
				color,
				this.ctx,
				[{ x: endX, y, }],
				width,
				dotted
			).draw();
		});
	}

	/**
	 * Рисует вертикальные линии
	 * @private
	 * @param {string | Array<string>} color Цвет линии
	 */
	private _drawVerticalLines(color: string | Array<string>): void {
		const { width, dotted, stretch, } = this.line;
		const axisYOnScreen = this._getPointsOnScreen(this.pointsY) as Array<IPointY>;
		const axisXOnScreen = this._getPointsOnScreen(this.pointsX) as Array<IPointX>;
		const { y: startY, } = axisYOnScreen[0];
		const { y: endYPointX, } = axisXOnScreen[axisXOnScreen.length - 1];
		const { y: endYPointY, } = axisYOnScreen[axisYOnScreen.length - 1];

		// Рисуем линии
		this.names.map((name: string) => {
			const { x, height, width: pointXNameWidth, onScreen, } = this.pointsX.find((axisXDataItem) => axisXDataItem.name === name) as IPointX;
			const useStretch: boolean = stretch && onScreen && this.showPointsX;

			let endYPos = ifTrueThenOrElse(useStretch, endYPointX - (height + this.distanceBetweenLineAndPoint), endYPointY);

			if (this.rotateAxisX && useStretch) {
				endYPos = endYPointX - pointXNameWidth - this.distanceBetweenLineAndPoint;
			}

			new Line(
				x,
				startY,
				color,
				this.ctx,
				[{ x, y: endYPos, }],
				width,
				dotted
			).draw();
		});
	}

	/**
	 * Рисует сетку
	 * @returns {IGridClass}
	 */
	public init(): IGridClass {
		if (!Object.keys(this.line).length) {
			return;
		}

		this._drawBackground();

		const colorLine: string | Array<string> = this.line.color || this.theme.color;

		switch (this.format) {
			case "horizontal":
				this._drawHorizontalLines(colorLine);
				break;
			case "vertical":
				this._drawVerticalLines(colorLine);
				break;
			default:
				this._drawVerticalLines(colorLine);
				this._drawHorizontalLines(colorLine);
		}

		return this;
	}
}

export default Grid;