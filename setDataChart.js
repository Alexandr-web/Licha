const btns = document.querySelectorAll(".btn[data-btn]");

let count = 0;

btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const data = btn.dataset.btn;
    const keysDataChart = Object.keys(myChart.data);
    const lenDataChart = keysDataChart.length;
    const nameLastGroup = keysDataChart[lenDataChart - 1];

    switch (data) {
      case "add":
        count++;

        myChart.data[nameLastGroup + count] = {
          line: {
            color: "#9457EB",
          },
          data: [
            { name: "Понедельник", value: Math.round(Math.random() * 20), },
            { name: "Вторник", value: Math.round(Math.random() * 20), },
            { name: "Среда", value: Math.round(Math.random() * 20), },
            { name: "Четверг", value: Math.round(Math.random() * 20), },
            { name: "Пятница", value: Math.round(Math.random() * 20), },
            { name: "Суббота", value: Math.round(Math.random() * 20), },
            { name: "Воскресенье", value: Math.round(Math.random() * 20), },
          ]
        };
        break;
      case "remove":
        myChart.data = keysDataChart
          .filter((_, index) => index !== lenDataChart - 1)
          .reduce((acc, key) => {
            acc[key] = myChart.data[key];

            return acc;
          }, {});
        break;
    }

    myChart.update();
  });
});