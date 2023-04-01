<div align="center">
  <h1>
    <b>aCharty</b>
  </h1>
  <p>
    aCharty is a JavaScript project that will help you build a line chart
  </p>
</div>

* [Usage](https://github.com/Alexandr-web/aCharty#usage)
* [Params](https://github.com/Alexandr-web/aCharty#params)
* [Utils](https://github.com/Alexandr-web/aCharty#utils)

## Usage

How to use this tool?

```js
import { ACharty, Utils, } from "./dist/ACharty.js";

const utils = new Utils();
const chart = new ACharty({
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
  axisY: {
    font: { size: 16, },
    step: 3,
  },
  cap: {
    format: "circle",
    size: 6,
    stroke: { width: 2, },
  },
  data: {
    "Group 1": {
      line: { stepped: true, },
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
  },
}).init();
```

### Result

<img src="./.github/e1.PNG" />

## Params

Parameters passed to the ACharty class constructor

* [selectorCanvas](https://github.com/Alexandr-web/aCharty#selectorcanvas)
* [background](https://github.com/Alexandr-web/aCharty#background)
* [padding](https://github.com/Alexandr-web/aCharty#padding)
* [type](https://github.com/Alexandr-web/aCharty#type)
* [title](https://github.com/Alexandr-web/aCharty#title)
* [axisY](https://github.com/Alexandr-web/aCharty#axisy)
* [axisX](https://github.com/Alexandr-web/aCharty#axisx)
* [line](https://github.com/Alexandr-web/aCharty#line)
* [cap](https://github.com/Alexandr-web/aCharty#cap)
* [grid](https://github.com/Alexandr-web/aCharty#grid)
* [legend](https://github.com/Alexandr-web/aCharty#legend)
* [blockInfo](https://github.com/Alexandr-web/aCharty#blockinfo)
* [data](https://github.com/Alexandr-web/aCharty#data)
* [theme](https://github.com/Alexandr-web/aCharty#theme)

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
| Accepts an object of padding values for a chart | `padding: { top: 25, right: 15, bottom: 10, ... }`  | `object` |

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
| Accepts options related to the title of the chart | `title: { font: { ... }, gapBottom: 10, }`  | `object` |

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


  * #### `gapBottom`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Bottom gap | `title: { gapBottom: 15, }`  | `number` |

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

    * #### `gapRight`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts gap on the right | `axisY: { title: { gapRight: 15, }, }`  | `number` |

### `axisX`
| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts data associated with the chart's abscissa | `axisX: { font: { ... }, ... }`  | `object` |

#### Accepted parameters

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

    * #### `gapTop`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts gap from above | `axisX: { title: { gapTop: 15, }, }`  | `number` |

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
    | Cap format ("square" or "circle" (default "circle")) | `cap: { format: "square", }`  | `string` |

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
    | Receives data related to window padding | `blockInfo: { padding: { ... }, }`  | `object` |

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
| Accepts a data object belonging to the same theme. [More](https://github.com/Alexandr-web/aCharty#utils) | `theme: new Utils(0, "light")`  | `object` |

## Utils

The Utils class contains helper resources such as themes and various colors

### How to choose and apply a theme? [View all themes](https://github.com/Alexandr-web/aCharty/blob/master/.github/themes/readme.md)

```js
const utils = new Utils();

// Accepts index and theme
// The default index is 0 and the theme is dark
new ACharty({ theme: utils.getTheme(2, "light") }).init();
```

### How to apply any color? [View all colors](https://github.com/Alexandr-web/aCharty/blob/master/.github/colors/readme.md)

```js
const utils = new Utils();

// Accepts the name of the color and its transparency (default 1)
new ACharty({ background: utils.getColor("jet", 0.6) }).init();
```
