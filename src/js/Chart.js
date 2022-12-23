import WindowInfoBlock from "./WindowInfoBlock";

class Chart {
  constructor({
    canvasSelector,
    background,
    data = {},
    line = {},
    cap = {},
    axisY = {},
    axisX = {},
    padding = {
      top: 10,
      left: 10,
      right: 10,
      bottom: 10,
    },
  }) {
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
    this.indentFromXAxisToGraph = 20;
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
    this.ctx.globalAlpha = Object.keys(this.activeGroup).length ? 0.5 : 1;

    if (group === this.activeGroup.group) {
      // Стили для активного колпачка
      const { active: { cap: activeCap = {}, }, } = this.activeGroup;
      const activeParams = {
        radius: activeCap.radius || radius,
        color: activeCap.color || color,
        stroke: activeCap.stroke || stroke,
      };

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = activeParams.color;
      this.ctx.arc(x, y, activeParams.radius, Math.PI * 2, false);

      // Установка обводки колпачка линии
      if (Object.keys(activeParams.stroke).length) {
        this.ctx.lineWidth = activeParams.stroke.width;
        this.ctx.strokeStyle = activeParams.stroke.color;
        this.ctx.stroke();
      }
    } else {
      // Стили для обычного колпачка
      this.ctx.fillStyle = color;
      this.ctx.arc(x, y, radius, Math.PI * 2, false);

      // Установка обводки колпачка линии
      if (Object.keys(stroke).length) {
        this.ctx.lineWidth = stroke.width;
        this.ctx.strokeStyle = stroke.color;
        this.ctx.stroke();
      }
    }
  }

  /**
   * Устанавливает стили для текста осей
   * @param {string} contain Содержание текста оси
   * @param {string} color Цвет
   * @param {number} fontSize Размер шрифта
   */
  _setStylesToAxisText({ contain, color, }) {
    this.ctx.globalAlpha = Object.keys(this.activeGroup).length ? 0.6 : 1;

    if ([this.activeGroup.name, this.activeGroup.value].includes(contain)) {
      const { active: { text: activeText = {}, }, } = this.activeGroup;
      const activeParams = { color: activeText.color || color, };

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = activeParams.color;
    } else {
      this.ctx.fillStyle = color;
    }
  }

