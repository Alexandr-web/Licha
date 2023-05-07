<div align="center">
  <h1>
    <b>Themes</b>
  </h1>
  <p>
    Here is a list of themes that you can apply to your chart
  </p>
</div>

* [Dark](https://github.com/Alexandr-web/Licha/blob/master/.github/themes/readme.md#dark)
* [Light](https://github.com/Alexandr-web/Licha/blob/master/.github/themes/readme.md#light)


We will take this piece of code as a basis, we will only change the parameters of the getTheme method

```js
import { Licha, Utils, } from "licha";

const utils = new Utils();

window.addEventListener("load", () => {
    new Licha({
        selectorCanvas: "canvas",
        theme: utils.getTheme(/** Will only change here */),
        fontFamily: "Poppins",
        blockInfo: {
            groups: {
                gaps: {
                    right: 5,
                    bottom: 10,
                },
            },
            title: { gaps: { bottom: 15, }, },
        },
        legend: {
            circle: { radius: 4, },
            place: "center",
            maxCount: 3,
            gaps: {
                circle: { right: 5, },
                group: {
                    right: 8,
                    bottom: 5,
                },
                legend: { bottom: 15, },
            },
        },
        title: {
            font: {
                text: "It's my new chart!!!",
                size: 20,
                weight: 400,
            },
            gaps: { bottom: 10, },
            place: "center",
        },
        axisX: {
            font: { showText: true, },
            ignoreNames: (n, i) => i % 2 !== 0,
            title: {
                font: {
                    text: "Year",
                    weight: 400,
                },
                gaps: { top: 15, },
            },
        },
        axisY: {
            font: { showText: true, },
            place: "right",
            step: 4,
            title: {
                font: {
                    weight: 400,
                    text: "Percent",
                },
                gaps: { right: 15, },
            },
            editValue: (val) => val + "%",
        },
        grid: {
            line: {
                width: 0.5,
                stretch: true,
            },
        },
        cap: {
            format: "circle",
            size: 5,
            stroke: { width: 2, },
        },
        data: {
            "Pink": {
                data: [
                    { name: 2010, value: 30, },
                    { name: 2011, value: 40, },
                    { name: 2012, value: 50, },
                    { name: 2013, value: 50.5142, },
                    { name: 2014, value: 60, },
                    { name: 2015, value: 80, },
                    { name: 2016, value: 15, },
                    { name: 2017, value: 16, },
                    { name: 2018, value: 17, },
                    { name: 2019, value: 12.321, },
                    { name: 2020, value: 11.3222, },
                    { name: 2021, value: 50, },
                    { name: 2022, value: 90.332131, }
                ],
            },
            "Purple": {
                data: [
                    { name: 2010, value: 80, },
                    { name: 2011, value: 34, },
                    { name: 2012, value: 65.2321, },
                    { name: 2013, value: 21.5142, },
                    { name: 2014, value: 93, },
                    { name: 2015, value: 22, },
                    { name: 2016, value: 52.32131, },
                    { name: 2017, value: 72.666, },
                    { name: 2018, value: 31.4211, },
                    { name: 2019, value: 79.321, },
                    { name: 2020, value: 90.3222, },
                    { name: 2021, value: 54.321, },
                    { name: 2022, value: 39.332131, }
                ],
            },
        },
    }).init();
});
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