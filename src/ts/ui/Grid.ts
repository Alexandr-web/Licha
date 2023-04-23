import CustomFigure from "./elements/CustomFigure";
import Line from "./elements/Line";

import { TAxisXPlace, TAxisYPlace, TEmptyObject, TGridFormat, } from "../types/index";

import isUndefined from "../helpers/isUndefined";
import ifTrueThenOrElse from "../helpers/ifTrueThenOrElse";
import defaultParams from "../helpers/defaultParams";

import { IPointX, IAxisXClass, } from "../interfaces/axisX";
import { IPointY, IAxisYClass, } from "../interfaces/axisY";
import { IGridClass, ILineGrid, IGridTheme, } from "../interfaces/grid";

class Grid implements IGridClass {
	public readonly maxPointYWidth: number;
	public readonly names: Array<string | number>;
	public readonly ctx: CanvasRenderingContext2D;
	public readonly pointsY: Array<IPointY>;
	public readonly pointsX: Array<IPointX>;
	public readonly showPointsX: boolean;
	public readonly showPointsY: boolean;
	public readonly line?: ILineGrid | TEmptyObject;
	public readonly format?: TGridFormat;
	public readonly theme: IGridTheme | TEmptyObject;
	public readonly background?: string | Array<string>;
	public readonly distanceBetweenLineAndPoint: number;
	public readonly placeAxisX: TAxisXPlace;
	public readonly rotateAxisX: boolean;
	public readonly placeAxisY: TAxisYPlace;

	constructor(
		ctx: CanvasRenderingContext2D,
		names: Array<string | number>,
		maxPointYWidth: number,
		axisY: IAxisYClass,
		axisX: IAxisXClass,
		background: string | Array<string>,
		format: TGridFormat,
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
		// Позиция оси абсцисс
		this.placeAxisX = axisX.place || defaultParams.axisX.place;
		// Позиция оси ординат
		this.placeAxisY = axisY.place || defaultParams.axisY.place;
		// Правило, при котором текст оси абсцисс будет повернут на 90 градусов
		this.rotateAxisX = axisX.rotate;
		// Правило, говорящее, что точки на оси абсцисс будут отрисованы
		this.showPointsX = ifTrueThenOrElse(isUndefined(axisX.font.showText), Boolean(Object.keys(axisX.font).length), axisX.font.showText);
		// Правило, говорящее, что точки на оси ординат будут отрисованы
		this.showPointsY = ifTrueThenOrElse(isUndefined(axisY.font.showText), Boolean(Object.keys(axisY.font).length), axisY.font.showText);
		// Содержит данные линии
		this.line = line;
		// Формат сетки
		this.format = format || defaultParams.grid.format;
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

		const pointsY: Array<IPointY> = this.pointsY;
		const pointsX: Array<IPointX> = this.pointsX;
		const { x: startX, } = pointsX[0];
		const { y: startY, } = pointsY[0];
		const { x: endX, } = pointsX[pointsX.length - 1];
		const { y: endY, } = pointsY[pointsY.length - 1];

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
	 * Определяет начальную и конечную позиции для горизонтальных линий сетки
	 * @param {boolean} useStretch Правило, при котором используется правило stretch
	 * @param {number} posXAtPointY Позиция элемента оси ординат на оси абсцисс
	 * @param {number} startX Позиция первого элемента оси ординат на оси абсцисс
	 * @param {number} endX Позиция последнего оси ординат на оси абсцисс
	 * @param {number} minPosXBetweenPointsY Минимальная позиция на оси абсцисс среди всех элементов оси ординат
	 * @private
	 * @returns {{ start: number, end: number, }}
	 */
	private _getXPositionsForHorizontalLines(useStretch: boolean, posXAtPointY: number, startX: number, endX: number, minPosXBetweenPointsY: number): { start: number, end: number, } {
		const defaultPos = {
			start: startX,
			end: endX,
		};

		switch (this.placeAxisY) {
			case "left":
				if (useStretch) {
					return {
						start: posXAtPointY + this.maxPointYWidth + this.distanceBetweenLineAndPoint,
						end: endX,
					};
				}

				return defaultPos;
			case "right":
				if (useStretch) {
					return {
						start: startX,
						end: minPosXBetweenPointsY - this.distanceBetweenLineAndPoint,
					};
				}

				return defaultPos;
		}
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
		const minPosXBetweenPointsY: number = Math.min(...pointsYOnScreen.map(({ x, }) => x));

		// Рисуем линии
		pointsYOnScreen.map(({ y, x, }) => {
			const { start, end, } = this._getXPositionsForHorizontalLines(useStretch, x, startX, endX, minPosXBetweenPointsY);

			new Line(
				start,
				y,
				color,
				this.ctx,
				[{ x: end, y, }],
				width,
				dotted
			).draw();
		});
	}

	/**
	 * Определяет конечную позицию по оси ординат вертикальной линии
	 * @param {number} useStretch Правило, при котором используется правило stretch
	 * @param {number} yPointX Позиция по оси ординат элемента оси абсцисс
	 * @param {number} height Высота элемента оси абсцисс
	 * @param {number} endYPointY Позиция по оси ординат последнего элемента оси ординат
	 * @param {number} pointXNameWidth Ширина названия точки оси абсцисс
	 * @param {number} startYPointY Позиция по оси ординат первого элемента оси ординат
	 * @private
	 * @returns {number}
	 */
	private _getEndYPosForVerticalLines(useStretch: boolean, yPointX: number, height: number, endYPointY: number, pointXNameWidth: number, startYPointY: number): number {
		switch (this.placeAxisX) {
			case "bottom":
				if (this.rotateAxisX && useStretch) {
					return yPointX - pointXNameWidth - this.distanceBetweenLineAndPoint;
				}

				return ifTrueThenOrElse(useStretch, yPointX - (height + this.distanceBetweenLineAndPoint), endYPointY);
			case "top":
				if (this.rotateAxisX && useStretch) {
					return yPointX + this.distanceBetweenLineAndPoint;
				}

				return ifTrueThenOrElse(useStretch, yPointX + this.distanceBetweenLineAndPoint, startYPointY);
		}
	}

	/**
	 * Рисует вертикальные линии
	 * @private
	 * @param {string | Array<string>} color Цвет линии
	 */
	private _drawVerticalLines(color: string | Array<string>): void {
		const { width, dotted, stretch, } = this.line;
		const axisYOnScreen = this._getPointsOnScreen(this.pointsY) as Array<IPointY>;
		const { y: startYPointY, } = axisYOnScreen[0];
		const { y: endYPointY, } = axisYOnScreen[axisYOnScreen.length - 1];

		// Рисуем линии
		this.names.map((name: string) => {
			const { x, height, width: pointXNameWidth, onScreen, y: yPointX, } = this.pointsX.find((axisXDataItem) => axisXDataItem.name === name) as IPointX;
			const useStretch: boolean = stretch && onScreen && this.showPointsX;
			const endYPos = this._getEndYPosForVerticalLines(useStretch, yPointX, height, endYPointY, pointXNameWidth, startYPointY);

			new Line(
				x,
				ifTrueThenOrElse(this.placeAxisX === "top", endYPointY, startYPointY),
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
			case "default":
				this._drawVerticalLines(colorLine);
				this._drawHorizontalLines(colorLine);
		}

		return this;
	}
}

export default Grid;