import ACharty from "./ACharty";
import Utils from "./Utils/Utils";

const utils: Utils = new Utils();
const chart: ACharty = new ACharty({
  theme: utils.getTheme(20),
  selectorCanvas: "canvas",
  background: "transparent",
  legend: {
    font: { size: 16, },
    circle: { radius: 4, },
    gaps: {
      circle: { right: 8, },
      group: { right: 8, bottom: 10, },
      legend: { bottom: 10, },
    },
  },
  axisX: { font: { size: 16, }, },
  axisY: { font: { size: 16, }, },
  cap: {
    format: "square",
    size: 10,
    stroke: { width: 2, },
  },
  data: {
    "Group 1": {
      data: [
        { name: "Monday", value: 10, },
        { name: "Tuesday", value: 50, },
        { name: "Wednesday", value: 10, },
        { name: "Thuesday", value: 35, },
        { name: "Friday", value: 5, },
        { name: "Saturday", value: 50, },
        { name: "Sunday", value: 32, }
      ],
    },
    "Group 2": {
      data: [
        { name: "Monday", value: 51.231, },
        { name: "Tuesday", value: 52.42141, },
        { name: "Wednesday", value: 550, },
        { name: "Thuesday", value: 315, },
        { name: "Friday", value: 93, },
        { name: "Saturday", value: -33, },
        { name: "Sunday", value: 441, }
      ],
    },
  },
}).init();