  /**
   * Установка стилей для линий графика
   * @param {string} group Группа, в которой находится линия
   * @param {number} width Ширина
   * @param {string} color Цвет
   */
  _setStylesToChartLine({ group, width, color, }) {
    this.ctx.globalAlpha = Object.keys(this.activeGroup).length ? 0.5 : 1;

    if (group === this.activeGroup.group) {
      const { active: { line: activeLine = {}, }, } = this.activeGroup;
      const activeParams = {
        width: activeLine.width || width,
        color: activeLine.color || color,
      };

      this.ctx.globalAlpha = 1;
      this.ctx.lineWidth = activeParams.width;
      this.ctx.strokeStyle = activeParams.color;
    } else {
      this.ctx.lineWidth = width;
      this.ctx.strokeStyle = color;
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

  // Записывает уникальные данные осей графика
  _setUniqueValues() {
    const values = [];
    const names = [];

    for (const group in this.data) {
      const groupData = this.data[group].data;

      names.push(...groupData.map(({ name, }) => name));
      values.push(...groupData.map(({ value, }) => value));
    }

    this.uniqueValues = [...new Set(values)].sort((val1, val2) => val2 - val1);
    this.uniqueNames = [...new Set(names)];
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
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this._getCanvasSizes().width, this._getCanvasSizes().height);
  }

  /**
   * Ищет наибольший общий делитель
   * @param {number} num1 Первое число
   * @param {number} num2 Второе число
   * @returns {number} Наибольший общий делитель
   */
  _getNOD(num1, num2) {
    if ([num1, num2].includes(0)) {
      return 1;
    }

    if (num1 === num2) {
      return num1;
    }

    if (num1 > num2) {
      return this._getNOD(num1 - num2, num2);
    }

    return this._getNOD(num1, num2 - num1);
  }

  // Устанавливает ординату
  _setYAxis() {
    const firstValue = Math.ceil(this.uniqueValues[0]);
    const lastValue = Math.floor(this.uniqueValues[this.uniqueValues.length - 1]);
    const nod = this._getNOD(Math.abs(firstValue), Math.abs(lastValue));
    const valuesFromFirstValueToLastValue = [];
    const fontSize = this.axisY.fontSize;
    const color = this.axisY.color;

    // Добавляем все значения от начального до последнего с интервалом 1
    for (let i = firstValue; i >= lastValue; i--) {
      valuesFromFirstValueToLastValue.push(i);
    }

    // Добавляем целые значения в массив ординат
    valuesFromFirstValueToLastValue.map((value, index) => {
      this.ctx.beginPath();
      this.ctx.font = `400 ${fontSize}px Arial, sans-serif`;

      const text = this.ctx.measureText(value);
      const startPoint = this.padding.top + this.ctx.measureText(firstValue).actualBoundingBoxAscent / 2;
      const endPoint = this._getCanvasSizes().height - startPoint - this.padding.bottom - this.indentFromXAxisToGraph;
      const step = endPoint / (valuesFromFirstValueToLastValue.length - 1);
      const x = this.padding.left;
      const y = step * index + startPoint;
      const height = text.actualBoundingBoxAscent;

      this.axisYData.push({
        y,
        x,
        width: text.width,
        height,
        value,
        onScreen: value % nod === 0,
      });

      if (value % nod === 0) {
        this._setStylesToAxisText({ contain: value, color, fontSize, });
        this.ctx.fillText(value, x, y + height / 2);
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
          const text = this.ctx.measureText(n);
          const percentStr = ((n.toString().match(/\.\d{1,2}/) || [])[0] || "").replace(/\./, "") || n.toString();
          const percent = percentStr.length < 2 ? +percentStr * 10 : +percentStr;
          const height = text.actualBoundingBoxAscent;
          const area = Math.abs(findAxisYItem.y - findNextAxisYItem.y);
          const y = (percent * area) / 100;

          this.axisYData.push({
            x: this.padding.left,
            y: findNextAxisYItem.y - y,
            width: text.width,
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
      this.ctx.beginPath();
      this.ctx.font = `400 ${fontSize}px Arial, sans-serif`;

      const startPoint = this.ctx.measureText(firstName).width / 2 + this.padding.left + this._getMaxTextWidthAtYAxis();
      const endPoint = this._getCanvasSizes().width - this.ctx.measureText(lastName).width / 2 - startPoint - this.padding.right;
      const step = endPoint / (this.uniqueNames.length - 1);

      this._setStylesToAxisText({ contain: name, color, fontSize, });

      const text = this.ctx.measureText(name);
      const x = step * index + startPoint;
      const y = canvasHeight - this.padding.bottom;

      // Проверяем в каких группах находится это название
      for (const group in this.data) {
        const groupData = this.data[group].data;

        groupData.map((groupDataItem) => {
          if (groupDataItem.name === name) {
            // Добавление элемента оси абсцисс в массив
            this.axisXData.push({
              x,
              y,
              name,
              value: groupDataItem.value,
              width: text.width,
              height: text.actualBoundingBoxAscent,
              group,
            });
          }
        });
      }

      // Рисуем текст
      this.ctx.fillText(name, x - text.width / 2, y);
    });
  }

  // Устанавливает горизонтальные линии
  _setHorizontalLines() {
    if (Object.keys(this.axisX.line || {}).length) {
      this.axisYData.filter(({ onScreen, }) => onScreen).map(({ y, }) => {
        const firstXAxisItem = this.axisXData[0];
        const lastXAxisItem = this.axisXData[this.axisXData.length - 1];

        // Рисуем линию
        this.ctx.beginPath();
        this.ctx.moveTo(firstXAxisItem.x, y);
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = this.axisX.line.color;
        this.ctx.lineWidth = this.axisX.line.width;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(lastXAxisItem.x, y);
        this.ctx.stroke();
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
        this.ctx.beginPath();
        this.ctx.moveTo(findAxisXItem.x, firstAxisYItem.y);
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = this.axisY.line.color;
        this.ctx.lineWidth = this.axisY.line.width;
        this.ctx.lineCap = "round";
        this.ctx.lineTo(findAxisXItem.x, lastAxisYItem.y);
        this.ctx.stroke();
      });
    }
  }

  // Рисует график
  _setChart() {
    for (const group in this.data) {
      const {
        data: groupData,
        line: groupLine = {},
      } = this.data[group];

      groupData.map(({ value, name, }, index) => {
        const nextDataItem = groupData.find((groupDataItem, idx) => idx > index);
        // Находим элемент из ординаты, подходящий по значению
        const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);
        // Находим элемент из абсциссы, подходящий по имени
        const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name);
        const width = groupLine.width || this.line.width;
        const color = groupLine.color || this.line.color;

        // Начало линии
        this.ctx.beginPath();
        this.ctx.moveTo(findAxisXItem.x, findAxisYItem.y);
        this.ctx.lineJoin = "round";
        this._setStylesToChartLine({ group, width, color, });

        if (nextDataItem) {
          // Находим следующий элемент из ординаты, подходящий по значению
          const findNextAxisYItem = this.axisYData.find((nextAxisYItem) => nextAxisYItem.value === nextDataItem.value);
          // Находим следующий элемент из абсциссы, подходящий по имени
          const findNextAxisXItem = this.axisXData.find((nextAxisXItem) => nextAxisXItem.name === nextDataItem.name);

          // Направляем линию к следующему элементу
          this.ctx.lineTo(findNextAxisXItem.x, findNextAxisYItem.y);
        }

        // Рисуем линию
        this.ctx.stroke();
      });
    }
  }

  // Устанавливает колпачок на конец линии
  _setLinesCap() {
    for (const group in this.data) {
      const {
        data: groupData,
        cap: groupCap = {},
        active: groupActive = {},
      } = this.data[group];

      groupData.map(({ name, value, cap = {}, }) => {
        // Находим элемент из абсциссы, подходящий по имени
        const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name && axisXItem.group === group);
        // Находим элемент из ординаты, подходящий по значению
        const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);
        const x = findAxisXItem.x;
        const y = findAxisYItem.y;
        const radius = cap.radius || groupCap.radius || this.cap.radius;
        const color = cap.color || groupCap.color || this.cap.color;
        const stroke = cap.stroke || groupCap.stroke || this.cap.stroke || {};

        // Добавляем данные колпачка в массив
        this.capsData.push({
          x,
          y,
          group,
          value,
          name,
          radius,
          active: groupActive,
          strokeWidth: stroke.width || 0,
        });

        this.ctx.beginPath();
        // Применяем стили к колпачку
        this._setStylesToCap({ group, color, radius, stroke, x, y, });
        // Рисуем колпачок
        this.ctx.fill();
      });
    }
  }

