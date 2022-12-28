import Text from "./ui/Text";
import Rect from "./ui/Rect";
import Line from "./ui/Line";
import Cap from "./ui/Cap";
import WindowInfoBlock from "./ui/WindowInfoBlock";

class aCharty {
	constructor({
		canvasSelector,
		background,
		data = {},
		line = {},
		cap = {},
		axisY = {},
		axisX = {},
		title = {},
		updateWhenResizing = true,
		stepped = false,
		padding = {
			top: 10,
			left: 10,
			right: 10,
			bottom: 10,
		},
	}) {
		// Объект с данными названия диаграммы
		this.title = title;
		// Правило, которое будет обновлять график при изменении экрана
		this.updateWhenResizing = updateWhenResizing;
		// Правило, которое будет рисовать линию пошагово
		this.stepped = stepped;
		// Объект с данными абсциссы
		this.axisX = axisX;
		// Объект с данными ординаты
		this.axisY = axisY;
		// Задний фон графика
		this.background = background;
		// Объект с данными линии
		this.line = line;
		// Объект с данными графика
		this.data = data;
		// Объект с данными колпачка линии
		this.cap = cap;
		// HTML элемент canvas
		this.canvasElement = document.querySelector(canvasSelector);
		// Контекст элемента canvas
		this.ctx = this.canvasElement.getContext("2d");
		// Содержит уникальные значения на оси ординат
		this.uniqueValues = [];
		// Содержит уникальные названия на оси абсцисс
		this.uniqueNames = [];
		// Содержит объекты данных абсциссы
		this.axisYData = [];
		// Содержит объекты данных ординаты
		this.axisXData = [];
		// Содержит объекты данных колпачка линии
		this.capsData = [];
		// Расстояние между горизонтальной линией и графиком
		this.indentFromXAxisToGraph = 10;
		// Расстояние между ординатой и графиком
		this.distanceBetweenYAndChart = 10;
		// Расстояние между графиком и названием диаграммы
		this.distanceBetweenTitleChartAndChart = 10;
		// Содержит объект данных, которые будут применяться к активной группе
		this.activeGroup = {};
		// Содержит данные блока информации
		this.windowInfoBlock = {
			color: "rgba(34,34,34, .8)",
			colorText: "white",
			width: 150,
			height: 50,
			padding: {
				vertical: 10,
				horizontal: 10,
				fromCap: 10,
			},
		};
		// Внутренние отступы графика
		this.padding = padding;
	}

	/**
	 * Устанавливает стили для колпачка
	 * @param {string} group Название группы, в которой находится колпачок
	 * @param {string} color Цвет
	 * @param {number} radius Радиус
	 * @param {object} stroke Обводка
	 * @param {number} x Позиция по оси абсцисс
	 * @param {number} y Позиция по оси ординат
	 */
	_setStylesToCap({ group, color, radius, stroke, x, y, }) {
		let capData = {
			ctx: this.ctx,
			x,
			y,
			radius,
			stroke,
			color,
			opacity: Object.keys(this.activeGroup).length ? 0.5 : 1,
		};

		if (group === this.activeGroup.group) {
			// Стили для активного колпачка
			const { active: { cap: activeCap = {}, }, } = this.activeGroup;
			const activeParams = {
				radius: activeCap.radius || radius,
				color: activeCap.color || color,
				stroke: activeCap.stroke || stroke,
			};

			capData = {
				...capData,
				opacity: 1,
				color: activeParams.color,
				radius: activeParams.radius,
				stroke: activeParams.stroke,
			};
		}

		new Cap(capData).draw();
	}

	/**
	 * Устанавливает стили для текста осей
	 * @param {string} contain Содержание текста оси
	 * @param {string} color Цвет
	 * @param {number} x Позиция по оси абсцисс
	 * @param {number} y Позиция по оси ординат
	 * @param {string} font Данные шрифта в строковом виде
	 */
	_setStylesToAxisText({ contain, color, x, y, font, }) {
		let textData = {
			ctx: this.ctx,
			color,
			opacity: Object.keys(this.activeGroup).length ? 0.6 : 1,
			x,
			y,
			font,
			text: contain,
		};

		if ([this.activeGroup.name, this.activeGroup.value].includes(contain)) {
			const { active: { text: activeText = {}, }, } = this.activeGroup;
			const activeParams = { color: activeText.color || color, };

			textData = {
				...textData,
				ctx: this.ctx,
				color: activeParams.color,
				opacity: 1,
			};
		}

		new Text(textData).draw();
	}

