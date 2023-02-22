export default [
    {
        canvas: { background: "#FFFFFF", },
        title: { color: "#2E2F35", },
        legend: { color: "#484A53", },
        axis: { title: { color: "#2E2F35", }, point: { color: "#484A53", }, },
        grid: { color: "#EDEDEC", },
        line: {
          color: ["rgba(178,207,231,0.9)", "rgba(178,83,231,0.9)", "rgba(93,53,231,0.9)", "rgba(80,200,120,0.9)"],
          fill: [
            ["rgba(178,207,231,0.3)", "transparent"],
            ["rgba(178,83,231,0.3)", "transparent"],
            ["rgba(93,53,231,0.3)", "transparent"],
            ["rgba(80,200,120,0.3)", "transparent"]
          ],
        },
        cap: {
          color: ["#2A5DA1", "#B253E7", "#5D35E7", "#50C878"],
          strokeColor: ["rgba(178,207,231,0.9)", "rgba(178,83,231,0.9)", "rgba(93,53,231,0.9)", "rgba(80,200,120,0.9)"],
        },
        blockInfo: {
          window: { color: "#101728", },
          title: { color: "#C2C7D5", },
          group: { color: "#BBBFCD", },
        },
    },
    {
        canvas: { background: "#FFFFFF", },
        title: { color: "#2E2F35", },
        legend: { color: "#484A53", },
        axis: { title: { color: "#2E2F35", }, point: { color: "#484A53", }, },
        grid: { color: "#EAEAEA", },
        line: {
          color: ["#82C970", "#A5FF8E", "#00FF0C", "#00800C"],
          fill: [
            ["rgba(130,201,112,0.3)", "transparent"],
            ["rgba(165,255,142,0.3)", "transparent"],
            ["rgba(0,255,12,0.3)", "transparent"],
            ["rgba(0,128,12,0.3)", "transparent"]
          ],
        },
        cap: {
          color: ["#82C970", "#A5FF8E", "#00FF0C", "#00800C"],
          strokeColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
        },
        blockInfo: {
          window: { color: "#000000", },
          title: { color: "#FDFDFD", },
          group: { color: "#D3D3D3", },
        },
    }
];