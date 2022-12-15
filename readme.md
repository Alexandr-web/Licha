# MyChart

## Example

### HTML
```html
<canvas class="canvas"></canvas>
```

### JS

```js
const myChart = new Chart({
  canvasSelector: ".canvas",
  background: "black",
  colorVerticalLegend: "white",
  colorHorizontalLine: "#c2c2c2",
  colorHorizontalLegend: "white",
  line: {
    color: "#CC397B",
    width: 3,
  },
  cap: {
    color: "#CC005C",
    radius: 3,
  },
  data: [
    { name: "Name 1", value: 0, },
    { name: "Name 2", value: 10, },
    { name: "Name 3", value: 5, },
    { name: "Name 4", value: 15, },
    { name: "Name 5", value: 35, },
  ],
}).init();
```

### Result
<img src="./example.jpg" alt="bar chart" />

## You can also change the chart data and update it to render

```js
const myChart = new Chart({ ... }).init();

setTimeout(() => {
  // Removing 1 element
  myChart.data.splice(0, 1);
  // Redrawing
  myChart.update();
}, 1000);
```