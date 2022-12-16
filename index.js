"use strict";

class Chart {
  constructor({
    canvasSelector,
    background = "black",
    data = {},
    line = {},
    cap = {},
    axisY = { fontSize: 12, color: "white", },
    axisX = { fontSize: 12, color: "white", },
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
    // Расстояние между горизонтальной линией и графиком
    this.indentFromXAxisToGraph = 15;
    // Расстояние между осями
    this.distanceBetweenAxles = 15;
    // Внутренние отступы графика
    this.padding = {
      vertical: 30,
      horizontal: 30,
    };
  }

  // Устанавливает размеры элементу canvas
  _setCanvasSizes() {
    const { offsetWidth, offsetHeight, } = this.canvasElement;

    this.canvasElement.width = offsetWidth;
    this.canvasElement.height = offsetHeight;
  }

  // Записывает уникальные данные осей графика
  _setUniqueValues() {
    const values = [];
    const names = [];

    for (let group in this.data) {
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
  _setCanvasStyles() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this._getCanvasSizes().width, this._getCanvasSizes().height);
  }

  // Устанавливает ординату
  _setYAxis() {
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    // Шаг, с которым рисуем текст по оси абсцисс
    const step = canvasHeight / (this.uniqueValues.length - 1);

    this.uniqueValues.map((value, index) => {
      this.ctx.font = `${this.axisY.fontSize}px Calibri`;
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.axisY.color;

      const text = this.ctx.measureText(value); // Здесь хранятся данные о текущем тексте
      const y = (step * index) + (text.actualBoundingBoxAscent + this.padding.vertical);
      const x = this.padding.horizontal;

      // Добавляем элемент оси ординат в массив
      this.axisYData.push({
        y: y - text.actualBoundingBoxAscent / 2, // Ставим по середине
        x,
        width: text.width,
        height: text.actualBoundingBoxAscent,
        value,
      });

      // Рисуем текст
      this.ctx.fillText(value, this.padding.horizontal, y);
    });
  }

  /**
   * Возвращает максимальную ширину текста в ординате
   * @returns {number} Ширина текста
   */
  _getMaxTextWidthAtYAxis() {
    const axisYItem = this.axisYData.sort(({ width: width1, }, { width: width2, }) => width2 - width1)[0];

    return axisYItem.width;
  }

  /**
   * Возвращает самую длинную группу (учитываются названия)
   * @returns {array} масси (группа)
   */
  _getMaxGroup() {
    let maxGroup = [];

    for (let group in this.data) {
      if (this.data[group].data.length > maxGroup.length) {
        maxGroup = this.data[group].data;
      }
    }

    return maxGroup;
  }

  // Устанавливает абсциссу
  _setXAxis() {
    // Размеры холста с учетом внутренних отступов
    const canvasWidth = this._getCanvasSizes().width - (this.padding.horizontal * 2 + this._getMaxTextWidthAtYAxis());
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical;

    this.uniqueNames.map((name) => {
      for (let group in this.data) {
        const groupData = this.data[group].data;
        const findGroupItem = groupData.find((groupItem) => groupItem.name === name);
        const findGroupIndex = groupData.findIndex((groupItem) => groupItem.name === name);

        if (findGroupItem) {
          // Шаг, с которым рисуем текст по оси абсцисс
          const step = canvasWidth / (this._getMaxGroup().length - 1);
          const { name, value, } = findGroupItem;

          this.ctx.font = `${this.axisX.fontSize}px Calibri`;
          this.ctx.fontKerning = "none";
          this.ctx.fillStyle = this.axisX.color;


          const text = this.ctx.measureText(name); // Здесь хранятся данные о текущем тексте
          const x = (step * findGroupIndex) + (text.width / 2 + this._getMaxTextWidthAtYAxis());
          const y = canvasHeight + text.actualBoundingBoxAscent + this.indentFromXAxisToGraph;

          // Рисуем текст
          this.axisXData.push({
            x,
            y,
            name,
            width: text.width,
            height: text.actualBoundingBoxAscent,
            value,
            group,
          });

          // Определяем его расположение на графике в зависимости от индекса
          switch (findGroupIndex) {
            case 0:
              // С правой стороны
              this.ctx.fillText(name, x, y);
              break;
            case this._getMaxGroup().length - 1:
              // С левой стороны
              this.ctx.fillText(name, x - text.width, y);
              break;
            default:
              // По середине
              this.ctx.fillText(name, x - text.width / 2, y);
          }
        }
      }
    });
  }

  // Устанавливает горизонтальные линии
  _setHorizontalLines() {
    if (Object.keys(this.axisX.line || {}).length) {
      this.uniqueValues.map((value) => {
        const findYAxisItem = this.axisYData.find((yAxisItem) => yAxisItem.value === value);
        const firstXAxisItem = this.axisXData[0];
        const lastXAxisItem = this.axisXData[this.axisXData.length - 1];

        // Рисуем линию
        this.ctx.beginPath();
        this.ctx.moveTo(firstXAxisItem.x, findYAxisItem.y);
        this.ctx.strokeStyle = this.axisX.line.color;
        this.ctx.lineWidth = this.axisX.line.width;
        this.ctx.lineTo(lastXAxisItem.x, findYAxisItem.y);
        this.ctx.stroke();
      });
    }
  }

  // Устанавливает вертикальные линии
  _setVerticalLines() {
    if (Object.keys(this.axisY.line || {}).length) {
      this._getMaxGroup().map(({ name, }) => {
        const findAxisXItem = this.axisXData.find((axisXDataItem) => axisXDataItem.name === name);
        const firstAxisYItem = this.axisYData[0];
        const lastAxisYItem = this.axisYData[this.axisYData.length - 1];

        // Рисуем линию
        this.ctx.beginPath();
        this.ctx.moveTo(findAxisXItem.x, firstAxisYItem.y);
        this.ctx.strokeStyle = this.axisY.line.color;
        this.ctx.lineWidth = this.axisY.line.width;
        this.ctx.lineTo(findAxisXItem.x, lastAxisYItem.y);
        this.ctx.stroke();
      });
    }
  }

  // Рисует график
  _setChart() {
    for (let group in this.data) {
      const {
        data: groupData,
        line: groupLine = {},
      } = this.data[group];

      groupData.map(({ value, name, group, }, index) => {
        const nextDataItem = groupData.find((groupDataItem, idx) => groupDataItem.group === group && idx > index);
        // Находим элемент из ординаты, подходящий по значению
        const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);
        // Находим элемент из абсциссы, подходящий по имени
        const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name);

        // Начало линии
        this.ctx.beginPath();
        // Начало линии
        this.ctx.moveTo(findAxisXItem.x, findAxisYItem.y);
        this.ctx.lineWidth = groupLine.width || this.line.width;
        this.ctx.strokeStyle = groupLine.color || this.line.color;
        this.ctx.lineJoin = "round";

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
    for (let group in this.data) {
      const { data: groupData, cap: groupCap = {}, } = this.data[group];

      groupData.map(({ name, value, }) => {
        // Находим элемент из абсциссы, подходящий по имени
        const findAxisXItem = this.axisXData.find((axisXItem) => axisXItem.name === name && axisXItem.group === group);
        // Находим элемент из ординаты, подходящий по значению
        const findAxisYItem = this.axisYData.find((axisYItem) => axisYItem.value === value);

        // Рисуем колпачок
        this.ctx.beginPath();
        this.ctx.arc(findAxisXItem.x, findAxisYItem.y, groupCap.radius || this.cap.radius, Math.PI * 2, false);
        this.ctx.fillStyle = groupCap.color || this.cap.color;
        this.ctx.fill();

        // Установка обводки колпачка линии
        if ("stroke" in this.cap) {
          this.ctx.lineWidth = this.cap.stroke.width;
          this.ctx.strokeStyle = this.cap.stroke.color;
          this.ctx.stroke();
        }
      });
    }
  }

  // Перерисовывает график при изменении размеров окна
  _drawWhenResizeScreen() {
    window.addEventListener("resize", () => this.update());
  }

  // Перерисовывает график
  update() {
    this.axisXData = [];
    this.axisYData = [];

    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
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
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setYAxis();
    this._setXAxis();
    this._setVerticalLines();
    this._setHorizontalLines();
    this._setChart();
    this._setLinesCap();
    this._drawWhenResizeScreen();

    return this;
  }
}