	/**
	 * Установка стилей для линий графика
	 * @param {string} group Группа, в которой находится линия
	 * @param {object} moveTo Объект с начальными координатами линии
	 * @param {number} width Ширина
	 * @param {string} color Цвет
	 * @param {array} lineTo Следующие позиции линии
	 */
	_setStylesToChartLine({ moveTo, group, width, color, lineTo, }) {
		let lineData = {
			moveTo,
			lineTo,
			width,
			color,
			ctx: this.ctx,
			opacity: Object.keys(this.activeGroup).length ? 0.5 : 1,
		};

		if (group === this.activeGroup.group) {
			const { active: { line: activeLine = {}, }, } = this.activeGroup;
			const activeParams = {
				width: activeLine.width || width,
				color: activeLine.color || color,
			};

			lineData = {
				...lineData,
				opacity: 1,
				width: activeParams.width,
				color: activeParams.color,
			};
		}

		new Line(lineData).draw();
	}

	// Устанавливает размеры элементу canvas
	_setDefaultStylesToCanvas() {
		const { offsetWidth, offsetHeight, } = this.canvasElement;
		const defaultStyles = {
			display: "block",
			boxSizing: "border-box",
		};

		this.canvasElement.width = offsetWidth;
		this.canvasElement.height = offsetHeight;
		this.canvasElement.style = Object.keys(defaultStyles)
			.map((key) => `${key}:${defaultStyles[key]}`)
			.join(";");
	}

	// Записывает уникальные данные осей графика
	_setUniqueValues() {
		const values = [];
		const names = [];

		for (const group in this.data) {
			const groupData = this.data[group].data;

			names.push(...groupData.map(({ name, }) => name));
			values.push(...groupData.map(({ value, }) => value));
		}

		const sortedValues = [...new Set(values)].sort((val1, val2) => val2 - val1);
		const firstValue = Math.ceil(sortedValues[0]);
		const lastValue = Math.floor(sortedValues[sortedValues.length - 1]);

		sortedValues.splice(0, 1, this._getMaxAxisYValue(firstValue, lastValue));

		this.uniqueValues = sortedValues;
		this.uniqueNames = [...new Set(names)];
	}

	/**
	 * Определяет максимальное значение для оси ординат
	 * @param {number} num1 Максимальное значение
	 * @param {number} num2 Минимальное значение
	 * @returns {number} максимальное значение
	 */
	_getMaxAxisYValue(num1, num2) {
		if (num1 % (num2 || 1) !== 0 || num1 % 4 !== 0) {
			return this._getMaxAxisYValue(num1 + 1, num2);
		}

		return num1;
	}

	/**
	 * Возвращает размеры элемента canvas
	 * @returns {object} Ширина и высота элемента canvas
	 */
	_getCanvasSizes() {
		const { width, height, } = this.canvasElement;

		return {
			width,
			height,
		};
	}

	// Задает задний фон графику
	_setStylesToCanvas() {
		new Rect({
			x: 0,
			y: 0,
			...this._getCanvasSizes(),
			color: this.background,
			opacity: 1,
			ctx: this.ctx,
		}).draw();
	}

	// Устанавливает название диаграммы
	_setTitleChart() {
		if (!Object.keys(this.title).length) {
			return;
		}

		const { fontSize, name, color, } = this.title;
		const widthCanvas = this._getCanvasSizes().width - this.padding.right;
		const textSizes = this._getSizesText(name, `600 ${fontSize}px Arial, sans-serif`);
		const y = this.padding.top + textSizes.height;
		const x = widthCanvas / 2;

		new Text({
			moveTo: {
				x: this.padding.left,
				y: this.padding.top,
			},
			text: name,
			x,
			y,
			color,
			align: "center",
			font: `600 ${fontSize}px Arial, sans-serif`,
			ctx: this.ctx,
		}).draw();

		this.title = {
			...this.title,
			x,
			y,
			width: textSizes.width,
			height: textSizes.height,
		};
	}

