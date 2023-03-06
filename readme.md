<div align="center">
  <h1>
    <b>aCharty</b>
  </h1>
  <p>
    aCharty is a JavaScript project that will help you build a line chart
  </p>
</div>

[Usage](https://github.com/Alexandr-web/aCharty/tree/documentation#usage)
[Params](https://github.com/Alexandr-web/aCharty/tree/documentation#params)
[Utils](https://github.com/Alexandr-web/aCharty/tree/documentation#utils)

<h2>Usage</h2>

How to use this tool?

```js
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

<h3>Result<h3>

<img src="./.github/e1.PNG" />

<h2>Params</h2>

Parameters passed to the ACharty class constructor

* [selectorCanvas](https://github.com/Alexandr-web/aCharty/tree/documentation#selectorcanvas)
* [background](https://github.com/Alexandr-web/aCharty/tree/documentation#background)
* [padding](https://github.com/Alexandr-web/aCharty/tree/documentation#padding)
* [type](https://github.com/Alexandr-web/aCharty/tree/documentation#type)
* [title](https://github.com/Alexandr-web/aCharty/tree/documentation#title)
* [axisY](https://github.com/Alexandr-web/aCharty/tree/documentation#axisy)
* [axisX](https://github.com/Alexandr-web/aCharty/tree/documentation#axisx)
* [line](https://github.com/Alexandr-web/aCharty/tree/documentation#line)
* [line](https://github.com/Alexandr-web/aCharty/tree/documentation#line)
* [cap](https://github.com/Alexandr-web/aCharty/tree/documentation#cap)
* [grid](https://github.com/Alexandr-web/aCharty/tree/documentation#grid)
* [legend](https://github.com/Alexandr-web/aCharty/tree/documentation#legend)
* [blockInfo](https://github.com/Alexandr-web/aCharty/tree/documentation#blockinfo)

### `selectorCanvas`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts a canvas element selector  | `selectorCanvas: ".my-chart"`  | `string` |

### `background`

| Description  | Example | Type |
| ------------- | ------------- | ------------- |
| Accepts the chart background | `background: "#ffffff"`  | `string` |

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

    * ##### `text`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts title text | `axisY: { font: { text: "Title Y", } }`  | `string` |

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
  
  * #### `step`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Step with which values will be drawn on the y-axis | `axisY: { step: 3, }`  | `number` |

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

    * #### `font`

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

    * ##### `text`

      | Description  | Example | Type |
      | ------------- | ------------- | ------------- |
      | Accepts title text | `axisX: { font: { text: "Title X", } }`  | `string` |

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

  * #### `editNames`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | A method that allows you to change the appearance of a value along the x-axis | `axisX: { editNames: (name) => new Date(name).toLocaleString(), }`  | `function: string` |

  * #### `sort`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Takes a value that is related to how the points will be displayed on the x-axis | `axisX: { sort: "less-more" }` or `axisX: { sort: "more-less" }` | `string` |

  * #### `title`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Receives data related to the title | `axisX: { title: { font: { ... }, ... } }`  | `object` |

    * #### `font`

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
  
  * #### `stepped`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Rule that will draw the line step by step (default false) | `line: { stepped: true, }`  | `boolean` |

  * #### `color`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Line color | `line: { color: "red", }`  | `string` |
  
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
    | Line cap | `cap: { color: "red", }`  | `string` |
  
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
  
  * #### `format`

    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Grid format ("horizontal" or "vertical" (default "default")) | `grid: { format: "vertical", }`  | `string` |

  * #### `line`
  
    | Description  | Example | Type |
    | ------------- | ------------- | ------------- |
    | Grid line data | `grid: { line: { ... }, }`  | `object` |

    ##### Accepted parameters

      * ##### `width`

        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Gird line width | `grid: { line: { width: 2, }, }`  | `number` |

      * ##### `color`
    
        | Description  | Example | Type |
        | ------------- | ------------- | ------------- |
        | Gird line color | `grid: { line: { color: "grey", } }`  | `string` |

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
    | Window background | `blockInfo: { background: "black", }`  | `string` |

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