  // Перерисовывает график при изменении размеров окна
  _drawWhenResizeScreen() {
    window.addEventListener("resize", () => this.update());
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
      top: group,
      bottom: `${name}: ${value}`,
    };
    const windowPadding = {
      vertical: 10,
      horizontal: 10,
      fromCap: 10,
      fromInnerLine: 10,
    };
    const maxContainWidth = [this.ctx.measureText(windowContains.top).width, this.ctx.measureText(windowContains.bottom).width].sort((a, b) => b - a)[0];
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
        y: y - windowBlock.height / 2 + this.ctx.measureText(group).actualBoundingBoxAscent + windowPadding.vertical,
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

    // Рисуем блок окна
    windowBlock.drawWindow(x + windowPadding.fromCap, y - windowBlock.height / 2);
    // Рисуем название группы
    windowBlock.drawContains(windowContains.top, containPositions.top.x, containPositions.top.y);
    // Рисуем значение
    windowBlock.drawContains(windowContains.bottom, containPositions.bottom.x, containPositions.bottom.y);
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
    this._setYAxis();
    this._setXAxis();
    this._setVerticalLines();
    this._setHorizontalLines();
    this._setChart();
    this._setLinesCap();
  }

  // Рисует график
  init() {
    this._setUniqueValues();
    this._setDefaultStylesToCanvas();
    this._setStylesToCanvas();
    this._setYAxis();
    this._setXAxis();
    this._setVerticalLines();
    this._setHorizontalLines();
    this._setChart();
    this._setLinesCap();
    this._drawWhenResizeScreen();
    this._showWindowInfoBlock();

    return this;
  }
}

export default Chart;