	/**
	 * Ищет наибольший общий делитель
	 * @param {number} num1 Первое число
	 * @param {number} num2 Второе число
	 * @returns {number} Наибольший общий делитель
	 */
	_getNOD(num1, num2) {
		if ([num1, num2].includes(0)) {
			return num1 / 4;
		}

		if (num1 === num2) {
			return num1;
		}

		if (num1 > num2) {
			return this._getNOD(num1 - num2, num2);
		}

		return this._getNOD(num1, num2 - num1);
	}

	/**
	 * Определяет размеры текста
	 * @param {string} text содержимое текста
	 * @param {string} font данные шрифта (жирность, размер, ...)
	 * @returns {object} ширина и высота текста
	 */
	_getSizesText(text, font) {
		this.ctx.font = font;
		const txt = this.ctx.measureText(text);

		return {
			width: txt.width,
			height: txt.actualBoundingBoxAscent,
		};
	}

	// Устанавливает ординату
	_setYAxis() {
		const firstValue = Math.ceil(this.uniqueValues[0]);
		const lastValue = Math.floor(this.uniqueValues[this.uniqueValues.length - 1]);
		const nod = this._getNOD(Math.abs(firstValue), Math.abs(lastValue));
		const valuesFromFirstValueToLastValue = [];
		const fontSize = this.axisY.fontSize;
		const color = this.axisY.color;
		const heightFirstName = this._getSizesText(this.uniqueNames[0], `400 ${fontSize}px Arial, sans-serif`).height;

		// Добавляем все значения от начального до последнего с интервалом 1
		for (let i = firstValue; i >= lastValue; i--) {
			valuesFromFirstValueToLastValue.push(i);
		}

		// Добавляем целые значения в массив ординат
		valuesFromFirstValueToLastValue.map((value, index) => {
			const valueSizes = this._getSizesText(value, `400 ${fontSize}px Arial, sans-serif`);
			const firstValueSizes = this._getSizesText(firstValue, `400 ${fontSize}px Arial, sans-serif`);
			const startPoint = this.padding.top + firstValueSizes.height / 2 + (Object.keys(this.title).length ? this.title.height + this.distanceBetweenTitleChartAndChart : 0);
			const endPoint = this._getCanvasSizes().height - startPoint - this.padding.bottom - (this.axisX.showText ? this.indentFromXAxisToGraph + heightFirstName : 0);
			const step = endPoint / (valuesFromFirstValueToLastValue.length - 1);
			const x = this.padding.left;
			const y = step * index + startPoint;
			const height = valueSizes.height;

			this.axisYData.push({
				y,
				x,
				width: valueSizes.width,
				height,
				value,
				onScreen: value % nod === 0,
			});

			if (value % nod === 0 && this.axisY.showText) {
				this._setStylesToAxisText({
					contain: value,
					color,
					font: `400 ${fontSize}px Arial, sans-serif`,
					x,
					y: y + height / 2,
				});
			}
		});

		// Определяем позицию Y у всех значений и добавляем их в массив ординат
		this.uniqueValues.map((n) => {
			const findMaxNum = valuesFromFirstValueToLastValue.sort((val1, val2) => Math.abs(val1 - Math.ceil(n)) - Math.abs(val2 - Math.ceil(n)))[0];
			const findAxisYIndex = this.axisYData.findIndex(({ value, }) => value === findMaxNum);

			if (findAxisYIndex !== -1) {
				const findAxisYItem = this.axisYData[findAxisYIndex];
				const findNextAxisYItem = this.axisYData.find(({ value, }) => n >= findAxisYItem.value ? value > findAxisYItem.value : value < findAxisYItem.value);

				if (findNextAxisYItem) {
					const textSizes = this._getSizesText(n, `400 ${fontSize}px Arial, sans-serif`);
					const percentStr = ((n.toString().match(/\.\d{1,2}/) || [])[0] || "").replace(/\./, "") || n.toString();
					const percent = percentStr.length < 2 ? +percentStr * 10 : +percentStr;
					const height = textSizes.height;
					const area = Math.abs(findAxisYItem.y - findNextAxisYItem.y);
					const y = (percent * area) / 100;

					this.axisYData.push({
						x: this.padding.left,
						y: findNextAxisYItem.y - y,
						width: textSizes.width,
						height,
						value: n,
						onScreen: false,
					});
				}
			}
		});
	}

