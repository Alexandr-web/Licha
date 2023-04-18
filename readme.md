<div align="center">
  <h1>
    <b>Sinera</b>
  </h1>
  <p>
    Sinera is a JavaScript project that will help you build a line chart
  </p>
</div>

* [Usage](https://github.com/Alexandr-web/Sinera#usage)
* [Params](https://github.com/Alexandr-web/Sinera#params)
* [Utils](https://github.com/Alexandr-web/Sinera#utils)
* [Works](https://github.com/Alexandr-web/Sinera/blob/master/.github/works/readme.md)

## Usage

How to use this tool?

```js
import { Sinera, Utils, } from "./dist/Sinera.js";

const utils = new Utils();

new Sinera({
    theme: utils.getTheme(0, "light"),
    padding: 10,
    selectorCanvas: "canvas",
    background: [utils.getColor("bistre"), utils.getColor("charcoal")],
    grid: { line: { width: 1, }, },
    data: {
        "Group 1": {
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
    },
}).init();
```

### Result

<img src="./.github/e1.PNG" />

## Params

Parameters passed to the Sinera class constructor

* [selectorCanvas](https://github.com/Alexandr-web/Sinera#selectorcanvas)
* [background](https://github.com/Alexandr-web/Sinera#background)
* [padding](https://github.com/Alexandr-web/Sinera#padding)
* [type](https://github.com/Alexandr-web/Sinera#type)
* [title](https://github.com/Alexandr-web/Sinera#title)
* [axisY](https://github.com/Alexandr-web/Sinera#axisy)
* [axisX](https://github.com/Alexandr-web/Sinera#axisx)
* [line](https://github.com/Alexandr-web/Sinera#line)
* [cap](https://github.com/Alexandr-web/Sinera#cap)
* [grid](https://github.com/Alexandr-web/Sinera#grid)
* [legend](https://github.com/Alexandr-web/Sinera#legend)
* [blockInfo](https://github.com/Alexandr-web/Sinera#blockinfo)
* [data](https://github.com/Alexandr-web/Sinera#data)
* [theme](https://github.com/Alexandr-web/Sinera#theme)

### `selectorCanvas`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts a canvas element selector  | `selectorCanvas: ".my-chart"`  | `string` |

### `background`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts the chart background | `background: "#ffffff"`  | `array<string> \| string` |

### `padding`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts an object of padding values for a chart | `padding: { top: 10, right: 10, bottom: 10, ... } or just 10`  | `object \| number` |

#### Accepted parameters
  
  * #### `top`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Top padding size | `padding: { top: 25, }`  | `number` |

  * #### `right`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Right padding size | `padding: { right: 25, }`  | `number` |
  
  * #### `bottom`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Bottom padding size | `padding: { bottom: 25, }`  | `number` |

  * #### `left`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Left padding size | `padding: { left: 25, }`  | `number` |

### `type`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts a chart type | `type: "line"`  | `string` |

### `title`
| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts options related to the title of the chart | `title: { font: { ... }, gaps: { ... }, }`  | `object` |

#### Accepted parameters

  * #### `font`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts a data object related to font and text | `title: { font: { size: 16, color: "white", ... }, }`  | `object` |

    ##### Accepted parameters

    * ##### `text`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts title text | `title: { font: { text: "My Chart!", }, }`  | `string` |

    * ##### `size`
    
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a font size | `title: { font: { size: 18, }, }`  | `number` |

    * ##### `color`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a font color | `title: { font: { color: "black", }, }`  | `string` |

    * ##### `weight`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts font weight | `title: { font: { weight: 400, }, }`  | `number` |


  * #### `gaps`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Contains title gaps | `title: { gaps: { bottom: 15, }, }`  | `object` |

    ##### Accepted parameters

    * ##### `bottom`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Bottom gap | `title: { gaps: { bottom: 15, }, }`  | `number` |

### `axisY`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts data related to the chart's ordinate | `axisY: { font: { ... }, step: 3, ... }`  | `object` |

#### Accepted parameters

  * #### `font`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts a data object related to font and text at points | `axisY: { font: { size: 16, color: "white", ... }, }`  | `object` |

    ##### Accepted parameters

    * ##### `size`
    
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a font size | `axisY: { font: { size: 18, }, }`  | `number` |

    * ##### `color`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a font color | `axisY: { font: { color: "black", }, }`  | `string` |

    * ##### `weight`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts font weight | `axisY: { font: { weight: 400, }, }`  | `number` |

    * ##### `showText`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | The rule under which you can control the state of the text on the axis | `axisY: { font: { showText: false, }, }`  | `boolean` |
  
  * #### `step`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Step with which values will be drawn on the y-axis (Default 3) | `axisY: { step: 4, }`  | `number` |

  * #### `editValue`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | A method that allows you to change the appearance of a value on the y-axis | `axisY: { editValue: (val) => val + "$", }`  | `function: string` |

  * #### `sort`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Takes a value that is related to how the points will be displayed on the y-axis | `axisY: { sort: "less-more" }` or `axisY: { sort: "more-less" }` | `string` |

  * #### `title`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Receives data related to the title | `axisY: { title: { font: { ... }, ... } }`  | `object` |

    ##### Accepted parameters

    * ##### `font`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a data object related to font and text at title | `axisY: { title: { font: { size: 16, color: "white", ... }, }, }`  | `object` |

      ##### Accepted parameters

      * ##### `text`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts title text | `axisY: { title: { font: { text: "My Chart!", }, }, }`  | `string` |

      * ##### `size`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font size | `axisY: { title: { font: { size: 18, }, }, }`  | `number` |

      * ##### `color`
  
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font color | `axisY: { title: { font: { color: "black", }, }, }`  | `string` |

      * ##### `weight`
  
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts font weight | `axisY: { title: { font: { weight: 400, }, }, }`  | `number` |

    * #### `gaps`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Contains title gaps | `axisY: { title: { gaps: { right: 15, }, }, }`  | `object` |

    ##### Accepted parameters

      * ##### `right`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Gap right | `axisY: { title: { gaps: { right: 15, }, }, }`  | `number` |

### `axisX`
| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts data associated with the chart's abscissa | `axisX: { font: { ... }, ... }`  | `object` |

#### Accepted parameters

  * #### `rotate`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Flips the x-axis point names by 90 degrees | `axisX: { rotate: true, }`  | `boolean` |

  * #### `place`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Allows you to change the position of the x-axis (top or bottom) | `axisX: { place: "top", }`  | `string` |

  * #### `font`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts a data object related to font and text at points | `axisX: { font: { size: 16, color: "white", ... }, }`  | `object` |

    ##### Accepted parameters

    * ##### `showText`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | The rule under which you can control the state of the text on the axis | `axisX: { font: { showText: false, }, }`  | `boolean` |

    * ##### `size`
    
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a font size | `axisX: { font: { size: 18, }, }`  | `number` |

    * ##### `color`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a font color | `axisX: { font: { color: "black", }, }`  | `string` |

    * ##### `weight`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts font weight | `axisX: { font: { weight: 400, }, }`  | `number` |
  
  * #### `ignoreNames`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Contains the names of the x-axis points that will not be drawn on the chart | `axisX: { ignoreNames: (name, index) => index % 2 === 0, }` or `axisX: { ignoreNames: ["Monday", "Sunday"], }` | `function: boolean \| array<string>` |

  * #### `editName`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | A method that allows you to change the appearance of a value along the x-axis | `axisX: { editName: (name) => new Date(name).toLocaleString(), }`  | `function: string` |

  * #### `sort`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Takes a value that is related to how the points will be displayed on the x-axis | `axisX: { sort: "less-more" }` or `axisX: { sort: "more-less" }` | `string` |

  * #### `title`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Receives data related to the title | `axisX: { title: { font: { ... }, ... } }`  | `object` |

    ##### Accepted parameters

    * ##### `font`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts a data object related to font and text at title | `axisX: { title: { font: { size: 16, color: "white", ... }, }, }`  | `object` |

      ##### Accepted parameters

      * ##### `text`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts title text | `axisX: { title: { font: { text: "My Chart!", }, }, }`  | `string` |

      * ##### `size`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font size | `axisX: { title: { font: { size: 18, }, }, }`  | `number` |

      * ##### `color`
  
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font color | `axisX: { title: { font: { color: "black", }, }, }`  | `string` |

      * ##### `weight`
  
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts font weight | `axisX: { title: { font: { weight: 400, }, }, }`  | `number` |

    * #### `gaps`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Contains title gaps | `axisX: { title: { gaps: { top: 15, }, }, }`  | `object` |

      ##### Accepted parameters

      * ##### `top`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Gap top | `axisX: { title: { gaps: { top: 15, }, }, }`  | `number` |

### `line`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts data that applies to each line of all groups | `line: { stepped: true, width: 2, ... }`  | `object` |

#### Accepted parameters
  
  * #### `fill`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Fill line | `line: { fill: ["rgba(255,255,255,0.4)", "transparent"], }` or `line: { fill: "white", }`  | `array<string> \| string` |

  * #### `stepped`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Rule that will draw the line step by step (default false) | `line: { stepped: true, }`  | `boolean` |

  * #### `color`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Line color | `line: { color: "red", }`  | `array<string> \| string` |
  
  * #### `dotted`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Rule that says the line will be made up of dots | `line: { dotted: true, }`  | `boolean` |

  * #### `width`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Line width (default 1) | `line: { width: 2, }`  | `number` |

### `cap`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts data that applies to each cap of all groups | `cap: { format: "circle", size: 6, ... }`  | `object` |

#### Accepted parameters
  
  * #### `format`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Cap format ("square" or "circle" or "rhomb" (default "circle")) | `cap: { format: "square", }`  | `string` |

  * #### `color`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Line cap | `cap: { color: "red", }`  | `array<string> \| string` |
  
  * #### `size`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Cap size | `cap: { size: 8, }`  | `number` |

  * #### `stroke`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts data related to cap stroke | `cap: { stroke: { width: 1, ... }, }`  | `object` |

    ##### Accepted parameters

      * ##### `width`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Stroke width | `cap: { stroke: { width: 2, }, }`  | `number` |

      * ##### `color`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Stroke color | `cap: { stroke: { color: "black", } }`  | `string` |

### `grid`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts data related to the chart grid | `grid: { line: { ... }, ... }`  | `object` |

#### Accepted parameters
  
  * #### `background`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts background grid | `grid: { background: "#c2c2c2", }`  | `array<string> \| string` |

  * #### `format`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Grid format ("horizontal" or "vertical" (default "default")) | `grid: { format: "vertical", }`  | `string` |

  * #### `line`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Grid line data | `grid: { line: { ... }, }`  | `object` |

    ##### Accepted parameters

      * ##### `stretch`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Rule that says grid lines will extend to axis points | `grid: { line: { stretch: true, }, }`  | `boolean` |

      * ##### `width`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Gird line width | `grid: { line: { width: 2, }, }`  | `number` |

      * ##### `color`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Gird line color | `grid: { line: { color: "grey", } }`  | `array<string> \| string` |

      * ##### `dotted`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Rule that says the line will be made up of dots | `grid: { line: { dotted: true, } }`  | `boolean` |

### `legend`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts data related to the chart legend | `legend: { font: { ... }, circle: { ... }, ... }`  | `object` |

#### Accepted parameters

  * #### `events`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts event handlers | `legend: { events: { ... }, }`  | `object` |

    ##### Accepted parameters

    * ##### `onClick`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Called when the legend element is clicked | `legend: { events: { onClick() { console.log(this) }, }, }`  | `function` |

  * #### `circle`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts a data object associated with the circle of the legend element. | `legend: { circle: { ... }, }`  | `object` |

    ##### Accepted parameters

      * ##### `radius`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Circle radius | `legend: { circle: { radius: 18, }, }`  | `number` |
  
  * #### `font`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts a data object related to font and text at legend items | `legend: { font: { ... }, }`  | `object` |

    ##### Accepted parameters

      * ##### `size`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font size | `legend: { font: { size: 18, }, }`  | `number` |

      * ##### `color`
  
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font color | `legend: { font: { color: "black", }, }`  | `string` |

      * ##### `weight`
  
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts font weight | `legend: { font: { weight: 400, }, }`  | `number` |

  * #### `gaps`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts data related to the padding of both the legend elements and the legend itself. | `legend: { gaps: { ... }, }`  | `object` |

    ##### Accepted parameters

      * ##### `circle`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts data related to circle offsets for legend items | `legend: { gaps: { circle: { ... }, }, }`  | `object` |

        ###### Accepted parameters

        * ###### `right`
          
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Indent to the right of the circle | `legend: { gaps: { circle: { right: 5, }, }, }`  | `number` |

      * ##### `group`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts data related to the indentation of group names | `legend: { gaps: { group: { ... }, }, }`  | `object` |

        ###### Accepted parameters

        * ###### `right`
          
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Indent to the right of the group | `legend: { gaps: { group: { right: 5, }, }, }`  | `number` |

        * ###### `bottom`
          
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Indent to the bottom of the group | `legend: { gaps: { group: { bottom: 5, }, }, }`  | `number` |

      * ##### `legend`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts data related to the indentation of legend | `legend: { gaps: { legend: { ... }, }, }`  | `object` |

        ###### Accepted parameters

        * ###### `bottom`
          
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Indent to the bottom of the legend | `legend: { gaps: { legend: { bottom: 5, }, }, }`  | `number` |

### `blockInfo`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Receives data related to the window with information about the active group | `blockInfo: { ... }`  | `object` |

#### Accepted parameters

  * #### `background`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Window background | `blockInfo: { background: "black", }`  | `array<string> \| string` |

  * #### `events`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts event handlers | `blockInfo: { events: { ... }, }`  | `object` |

    ##### Accepted parameters

    * ##### `onAimed`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Called when a block with information about the active element is hovered over a point | `blockInfo: { events: { onAimed() { console.log(this) }, }, }`  | `function` |

  * #### `groups`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts data related to group names | `blockInfo: { groups: { ... }, }`  | `object` |

    ##### Accepted parameters
  
    * ##### `font`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts data related to the font of group names | `blockInfo: { groups: { font: { ... }, }, }`  | `object` |

      ###### Accepted parameters

      * ###### `size`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font size | `blockInfo: { groups: { font: { size: 5, }, }, }`  | `number` |

      * ###### `color`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font color | `blockInfo: { groups: { font: { color: "white", }, }, }`  | `string` |

      * ###### `weight`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts font weight | `blockInfo: { groups: { font: { weight: 400, }, }, }`  | `number` |

    * ##### `gaps`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Right padding size | `blockInfo: { padding: { right: 25, } }`  | `number` |

      ###### Accepted parameters

      * ###### `bottom`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Indent bottom | `blockInfo: { groups: { gaps: { bottom: 15, }, }, }`  | `number` |

      * ###### `right`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Indent right | `blockInfo: { groups: { gaps: { right: 15, }, }, }`  | `number` |

  * #### `title`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Accepts parameters related to the title of the window | `blockInfo: { title: { ... }, }`  | `object` |

    ##### Accepted parameters
  
    * ##### `font`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts data related to the font of the title | `blockInfo: { title: { font: { ... }, } }`  | `object` |

      ###### Accepted parameters

      * ###### `size`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font size | `blockInfo: { title: { font: { size: 5, }, }, }`  | `number` |

      * ###### `color`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts a font color | `blockInfo: { title: { font: { color: "white", }, }, }`  | `string` |

      * ###### `weight`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts font weight | `blockInfo: { title: { font: { weight: 400, }, }, }`  | `number` |

    * ##### `gaps`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Right padding size | `blockInfo: { padding: { right: 25, } }`  | `number` |

      ###### Accepted parameters

      * ###### `bottom`
          
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Indent bottom | `blockInfo: { title: { gaps: { bottom: 15, }, }, }`  | `number` |

  * #### `padding`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Receives data related to window padding | `blockInfo: { padding: { ... } or just 10, }`  | `object \| number` |

    ##### Accepted parameters
  
    * ##### `top`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Top padding size | `blockInfo: { padding: { top: 25, }, }`  | `number` |

    * ##### `right`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Right padding size | `blockInfo: { padding: { right: 25, } }`  | `number` |
  
    * ##### `bottom`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Bottom padding size | `blockInfo: { padding: { bottom: 25, } }`  | `number` |

    * ##### `left`
  
      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Left padding size | `blockInfo: { padding: { left: 25, } }`  | `number` |

### `data`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts group data to be displayed on the chart | `data: { "My group": { ... }, }`  | `object` |

  #### Accepted parameters

  * #### Group

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | A key whose name will mean a separate data group to which you can apply different styles | `data: { "My group": { line: { ... }, }, }`  | `object` |

    ##### Accepted parameters

    * ##### `data`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Group data to be displayed on the chart | `data: { "My group": { data: [ ... ], }, }`  | `array<object>` |

      ###### Accepted parameters

      * ###### Group data object

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Contains the name and value of the group data | `data: { "My group": { data: [{ ... }], }, }`  | `object` |

        ###### Accepted parameters

        * ###### `name`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Data name | `data: { "My group": { data: [{ name: "Tuesday", ... }], }, }`  | `string \| number` |

        * ###### `value`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Data value | `data: { "My group": { data: [{ name: "Tuesday", value: 10, }], }, }`  | `number` |

    * ##### `cap`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Gets the data owned by this group's cap | `data: { "My group": { cap: { ... }, }, }`  | `object` |

      ###### Accepted parameters

      * ###### `format`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Cap format ("square" or "circle" (default "circle")) | `data: { "My group": { cap: { format: "sqaure" }, }, }`  | `string` |

      * ###### `color`
        
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Line cap | `data: { "My group": { cap: { color: "red" }, }, }`  | `array<string> \| string` |
        
      * ###### `size`
        
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Cap size | `data: { "My group": { cap: { size: 6 }, }, }`  | `number` |

      * ###### `stroke`
        
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Accepts data related to cap stroke | `data: { "My group": { cap: { stroke: { ... }, }, }, }`  | `object` |

        ###### Accepted parameters

        * ##### `width`

          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Stroke width | `data: { "My group": { cap: { stroke: { width: 2 }, }, }, }`  | `number` |

        * ##### `color`
        
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Stroke color | `data: { "My group": { cap: { stroke: { color: "red", }, }, }, }`  | `string` |

      * ##### `line`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Receives data that belongs to the line of this group | `data: { "My group": { line: { ... }, }, }`  | `object` |

        ###### Accepted parameters

        * ###### `fill`

          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Fill line | `data: { "My group": { line: { fill: ["rgba(255,255,255,0.4)", "transparent"], } }, }` or `data: { "My group": { line: { fill: "white", } }, }`  | `array<string> \| string` |

        * ###### `stepped`

          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Rule that will draw the line step by step (default false) | `data: { "My group": { line: { stepped: true, }, }, }`  | `boolean` |

        * ###### `color`
        
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Line color | `data: { "My group": { line: { color: "white", }, }, }`  | `array<string> \| string` |
        
        * ###### `dotted`
        
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Rule that says the line will be made up of dots | `data: { "My group": { line: { dotted: true, }, }, }`  | `boolean` |

        * ###### `width`
        
          | Description  | Example | Type |
          | ------------- | ------------- | ------------- |
          | Line width (default 1) | `data: { "My group": { line: { width: 2, }, }, }`  | `number` |

### `theme`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts a data object belonging to the same theme. [More](https://github.com/Alexandr-web/Sinera#utils) | `theme: new Utils(0, "light")`  | `object` |

## Utils

The Utils class contains helper resources such as themes and various colors

### How to choose and apply a theme? [View all themes](https://github.com/Alexandr-web/Sinera/blob/master/.github/themes/readme.md)

```js
const utils = new Utils();

// Accepts index and theme
// The default index is 0 and the theme is dark
new Sinera({ theme: utils.getTheme(2, "light") }).init();
```

### How to apply any color? [View all colors](https://github.com/Alexandr-web/Sinera/blob/master/.github/colors/readme.md)

```js
const utils = new Utils();

// Accepts the name of the color and its transparency (default 1)
new Sinera({ background: utils.getColor("jet", 0.6) }).init();
```
