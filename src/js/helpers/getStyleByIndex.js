export default (idx, styles = []) => {
  if (!styles.length) {
    return "";
  }
  
  if (idx > styles.length - 1) {
    return styles[(idx - 1) - (styles.length - 1)];
  }

  return styles[idx] || "";
};