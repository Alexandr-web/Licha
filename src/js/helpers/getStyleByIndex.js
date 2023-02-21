export default (idx, styles = []) => {
  if (!styles.length) {
    return "";
  }
  
  if (idx > styles.length - 1) {
    return styles[0];
  }

  return styles[idx] || "";
};