"use strict";

class Chart {
  constructor({ canvasSelector, data, background, colorLine, colorVerticalLegend, colorHorizontalLegend, }) {
    this.canvasElement = document.querySelector(canvasSelector);
    this.ctx = this.canvasElement.getContext("2d");
    this.background = background;
    this.colorVerticalLegend = colorVerticalLegend;
    this.colorHorizontalLegend = colorHorizontalLegend;
    this.lineDistanceFromLegend = 10;
    this.colorLine = colorLine;
    this.data = data;
    this.uniqueValues = [];
    this.horizontalLegend = [];
    this.verticalLegend = [];
    this.padding = {
      vertical: 15,
      horizontal: 15,
    };
  }

  _setCanvasSizes() {
    const { offsetWidth, offsetHeight, } = this.canvasElement;

    this.canvasElement.width = offsetWidth;
    this.canvasElement.height = offsetHeight;
  }

  _setUniqueValues() {
    this.uniqueValues = [...new Set(this.data.map(({ value, }) => value))].sort((val1, val2) => val2 - val1);
  }

  _getCanvasSizes() {
    const { width, height, } = this.canvasElement;

    return {
      width,
      height,
    };
  }

  _setCanvasStyles() {
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this._getCanvasSizes().width, this._getCanvasSizes().height);
  }

  _setVerticalLegend() {
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    const step = canvasHeight / this.uniqueValues.length;

    this.uniqueValues.map((value, index) => {
      this.ctx.font = "12px Calibri";
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.colorVerticalLegend;

      const text = this.ctx.measureText(value);
      const y = step * index + step - text.actualBoundingBoxAscent;
      const x = this.padding.horizontal;

      this.verticalLegend.push({
        y: y - text.actualBoundingBoxAscent / 2,
        x,
        width: text.width,
        height: text.actualBoundingBoxAscent,
        value,
      });

      this.ctx.fillText(value, this.padding.horizontal, y);
    });
  }

  _getMaxTextWidthAtVerticalLegend() {
    const verticalLegendItem = this.verticalLegend.sort(({ width: width1, }, { width: width2, }) => width2 - width1)[0];

    return verticalLegendItem.width;
  }

  _setHorizontalLegend() {
    const canvasWidth = this._getCanvasSizes().width - this.padding.horizontal * 2;
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    const step = canvasWidth / this.data.length;

    this.data.map(({ name, value, }, index) => {
      this.ctx.font = "12px Calibri";
      this.ctx.textBaseline = "middle";
      this.ctx.fontKerning = "none";
      this.ctx.fillStyle = this.colorHorizontalLegend;

      const text = this.ctx.measureText(name);
      const x = (step * index) + this.padding.horizontal + this._getMaxTextWidthAtVerticalLegend() + this.lineDistanceFromLegend;
      const y = canvasHeight;

      this.horizontalLegend.push({
        x,
        y,
        name,
        width: text.width,
        height: text.actualBoundingBoxAscent,
        value,
      });

      this.ctx.fillText(name, x - text.width / 2, y);
    });
  }

  _setHorizontalLines() {
    const canvasHeight = this._getCanvasSizes().height - this.padding.vertical * 2;
    const canvasWidth = this._getCanvasSizes().width - this.padding.horizontal * 2;
    const step = canvasHeight / this.uniqueValues.length;

    this.data.map(({ value, }, index) => {
      const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === value);
      const y = (step * index) + (step - findVerticalLegendItem.height) - (findVerticalLegendItem.height / 2);
      const x = this.padding.horizontal + this._getMaxTextWidthAtVerticalLegend() + this.lineDistanceFromLegend;

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.strokeStyle = "grey";
      this.ctx.lineTo(canvasWidth, y);
      this.ctx.stroke();
    });
  }

  _setLines() {
    for (let i = 0; i < this.data.length; i++) {
      const dataItem = this.data[i];
      const nextDataItem = this.data[i + 1];
      const findVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === dataItem.value);
      const findHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === dataItem.name);

      this.ctx.beginPath();
      this.ctx.moveTo(findHorizontalLegendItem.x, findVerticalLegendItem.y);
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = dataItem.colorLine || this.colorLine;
      this.ctx.lineJoin = "round"

      if (nextDataItem) {
        const findNextVerticalLegendItem = this.verticalLegend.find((verticalLegendItem) => verticalLegendItem.value === nextDataItem.value);
        const findNextHorizontalLegendItem = this.horizontalLegend.find((horizontalLegendItem) => horizontalLegendItem.name === nextDataItem.name);

        this.ctx.lineTo(findNextHorizontalLegendItem.x, findNextVerticalLegendItem.y);
      }

      this.ctx.stroke();
    }
  }

  _drawWhenResizeScreen() {
    window.addEventListener("resize", () => this.update());
  }

  update() {
    this.horizontalLegend = [];
    this.verticalLegend = [];

    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setVerticalLegend();
    this._setHorizontalLegend();
    this._setHorizontalLines();
    this._setLines();
  }

  init() {
    this._setUniqueValues();
    this._setCanvasSizes();
    this._setCanvasStyles();
    this._setVerticalLegend();
    this._setHorizontalLegend();
    this._setHorizontalLines();
    this._setLines();
    this._drawWhenResizeScreen();

    return this;
  }
}

const myChart = new Chart({
  canvasSelector: ".canvas",
  background: "#222222",
  colorLine: "#9457EB",
  colorVerticalLegend: "#c2c2c2",
  colorHorizontalLegend: "#c2c2c2",
  data: [
    {
      name: "Name 1",
      value: 0,
    },
    {
      name: "Name 2",
      value: -100,
    },
    {
      name: "Name 3",
      value: 100,
    },
    {
      name: "Name 4",
      value: 1000,
    },
    {
      name: "Name 5",
      value: -1000,
    },
    {
      name: "Name 6",
      value: 10000,
    },
    {
      name: "Name 7",
      value: 0,
    },
  ],
}).init();