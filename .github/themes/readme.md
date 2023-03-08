<div align="center">
  <h1>
    <b>Themes</b>
  </h1>
  <p>
    Here is a list of themes that you can apply to your chart
  </p>
</div>

* [Dark](https://github.com/Alexandr-web/aCharty/tree/documentation/.github/themes#dark)
* [Light](https://github.com/Alexandr-web/aCharty/tree/documentation/.github/themes#light)


We will take this piece of code as a basis, we will only change the parameters of the getTheme method

```js
new ACharty({
  theme: utils.getTheme(/** Will only change here */),
  padding: { left: 20, },
  selectorCanvas: "canvas",
  title: {
    font: {
      size: 19,
      text: "Title",
    },
    gapBottom: 10,
  },
  blockInfo: {
    padding: {
      top: 10,
      left: 10,
      bottom: 10,
      right: 10,
    },
    title: {
      font: { size: 16, },
      gaps: { bottom: 20, },
    },
    groups: {
      font: { size: 12, },
      gaps: { bottom: 10, right: 10, },
    },
  },
  legend: {
    font: { size: 16, },
    circle: { radius: 4, },
    gaps: {
      circle: { right: 8, },
      group: { right: 8, bottom: 10, },
      legend: { bottom: 10, },
    },
  },
  axisX: {
    font: { size: 16, },
    title: {
      font: { size: 18, text: "Days", },
      gapTop: 25,
    },
  },
  axisY: {
    font: { size: 16, },
    step: 3,
    title: {
      font: {
        size: 18,
        text: "Sold",
      },
      gapRight: 25,
    },
    editValue: (val) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumSignificantDigits: 1, }).format(val),
  },
  cap: {
    format: "square",
    size: 10,
    stroke: { width: 2, },
  },
  grid: {
    line: {
        width: 1,
        dotted: true,
    },
    format: "horizontal", 
  },
  line: { width: 3, },
  data: {
    "Group 1": {
      cap: { format: "circle", size: 6, },
      data: [
        { name: "Monday", value: 100_000, },
        { name: "Tuesday", value: 50_000, },
        { name: "Wednesday", value: 10_000, },
        { name: "Thuesday", value: 35_000, },
        { name: "Friday", value: 5000, },
        { name: "Saturday", value: 50_000, },
        { name: "Sunday", value: 32_000, }
      ],
    },
    "Group 2": {
      data: [
        { name: "Monday", value: 5000, },
        { name: "Tuesday", value: 1200, },
        { name: "Wednesday", value: 41_000, },
        { name: "Thuesday", value: 23_999.4121, },
        { name: "Friday", value: 5000.42141, },
        { name: "Saturday", value: 16_000, },
        { name: "Sunday", value: 8400, }
      ],
    },
  },
}).init();
```

## Dark

### Number 0
<img src="./dark-0.PNG" />

### Number 1
<img src="./dark-1.PNG" />

### Number 2
<img src="./dark-2.PNG" />

### Number 3
<img src="./dark-3.PNG" />

### Number 4
<img src="./dark-4.PNG" />

### Number 5
<img src="./dark-5.PNG" />

### Number 6
<img src="./dark-6.PNG" />

### Number 7
<img src="./dark-7.PNG" />

### Number 8
<img src="./dark-8.PNG" />

### Number 9
<img src="./dark-9.PNG" />

### Number 10
<img src="./dark-10.PNG" />

### Number 11
<img src="./dark-11.PNG" />

### Number 12
<img src="./dark-12.PNG" />

### Number 13
<img src="./dark-13.PNG" />

### Number 14
<img src="./dark-14.PNG" />

### Number 15
<img src="./dark-15.PNG" />

### Number 16
<img src="./dark-16.PNG" />

### Number 17
<img src="./dark-17.PNG" />

### Number 18
<img src="./dark-18.PNG" />

### Number 19
<img src="./dark-19.PNG" />

### Number 20
<img src="./dark-20.PNG" />

### Number 21
<img src="./dark-21.PNG" />

### Number 22
<img src="./dark-22.PNG" />

### Number 23
<img src="./dark-23.PNG" />

### Number 24
<img src="./dark-24.PNG" />

## Light

### Number 0
<img src="./light-0.PNG" />

### Number 1
<img src="./light-1.PNG" />

### Number 2
<img src="./light-2.PNG" />

### Number 3
<img src="./light-3.PNG" />

### Number 4
<img src="./light-4.PNG" />