function quickSort(arr, key) {
  if (arr.length <= 1) {
    return arr;
  }

  const lastValue = arr[arr.length - 1];
  const leftSide = [];
  const rightSide = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (key ? arr[i][key] < lastValue[key] : arr[i] < lastValue) {
      leftSide.push(arr[i]);
    } else {
      rightSide.push(arr[i]);
    }
  }

  return [...quickSort(leftSide, key), lastValue, ...quickSort(rightSide, key)];
}

export default quickSort;