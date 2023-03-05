<div align="center">
  <h1>
    <b>aCharty</b>
  </h1>
  <p>
    aCharty is a JavaScript project that will help you build a line chart
  </p>
</div>
<div>
  <nav>
    <ul style="display: flex; align-items: center; justify-content: center; list-style-type: none; gap: 15px">
      <li>
        <a href="">Usage</a>
      </li>
      <li>
        <a href="">Params</a>
      </li>
      <li>
        <a href="">Utils</a>
      </li>
    </ul>
  </nav>
</div>

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

<div>
  <nav>
    <ul style="display: flex; align-items: center; justify-content: center; list-style-type: none; flex-wrap: wrap; gap: 15px">
      <li>
        <a href="">selectorCanvas</a>
      </li>
      <li>
        <a href="">background</a>
      </li>
      <li>
        <a href="">padding</a>
      </li>
      <li>
        <a href="">type</a>
      </li>
      <li>
        <a href="">title</a>
      </li>
      <li>
        <a href="">axisY</a>
      </li>
      <li>
        <a href="">axisX</a>
      </li>
    </ul>
  </nav>
</div>

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