	/**
	 * Возвращает максимальную ширину текста в ординате
	 * @returns {number} Ширина текста
	 */
	_getMaxTextWidthAtYAxis() {
		const axisYItem = this.axisYData
			.filter(({ onScreen, }) => onScreen)
			.sort(({ width: width1, }, { width: width2, }) => width2 - width1)[0];

		return axisYItem.width;
	}

	// Устанавливает абсциссу
	_setXAxis() {
		const canvasHeight = this._getCanvasSizes().height;
		const fontSize = this.axisX.fontSize;
		const color = this.axisX.color;
		const firstName = this.uniqueNames[0];
		const lastName = this.uniqueNames[this.uniqueNames.length - 1];

		this.uniqueNames.map((name, index) => {
			const firstNameSizes = this._getSizesText(firstName, `400 ${fontSize}px Arial, sans-serif`);
			const lastNameSizes = this._getSizesText(lastName, `400 ${fontSize}px Arial, sans-serif`);
			const startPoint = firstNameSizes.width / 2 + this.padding.left + (this.axisY.showText ? this._getMaxTextWidthAtYAxis() + this.distanceBetweenYAndChart : 0);
			const endPoint = this._getCanvasSizes().width - lastNameSizes.width / 2 - startPoint - this.padding.right;
			const step = endPoint / (this.uniqueNames.length - 1);
			const nameSizes = this._getSizesText(name, `400 ${fontSize}px Arial, sans-serif`);
			const x = step * index + startPoint;
			const y = canvasHeight - this.padding.bottom;

			// Проверяем в каких группах находится это название
			for (const group in this.data) {
				const groupData = this.data[group].data;

				groupData.map((groupDataItem) => {
					if (groupDataItem.name === name) {
						this.axisXData.push({
							x,
							y,
							name,
							value: groupDataItem.value,
							width: nameSizes.width,
							height: nameSizes.height,
							group,
						});
					}
				});
			}

			// Рисуем текст
			if (this.axisX.showText) {
				this._setStylesToAxisText({
					contain: name,
					color,
					font: `400 ${fontSize}px Arial, sans-serif`,
					x: x - nameSizes.width / 2,
					y,
				});
			}
		});
	}

	// Устанавливает горизонтальные линии
	_setHorizontalLines() {
		if (Object.keys(this.axisX.line || {}).length) {
			this.axisYData.filter(({ onScreen, }) => onScreen).map(({ y, }) => {
				const firstXAxisItem = this.axisXData[0];
				const lastXAxisItem = this.axisXData[this.axisXData.length - 1];

				// Рисуем линию
				new Line({
					ctx: this.ctx,
					color: this.axisX.line.color,
					width: this.axisX.line.width,
					moveTo: { x: firstXAxisItem.x, y, },
					lineTo: [{ x: lastXAxisItem.x, y, }],
				}).draw();
			});
		}
	}

	// Устанавливает вертикальные линии
	_setVerticalLines() {
		if (Object.keys(this.axisY.line || {}).length) {
			this.uniqueNames.map((name) => {
				const findAxisXItem = this.axisXData.find((axisXDataItem) => axisXDataItem.name === name);
				const axisYOnScreen = this.axisYData.filter(({ onScreen, }) => onScreen);
				const firstAxisYItem = axisYOnScreen[0];
				const lastAxisYItem = axisYOnScreen[axisYOnScreen.length - 1];

				// Рисуем линию
				new Line({
					ctx: this.ctx,
					moveTo: { x: findAxisXItem.x, y: firstAxisYItem.y, },
					opacity: 1,
					color: this.axisY.line.color,
					width: this.axisY.line.width,
					lineTo: [{ x: findAxisXItem.x, y: lastAxisYItem.y, }],
				}).draw();
			});
		}
	}

