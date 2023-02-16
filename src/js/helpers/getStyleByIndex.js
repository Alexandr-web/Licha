export default (idx, len, styles = []) => {
  if (!styles.length) {
    return "";
  }

  if (idx > styles.length - 1) {
    return styles[idx - (len - 1)];
  }

  return styles[idx] || "";
};