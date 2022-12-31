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
		this.activeGroups = [];
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
		const capData = {
			ctx: this.ctx,
			x,
			y,
			radius,
			stroke,
			color,
			opacity: this.activeGroups.length ? 0.5 : 1,
		};

		if (this.activeGroups.find(({ group: activeGroupName, }) => activeGroupName === group)) {
			this.activeGroups.forEach((g) => {
				if (g.group === group) {
					// Стили для активного колпачка
					const { active: { cap: activeCap = {}, }, } = g;
					const activeParams = {
						radius: activeCap.radius || radius,
						color: activeCap.color || color,
						stroke: activeCap.stroke || stroke,
					};

					new Cap({
						...capData,
						...activeParams,
						opacity: 1,
					}).draw();
				}
			});
		} else {
			new Cap(capData).draw();
		}
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
			opacity: this.activeGroups.length ? 0.6 : 1,
			x,
			y,
			font,
			text: contain,
		};

		if (this.activeGroups.length) {
			if ([this.activeGroups[0].name, this.activeGroups[0].value].includes(contain)) {
				const { active: { text: activeText = {}, }, } = this.activeGroups[0];
				const activeParams = { color: activeText.color || color, };

				textData = {
					...textData,
					...activeParams,
					ctx: this.ctx,
					opacity: 1,
				};
			}
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
	_setStylesToChartLine({ moveTo, group, width, color, lineTo, dotted, }) {
		const lineData = {
			moveTo,
			lineTo,
			width,
			color,
			dotted,
			ctx: this.ctx,
			opacity: this.activeGroups.length ? 0.5 : 1,
		};

		if (this.activeGroups.map((g) => g.group).includes(group)) {
			this.activeGroups.forEach((g) => {
				if (g.group === group) {
					const { active: { line: activeLine = {}, }, } = g;
					const activeParams = {
						width: activeLine.width || width,
						color: activeLine.color || color,
						dotted: activeLine.dotted !== undefined ? activeLine.dotted : dotted,
					};

					new Line({
						...lineData,
						...activeParams,
						opacity: 1,
					}).draw();
				}
			});
		} else {
			new Line(lineData).draw();
		}
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

	// Определяет данные осей графика
	_setAxesData() {
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

		let maxValue = null;
		let changedIndex = null;

		if (firstValue > 0) {
			maxValue = this._getMaxAxisYValue(firstValue, lastValue);
			changedIndex = 0;
		} else if (firstValue <= 0) {
			maxValue = this._getMaxAxisYValue(lastValue, firstValue);
			changedIndex = sortedValues.length - 1;
		}

		sortedValues.splice(changedIndex, 1, maxValue);

		this.uniqueValues = sortedValues;
		this.uniqueNames = [...new Set(names)];
	}

	/**
	 * Определяет максимальное значение для оси ординат
	 * @param {number} num1 Первое число
	 * @param {number} num2 Второе число
	 * @returns {number} максимальное значение
	 */
	_getMaxAxisYValue(num1, num2) {
		if ((num1 || 1) % (num2 || 1) !== 0 || (num1 || 1) % 4 !== 0) {
			return this._getMaxAxisYValue(num1 > 0 ? num1 + 1 : num1 - 1, num2);
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
		if (num1 === 0) {
			return Math.abs(num2) / 4;
		}

		if (num2 === 0) {
			return Math.abs(num1) / 4;
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
		let sumHeight = 0;
		let sumWidth = 0;
		let sumMargin = 0;

		const lengthTexts = text.length;

		if (Array.isArray(text)) {
			this.ctx.font = font;

			text.map((w) => {
				const txt = this.ctx.measureText(w);
				sumHeight += txt.actualBoundingBoxAscent;
				sumWidth += txt.width;
				sumMargin += 20;
			});

			return {
				margin: sumMargin,
				height: Math.floor(sumHeight),
				middleHeight: Math.floor(sumHeight / lengthTexts),
				width: Math.floor(sumWidth / lengthTexts),
			};
		}

		sumMargin += 20;
		this.ctx.font = font;
		const txt = this.ctx.measureText(text);

		return {
			margin: sumMargin,
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
					...this.axisX.line,
					ctx: this.ctx,
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
					...this.axisY.line,
					ctx: this.ctx,
					moveTo: { x: findAxisXItem.x, y: firstAxisYItem.y, },
					opacity: 1,
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
				const dotted = groupLine.dotted;
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
					dotted,
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
		if (!this.activeGroups.length) {
			return;
		}

		const groupsFromActiveGroups = this.activeGroups.map((g) => g.group);
		const colorLineGroups = this.activeGroups.map((g) => (this.data[g.group].line || {}).color || this.line.color);

		const { name, x, y, radius, } = this.activeGroups[0];
		const minWindowBlockWidth = 150;
		const windowContains = {
			top: {
				text: groupsFromActiveGroups,
				...this._getSizesText(name, "400 14px Arial, sans-serif"),
			},
			bottom: {
				text: this.activeGroups.map((g) => `${g.group}: ${g.value}`),
				...this._getSizesText(this.activeGroups.map((g) => `${g.group}: ${g.value}`), "400 14px Arial, sans-serif"),
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
		const { height: textHeight, margin, } = windowContains.bottom;
		const windowBlock = new WindowInfoBlock({
			width: windowBlockWidth,
			height: margin + textHeight + windowPadding.vertical + radius,
			colorLine: colorLineGroups,
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
				y: y + windowBlock.height / 2 - windowPadding.vertical - radius,
			},
			line: {
				start: {
					x: x + radius + windowPadding.fromCap + windowBlock.width - windowPadding.horizontal,
					y: y + windowBlock.height / 2 - windowPadding.vertical - radius,
				},
				to: {
					x: x + radius + windowPadding.fromCap + windowBlock.width - windowPadding.horizontal,
					y: y + windowBlock.height / 2 - windowPadding.vertical + radius,
				},
			},
		};

		const { block: { x: xBlock, y: yBlock, }, contain: containPos, } = windowBlock.getWindowPosition({
			x,
			y,
			containPositions,
			windowBlock,
			radius,
			padding: windowPadding,
			canvasWidth: this._getCanvasSizes().width,
		});

		// Рисуем блок окна
		windowBlock.drawWindow(xBlock, yBlock);
		// Рисуем название группы
		windowBlock.drawContains(name, containPos.top.x, containPos.top.y);
		// Рисуем значения
		if (windowContains.bottom.text.length === 1) {
			windowBlock.drawContains(
				windowContains.bottom.text[0], containPos.bottom.x, containPos.bottom.y + radius * 2
			);
			// Рисуем линию группы
			windowBlock.drawGroupLine({
				start: { ...containPos.line.start, },
				to: { ...containPos.line.to, },
			});
		} else if (windowContains.bottom.text.length > 1) {
			windowContains.bottom.text.forEach((txt, idx) => {
				let mY = containPos.bottom.y + radius;
				if (idx !== 0) mY -= 20; // внешний отступ
				windowBlock.drawContains(txt, containPos.bottom.x, mY);
			});
			// Рисуем линию группы
			windowBlock.drawGroupLine({
				start: { ...containPos.line.start, y: containPos.bottom.y - radius - 20, },
				to: { ...containPos.line.to, y: containPos.line.to.y - 20, },
			});
		}
	}

	// Показывает окно с информацией активного элемента при клике
	_showWindowInfoBlock() {
		this._drawWindowInfoBlock();

		const elemLeft = this.canvasElement.offsetLeft + this.canvasElement.clientLeft;
		const elemTop = this.canvasElement.offsetTop + this.canvasElement.clientTop;

		this.canvasElement.addEventListener("click", (e) => {
			this.activeGroups = [];

			const x = e.pageX - elemLeft;
			const y = e.pageY - elemTop;

			const findMatchCaps = this.capsData.filter((cap) => {
				const capY = Math.floor(cap.y);
				const capX = Math.floor(cap.x);

				if (y >= capY - (cap.radius + cap.strokeWidth) && y <= capY + (cap.radius + cap.strokeWidth)
					&& x >= capX - (cap.radius + cap.strokeWidth) && x <= capX + (cap.radius + cap.strokeWidth)) {
					return true;
				}

				return false;
			});

			findMatchCaps.forEach((cap) => cap && this.activeGroups.push({ ...cap, x, y, }));
			this.update();

			if (findMatchCaps.length) {
				this._drawWindowInfoBlock();
			} else if (!findMatchCaps.length) {
				this.activeGroups = [];
			}
		});
	}

	// Перерисовывает график
	update() {
		this.axisXData = [];
		this.axisYData = [];
		this.capsData = [];

		this._setAxesData();
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
		this._setAxesData();
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