	// Рисует график
	_setChart() {
		for (const group in this.data) {
			const {
				data: groupData,
				line: groupLine = {},
				active: groupActive = {},
				cap: groupCap = {},
			} = this.data[group];

			groupData.map(({ value, name, }, index) => {
				const nextDataItem = groupData[index + 1];
				// Находим элемент из ординаты, подходящий по значению
				const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);
				// Находим элемент из абсциссы, подходящий по имени
				const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name);
				const width = groupLine.width || this.line.width;
				const color = groupLine.color || this.line.color;
				const lineToArray = [];

				if (nextDataItem) {
					// Находим следующий элемент из ординаты, подходящий по значению
					const findNextAxisYItem = this.axisYData.find((nextAxisYItem) => nextAxisYItem.value === nextDataItem.value);
					// Находим следующий элемент из абсциссы, подходящий по имени
					const findNextAxisXItem = this.axisXData.find((nextAxisXItem) => nextAxisXItem.name === nextDataItem.name);

					if (!this.stepped) {
						lineToArray.push({ x: findNextAxisXItem.x, y: findNextAxisYItem.y, });
					} else {
						lineToArray.push(
							{
								x: findNextAxisXItem.x,
								y: findAxisYItem.y,
							},
							{
								x: findNextAxisXItem.x,
								y: findNextAxisYItem.y,
							}
						);
					}
				}

				// Рисуем линию
				this._setStylesToChartLine({
					moveTo: { x: findAxisXItem.x, y: findAxisYItem.y, },
					group,
					width,
					color,
					lineTo: lineToArray,
				});

				// Рисуем колпачок
				this._setLineCap({
					color: groupCap.color || this.cap.color,
					radius: groupCap.radius || this.cap.radius,
					stroke: groupCap.stroke || this.cap.stroke || {},
					x: findAxisXItem.x,
					y: findAxisYItem.y,
				}, group, value, name, groupActive);
			});
		}
	}

	/**
	 * Рисует колпачок для линии
	 * @param {object} cap Содержит данные колпачка (цвет, радиус, ...)
	 * @param {string} group Название группы, к которому принадлежит этот колпачок
	 * @param {string} value Значение, к которому принадлежит этот колпачок
	 * @param {string} name Название, к которому принадлежит этот колпачок
	 * @param {object} active Содержит данные для активного колпачка (цвет, радиус, ...)
	 */
	_setLineCap(cap, group, value, name, active) {
		// Добавляем данные колпачка в массив
		this.capsData.push({
			x: cap.x,
			y: cap.y,
			group,
			value,
			name,
			radius: cap.radius,
			active,
			strokeWidth: cap.stroke.width || 0,
		});

		// Рисуем колпачок
		this._setStylesToCap({ group, ...cap, });
	}

	// Действия при изменении размеров экрана
	_drawWhenResizeScreen() {
		window.addEventListener("resize", () => {
			// Перерисовывает график при изменении размеров окна
			if (this.updateWhenResizing) {
				this.update();
			}

			// Вызывает функции контрольных точек, если ширина экрана станет меньше или равна этим точкам
			for (const group in this.data) {
				const { breakpoints = {}, data, } = this.data[group];

				if (Object.keys(breakpoints).length) {
					const widthWindow = document.documentElement.offsetWidth;

					for (const breakpoint in breakpoints) {
						if (widthWindow <= breakpoint) {
							return breakpoints[breakpoint](group, data);
						}
					}
				}
			}
		});
	}

	// Рисует окно с информацией активного элемента
	_drawWindowInfoBlock() {
		if (!Object.keys(this.activeGroup).length) {
			return;
		}

		const { group, value, name, x, y, radius, } = this.activeGroup;
		const colorLineGroup = (this.data[group].line || {}).color || this.line.color;
		const minWindowBlockWidth = 150;
		const windowContains = {
			top: {
				text: group,
				...this._getSizesText(group, "400 14px Arial, sans-serif"),
			},
			bottom: {
				text: `${name}: ${value}`,
				...this._getSizesText(`${name}: ${value}`, "400 14px Arial, sans-serif"),
			},
		};
		const windowPadding = {
			vertical: 10,
			horizontal: 10,
			fromCap: 10,
			fromInnerLine: 10,
		};
		const maxContainWidth = [windowContains.top.width, windowContains.bottom.width].sort((a, b) => b - a)[0];
		const windowBlockWidth = (maxContainWidth > minWindowBlockWidth) ? (maxContainWidth + windowPadding.horizontal + windowPadding.fromInnerLine) : minWindowBlockWidth;
		const windowBlock = new WindowInfoBlock({
			width: windowBlockWidth,
			colorLine: colorLineGroup,
			ctx: this.ctx,
			fontSize: 14,
			padding: windowPadding,
		});

		// Содержит позиции всего содержимого окна
		const containPositions = {
			top: {
				x: x + radius + windowPadding.fromCap,
				y: y - windowBlock.height / 2 + windowContains.top.height + windowPadding.vertical,
			},
			bottom: {
				x: x + radius + windowPadding.fromCap,
				y: y + windowBlock.height / 2 - windowPadding.vertical,
			},
			line: {
				start: {
					x: x + radius + windowPadding.fromCap + windowBlock.width - windowPadding.horizontal,
					y: y - windowBlock.height / 2 + windowPadding.vertical,
				},
				to: {
					x: x + radius + windowPadding.fromCap + windowBlock.width - windowPadding.horizontal,
					y: y - windowBlock.height / 2 + windowBlock.height - windowPadding.vertical,
				},
			},
		};

		const windowInfoBlock = new WindowInfoBlock({
			width: windowBlockWidth,
			colorLine: colorLineGroup,
			ctx: this.ctx,
			fontSize: 14,
			padding: windowPadding,
		});

		const { block: blockPos, contain: containPos, } = windowInfoBlock.getWindowPosition({
			x,
			y,
			padding: windowPadding,
			containPositions,
			windowBlock,
			radius,
			canvasWidth: this._getCanvasSizes().width,
		});

		// Рисуем блок окна
		windowBlock.drawWindow(...Object.values(blockPos));
		// Рисуем название группы
		windowBlock.drawContains(windowContains.top.text, containPos.top.x, containPos.top.y);
		// Рисуем значение
		windowBlock.drawContains(windowContains.bottom.text, containPos.bottom.x, containPos.bottom.y);
		// Рисуем линию группы
		windowBlock.drawGroupLine(containPositions.line);
	}

	// Показывает окно с информацией активного элемента при клике
	_showWindowInfoBlock() {
		this._drawWindowInfoBlock();

		const elemLeft = this.canvasElement.offsetLeft + this.canvasElement.clientLeft;
		const elemTop = this.canvasElement.offsetTop + this.canvasElement.clientTop;

		this.canvasElement.addEventListener("click", (e) => {
			const x = e.pageX - elemLeft;
			const y = e.pageY - elemTop;
			const findMatchCap = this.capsData.find((cap) => {
				const capY = Math.floor(cap.y);
				const capX = Math.floor(cap.x);

				if (y >= capY - (cap.radius + cap.strokeWidth) && y <= capY + (cap.radius + cap.strokeWidth)
					&& x >= capX - (cap.radius + cap.strokeWidth) && x <= capX + (cap.radius + cap.strokeWidth)) {
					return true;
				}

				return false;
			});

			this.activeGroup = findMatchCap ? { ...findMatchCap, x, y, } : {};
			this.update();

			if (findMatchCap) {
				this._drawWindowInfoBlock();
			}
		});
	}

	// Перерисовывает график
	update() {
		this.axisXData = [];
		this.axisYData = [];
		this.capsData = [];

		this._setUniqueValues();
		this._setDefaultStylesToCanvas();
		this._setStylesToCanvas();
		this._setTitleChart();
		this._setYAxis();
		this._setXAxis();
		this._setVerticalLines();
		this._setHorizontalLines();
		this._setChart();
	}

	// Рисует график
	init() {
		this._setUniqueValues();
		this._setDefaultStylesToCanvas();
		this._setStylesToCanvas();
		this._setTitleChart();
		this._setYAxis();
		this._setXAxis();
		this._setVerticalLines();
		this._setHorizontalLines();
		this._setChart();
		this._drawWhenResizeScreen();
		this._showWindowInfoBlock();

		return this;
	}
}

export default aCharty;