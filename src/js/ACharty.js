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
		blockInfo = {},
		ignoreNames = [],
		updateWhenResizing = true,
		padding = {
			top: 10,
			left: 10,
			right: 10,
			bottom: 10,
		},
	}) {
		// Содержит названия, которые не будут нарисованы на графике
		this.ignoreNames = ignoreNames;
		// Объект с данными блока об активной группе
		this.blockInfo = blockInfo;
		// Объект с данными названия диаграммы
		this.title = title;
		// Правило, которое будет обновлять график при изменении экрана
		this.updateWhenResizing = updateWhenResizing;
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
		// Содержит объекты данных активных групп
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
	 * @param {number} size Размер колпачка
	 * @param {object} stroke Обводка
	 * @param {number} x Позиция по оси абсцисс
	 * @param {number} y Позиция по оси ординат
	 * @param {string} format Формат колпачка (круг, квадрат)
	 */
	_setStylesToCap({ group, color, size, stroke, x, y, format, }) {
		// Начальные стили для колпачка
		const capData = {
			ctx: this.ctx,
			x,
			y,
			size,
			format,
			stroke,
			color,
			opacity: this.activeGroups.length ? 0.5 : 1,
		};

		if (this.activeGroups.find(({ group: activeGroupName, }) => activeGroupName === group)) {
			// Стили, применяемые для колпачков, чья группа считается активной
			this.activeGroups.forEach((g) => {
				if (g.group === group) {
					const { active: { cap: activeCap = {}, }, } = g;
					const activeParams = {
						size: activeCap.size || size,
						color: activeCap.color || color,
						stroke: activeCap.stroke || stroke,
						format: activeCap.format || format,
						opacity: 1,
					};

					new Cap({
						...capData,
						...activeParams,
					}).draw();
				}
			});
		} else {
			// Стили, применяемые для колпачков, чья группа не считается активной
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
	 * @param {number} fontSize Размер шрифта
	 */
	_setStylesToAxisText({ contain, color, x, y, font, fontSize, }) {
		// Начальные стили для текста
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
			// Стили, применяемые для текста, чья группа считается активной
			if ([this.activeGroups[0].name, this.activeGroups[0].value].includes(contain)) {
				const { active: { text: activeText = {}, }, } = this.activeGroups[0];
				const activeParams = {
					color: activeText.color || color,
					fontSize: activeText.fontSize || fontSize,
					opacity: 1,
				};

				textData = {
					...textData,
					...activeParams,
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
	 * @param {boolean} dotted Пунктирная линия
	 */
	_setStylesToChartLine({ moveTo, group, width, color, lineTo, dotted, }) {
		// Начальные стили для линии
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
			// Стили, применяемые для линий, чья группа считается активной
			this.activeGroups.forEach((g) => {
				if (g.group === group) {
					const { active: { line: activeLine = {}, }, } = g;
					const activeParams = {
						width: activeLine.width || width,
						color: activeLine.color || color,
						dotted: activeLine.dotted !== undefined ? activeLine.dotted : dotted,
						opacity: 1,
					};

					new Line({
						...lineData,
						...activeParams,
					}).draw();
				}
			});
		} else {
			// Стили, применяемые для линий, чья группа не считается активной
			new Line(lineData).draw();
		}
	}

	/**
	 * Установка стилей для заднего фона группы
	 * @param {object} moveTo Объект с начальными координатами линии
	 * @param {array} lineTo Следующие позиции линии
	 * @param {string|array} fill Цвет заднего фона
	 * @param {number} minStartY Минимальная начальная позиция по оси ординат (для начала отрисовки градиента по оси ординат)
	 * @param {string} group Группа, в которой находится линия
	 */
	_setStylesToFillGroupChart({ moveTo, lineTo, fill, minStartY, group, }) {
		// Начальные стили для линии
		const lineData = {
			moveTo,
			lineTo,
			ctx: this.ctx,
			fill,
			minStartY,
			opacity: this.activeGroups.length ? 0.5 : 1,
		};

		if (this.activeGroups.map((g) => g.group).includes(group)) {
			// Стили, применяемые для линий, чья группа считается активной
			this.activeGroups.forEach((g) => {
				if (g.group === group) {
					const { active: { line: activeLine = {}, }, } = g;
					const activeParams = {
						fill: activeLine.fill || fill,
						opacity: 1,
					};

					new Line({
						...lineData,
						...activeParams,
					}).draw();
				}
			});
		} else {
			// Стили, применяемые для линий, чья группа не считается активной
			new Line(lineData).draw();
		}
	}

	// Устанавливает начальные стили холсту
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
		// Для оси ординат
		const values = [];
		// Для оси абсцисс
		const names = [];

		// Добавляем значения и названия в массивы данных осей
		for (const group in this.data) {
			const groupData = this.data[group].data;

			names.push(...groupData.map(({ name, }) => name));
			values.push(...groupData.map(({ value, }) => value));
		}

		// Находим максимальное значение для оси ординат
		const sortedValues = [...new Set(values)].sort((val1, val2) => val2 - val1);
		const firstValue = Math.ceil(sortedValues[0]);
		const lastValue = Math.floor(sortedValues[sortedValues.length - 1]);

		let maxValue = null;

		if (firstValue > 0) {
			maxValue = this._getMaxAxisYValue(firstValue, lastValue);
		} else if (firstValue <= 0) {
			maxValue = this._getMaxAxisYValue(lastValue, firstValue);
		}

		// Заменяем существующее максимальное значение на новое
		sortedValues[maxValue > 0 ? "unshift" : "push"](maxValue);

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
			color: this.background,
			opacity: 1,
			ctx: this.ctx,
			...this._getCanvasSizes(),
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
		this.ctx.font = font;
		const txt = this.ctx.measureText(text);

		return {
			width: txt.width,
			height: txt.actualBoundingBoxAscent,
		};
	}

	// Устанавливает ординату
	_setYAxis() {
		// Стили оси
		const fontSize = this.axisY.fontSize;
		const color = this.axisY.color;
		// Самое максимальное и минимальное значения
		const firstValue = Math.ceil(this.uniqueValues[0]);
		const lastValue = Math.floor(this.uniqueValues[this.uniqueValues.length - 1]);
		// Содержит размеры самого максимального значения
		const firstValueSizes = this._getSizesText(firstValue, `400 ${fontSize}px Arial, sans-serif`);
		// НОД самого максимального и минимального значений
		const nod = this._getNOD(Math.abs(firstValue), Math.abs(lastValue));
		// Содержит все значения от самого максимального до минимального значений (счет идет с 1)
		const valuesFromFirstValueToLastValue = [];
		// Содержит высоту первого названия
		const heightFirstName = this._getSizesText(this.uniqueNames[0], `400 ${fontSize}px Arial, sans-serif`).height;

		// Добавляем все значения от начального до последнего с интервалом 1
		for (let i = firstValue; i >= lastValue; i--) {
			valuesFromFirstValueToLastValue.push(i);
		}

		// Добавляем целые значения в массив ординат
		valuesFromFirstValueToLastValue.map((value, index) => {
			// Содержит размеры значения
			const valueSizes = this._getSizesText(value, `400 ${fontSize}px Arial, sans-serif`);
			// Начальная точка для отрисовки элементов
			const startPoint = this.padding.top + firstValueSizes.height / 2 + (Object.keys(this.title).length ? this.title.height + this.distanceBetweenTitleChartAndChart : 0);
			// Конечная точка для отрисовки элементов
			const endPoint = this._getCanvasSizes().height - startPoint - this.padding.bottom - (this.axisX.showText ? this.indentFromXAxisToGraph + heightFirstName : 0);
			// Интервал для отрисовки элементов
			const step = endPoint / (valuesFromFirstValueToLastValue.length - 1);
			// Координаты для отрисовки элементов
			const posYItem = { x: this.axisY.showText ? this.padding.left : 0, y: step * index + startPoint, };

			this.axisYData.push({
				// Отрисовываться будет только то значение,
				// которое делится без остатка на НОД между максимальным и
				// минимальным значением
				onScreen: value % nod === 0,
				value,
				...valueSizes,
				...posYItem,
			});

			// Отрисовываем значения, которые делятся без остатка на НОД
			// между максимальным и минимальным значением
			if (value % nod === 0 && this.axisY.showText) {
				this._setStylesToAxisText({
					contain: value,
					color,
					fontSize,
					font: `400 ${fontSize}px Arial, sans-serif`,
					x: posYItem.x,
					y: posYItem.y + valueSizes.height / 2,
				});
			}
		});

		// Определяем позицию Y у всех значений и добавляем их в массив ординат
		this.uniqueValues.map((n) => {
			// Самое приближенное максимальное значение
			const findMaxNum = valuesFromFirstValueToLastValue.sort((val1, val2) => Math.abs(val1 - Math.ceil(n)) - Math.abs(val2 - Math.ceil(n)))[0];
			const findMaxNumIndex = this.axisYData.findIndex(({ value, }) => value === findMaxNum);

			if (findMaxNumIndex !== -1) {
				const findAxisYItem = this.axisYData[findMaxNumIndex];
				const findNextAxisYItem = this.axisYData.find(({ value, }) => n >= findMaxNum ? value > findMaxNum : value < findMaxNum);

				if (findNextAxisYItem) {
					const textSizes = this._getSizesText(n, `400 ${fontSize}px Arial, sans-serif`);
					// Расстояние между максимальным и следующим элементом
					const area = Math.abs(findAxisYItem.y - findNextAxisYItem.y);
					// Координаты для значения
					const posYItem = { x: this.padding.left, y: null, };
					const numAfterDot = parseInt(((n.toString().match(/\.\d+/) || [])[0] || "").replace(/\./, "")) || 0;
					const percent = Math.abs((numAfterDot / 10 ** numAfterDot.toString().length) * 100);

					if (findNextAxisYItem.value >= 0) {
						posYItem.y = findNextAxisYItem.y - (percent * area) / 100;
					} else if (findNextAxisYItem.value < 0) {
						posYItem.y = findAxisYItem.y + (percent * area) / 100;
					}

					this.axisYData.push({
						value: n,
						onScreen: false,
						...posYItem,
						...textSizes,
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
		return Math.max(...this.axisYData.filter(({ onScreen, }) => onScreen).map(({ width, }) => width));
	}

	// Устанавливает абсциссу
	_setXAxis() {
		const canvasHeight = this._getCanvasSizes().height;
		const fontSize = this.axisX.fontSize;
		const color = this.axisX.color;
		const firstName = this.uniqueNames[0];
		const lastName = this.uniqueNames[this.uniqueNames.length - 1];

		this.uniqueNames.map((name, index) => {
			// Содержит размеры первого названия
			const firstNameSizes = this._getSizesText(firstName, `400 ${fontSize}px Arial, sans-serif`);
			// Содержит размеры второго названия
			const lastNameSizes = this._getSizesText(lastName, `400 ${fontSize}px Arial, sans-serif`);
			// Начальная точка для отрисовки элементов
			const startPoint = this.padding.left + ((this.axisX.showText && !this.ignoreNames.includes(firstName)) ? firstNameSizes.width / 2 : 0) + (this.axisY.showText ? this._getMaxTextWidthAtYAxis() + this.distanceBetweenYAndChart : 0);
			// Конечная точка для отрисовки элементов
			const endPoint = this._getCanvasSizes().width - ((this.axisX.showText && !this.ignoreNames.includes(lastName)) ? lastNameSizes.width / 2 : 0) - startPoint - this.padding.right;
			// Шаг, с которым отрисовываем элементы
			const step = endPoint / (this.uniqueNames.length - 1);
			// Содержит размеры названия
			const nameSizes = this._getSizesText(name, `400 ${fontSize}px Arial, sans-serif`);
			// Координаты элемента для отрисовки
			const x = step * index + startPoint;
			const y = canvasHeight - this.padding.bottom;

			// Если это уникальное название присутствует в какой-либо группе,
			// то мы добавляем его вместе с его значением в массив this.axisXData
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
			if (this.axisX.showText && !this.ignoreNames.includes(name)) {
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
				const firstXAxisItem = this.axisXData[0]; // Элемент для начальной позиции X линии
				const lastXAxisItem = this.axisXData[this.axisXData.length - 1]; // Элемент для конечной позиции X линии

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
				const findAxisXItem = this.axisXData.find((axisXDataItem) => axisXDataItem.name === name); // Элемент для начальной и конечной позиции X линии
				const axisYOnScreen = this.axisYData.filter(({ onScreen, }) => onScreen);
				const firstAxisYItem = axisYOnScreen[0]; // Элемент для начальной позиции Y линии
				const lastAxisYItem = axisYOnScreen[axisYOnScreen.length - 1]; // Элемент для конечной позиции Y линии

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
			const coordinations = groupData.map(({ value, name, }) => {
				// Элемент для начальной позиции Y линии
				const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);
				// Элемент для начальной позиции X линии
				const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name);

				return {
					x: findAxisXItem.x,
					value: findAxisYItem.value,
					name: findAxisXItem.name,
					y: findAxisYItem.y,
				};
			});

			// Стили линии
			const width = groupLine.width || this.line.width;
			const color = groupLine.color || this.line.color;
			const dotted = groupLine.dotted || this.line.dotted;
			const stepped = groupLine.stepped || this.line.stepped;
			const fill = groupLine.fill || this.line.fill;

			// Рисуем задний фон линиям
			if (Array.isArray(fill) || typeof fill === "string") {
				this._setFillGroupChart(coordinations, fill, stepped, group);
			}

			// Находим координаты для линий
			groupData.map(({ value, name, }, index) => {
				const nextDataItem = groupData[index + 1];
				// Элемент для начальной позиции Y линии
				const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);
				// Элемент для начальной позиции X линии
				const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name);
				// Содержит следующие позиции линии
				const lineToArray = [];

				if (nextDataItem) {
					// Элемент для следующей позиции Y линии
					const findNextAxisYItem = this.axisYData.find((nextAxisYItem) => nextAxisYItem.value === nextDataItem.value);
					// Элемент для следующей позиции X линии
					const findNextAxisXItem = this.axisXData.find((nextAxisXItem) => nextAxisXItem.name === nextDataItem.name);

					if (!stepped) {
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
					fill,
					stepped,
				});

				// Рисуем колпачок
				this._setLineCap({
					color: groupCap.color || this.cap.color,
					size: groupCap.size || this.cap.size,
					stroke: groupCap.stroke || this.cap.stroke || {},
					format: groupCap.format || this.cap.format,
					x: findAxisXItem.x,
					y: findAxisYItem.y,
				}, group, value, name, groupActive);
			});
		}
	}

	/**
	 * Создает задний фон у всей группы
	 * @param {array} coordinations массив координат линий графика
	 * @param {string|array} fill содержит данные о цвете заднего фона
	 * @param {boolean} stepped Правило, которое будет рисовать линию пошагово
	 * @param {string} group Группа, в которой находится линия
	 */
	_setFillGroupChart(coordinations, fill, stepped, group) {
		const firstItem = coordinations[0];
		const yItemsOnScreen = this.axisYData.filter(({ onScreen, }) => onScreen);
		const lastYItem = yItemsOnScreen[yItemsOnScreen.length - 1];
		const lastXItem = this.axisXData[this.axisXData.length - 1];
		const firstXItem = this.axisXData[0];
		const lineData = {
			moveTo: { x: firstItem.x, y: firstItem.y, },
			lineTo: [],
			fill,
			group,
			minStartY: Math.min(...coordinations.map(({ y, }) => y)),
		};

		// Определяем координаты для будущей фигуры
		coordinations.map(({ x, y, }, index) => {
			if (stepped) {
				const nextItem = coordinations[index + 1];

				if (nextItem) {
					// Элемент для следующей позиции Y линии
					const findNextAxisYItem = this.axisYData.find((nextAxisYItem) => nextAxisYItem.value === nextItem.value);
					// Элемент для следующей позиции X линии
					const findNextAxisXItem = this.axisXData.find((nextAxisXItem) => nextAxisXItem.name === nextItem.name);

					lineData.lineTo.push(
						{
							x: findNextAxisXItem.x,
							y,
						},
						{
							x: findNextAxisXItem.x,
							y: findNextAxisYItem.y,
						}
					);
				}
			} else if (index > 0) {
				lineData.lineTo.push({ x, y, });
			}
		});

		// Закрываем фигуру
		lineData.lineTo.push(
			{ x: lastXItem.x, y: lastYItem.y, },
			{ x: firstXItem.x, y: lastYItem.y, },
			{ ...lineData.moveTo, }
		);

		// Рисуем задний фон группе
		this._setStylesToFillGroupChart(lineData);
	}

	/**
	 * Рисует колпачок для линии
	 * @param {object} cap Содержит данные колпачка (цвет, размер, ...)
	 * @param {string} group Название группы, к которому принадлежит этот колпачок
	 * @param {string} value Значение, к которому принадлежит этот колпачок
	 * @param {string} name Название, к которому принадлежит этот колпачок
	 * @param {object} active Содержит данные для активного колпачка (цвет, размер, ...)
	 */
	_setLineCap(cap, group, value, name, active) {
		// Добавляем данные колпачка в массив
		this.capsData.push({
			x: cap.x,
			y: cap.y,
			strokeWidth: cap.stroke.width || 0,
			size: cap.size,
			format: cap.format,
			group,
			value,
			name,
			active,
		});

		// Рисуем колпачок
		this._setStylesToCap({ group, ...cap, });
	}

	// Действия при изменении размеров экрана
	_resizeScreen() {
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

		const widthActiveGroupLine = 2;
		const windowPadding = this.blockInfo.padding;
		const windowContains = {
			top: {},
			bottom: [],
		};

		// Заполняем данными контент окна
		this.activeGroups.map(({ group, value, name, x, y, }, index) => {
			// Верхний контент
			const { fontSize: topFontSize, color: topColor, } = this.blockInfo.topContent;
			const nameSizes = this._getSizesText(name, `400 ${topFontSize}px Arial, sans-serif`);
			const topContentData = {
				...nameSizes,
				fontSize: topFontSize,
				color: topColor,
				text: name,
				x: x + windowPadding.fromCap + windowPadding.horizontal,
				y: y + windowPadding.vertical + nameSizes.height,
			};

			// Нижний контент (список активных групп)
			const { fontSize: bottomFontSize, color: bottomColor, } = this.blockInfo.bottomContent;
			const activeGroupSizes = this._getSizesText(`${group}: ${value}`, `400 ${bottomFontSize}px Arial, sans-serif`);
			const prevActiveGroup = windowContains.bottom[index - 1];
			const activeGroupData = {
				...activeGroupSizes,
				group,
				color: bottomColor,
				fontSize: bottomFontSize,
				text: `${group}: ${value}`,
				x: x + windowPadding.fromCap + windowPadding.horizontal,
				y: prevActiveGroup ? (prevActiveGroup.y + prevActiveGroup.height + windowPadding.fromActiveGroup) : (topContentData.y + topContentData.height + windowPadding.fromTopContent),
			};

			windowContains.top = topContentData;
			windowContains.bottom.push(activeGroupData);
		});

		// Определяем ширину окна
		const widthTopContain = windowContains.top.width;
		const maxWidthBottomContains = windowContains.bottom.map(({ width, }) => width).sort((a, b) => b - a)[0];
		const maxContainWidth = Math.max(widthTopContain, maxWidthBottomContains);
		const windowBlockWidth = maxContainWidth + windowPadding.horizontal * 2 + windowPadding.fromInnerLine + widthActiveGroupLine;

		// Определяем высоту окна
		const totalActiveGroupsHeight = windowContains.bottom.reduce((tHeight, { height, }, index) => {
			tHeight += height + (index < windowContains.bottom.length - 1 ? windowPadding.fromActiveGroup : 0);

			return tHeight;
		}, 0);
		const heightTopContent = windowContains.top.height + windowPadding.vertical + windowPadding.fromTopContent;
		const windowBlockHeight = totalActiveGroupsHeight + heightTopContent + windowPadding.vertical;

		const windowBlock = new WindowInfoBlock({
			width: windowBlockWidth,
			height: windowBlockHeight,
			ctx: this.ctx,
			color: this.blockInfo.background,
		});

		// Определяем позицию окна
		const windowBlockPosition = {
			x: this.activeGroups[0].x + windowPadding.fromCap,
			y: this.activeGroups[0].y,
		};

		// Рисуем окно
		windowBlock.drawWindow(...Object.values(windowBlockPosition));
		// Рисуем верхний контент
		windowBlock.drawContains(windowContains.top);
		// Рисуем активные группы
		windowContains.bottom.map((g) => windowBlock.drawContains(g));
		// Рисуем линии к активным группам
		windowContains.bottom.map(({ x, y, group, width, height, }) => {
			const colorLine = ((this.data[group].active || {}).line || (this.data[group].line || {})).color || this.line.color;
			const lineData = {
				start: {
					x: x + width + windowPadding.fromInnerLine,
					y,
				},
				to: {
					x: x + width + windowPadding.fromInnerLine,
					y: y - height,
				},
				color: colorLine,
				width: widthActiveGroupLine,
			};

			// Рисуем линию
			windowBlock.drawGroupLine(lineData);
		});
	}

	// Показывает окно с информацией активного элемента при движении мыши
	_showWindowInfoBlock() {
		this._drawWindowInfoBlock();

		const elemLeft = this.canvasElement.offsetLeft + this.canvasElement.clientLeft;
		const elemTop = this.canvasElement.offsetTop + this.canvasElement.clientTop;

		this.canvasElement.addEventListener("mousemove", (e) => {
			this.activeGroups = [];

			const x = e.pageX - elemLeft;
			const y = e.pageY - elemTop;

			const findMatchCaps = this.capsData.filter((cap) => {
				const capY = Math.floor(cap.y);
				const capX = Math.floor(cap.x);
				const capSize = cap.format === "circle" ? cap.size : cap.size / 2;

				if (y >= capY - (capSize + cap.strokeWidth) && y <= capY + (capSize + cap.strokeWidth)
					&& x >= capX - (capSize + cap.strokeWidth) && x <= capX + (capSize + cap.strokeWidth)) {
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
		this._resizeScreen();
		this._showWindowInfoBlock();

		return this;
	}
}

export default aCharty;