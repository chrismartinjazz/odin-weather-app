export function setColors(tempInF) {
  let newColors;

  if (tempInF <= 50) {
    newColors = colors.cool;
  } else if (tempInF <= 68) {
    newColors = colors.mid;
  } else {
    newColors = colors.hot;
  }

  const root = document.querySelector(":root");
  for (const [key, value] of Object.entries(newColors)) {
    root.style.setProperty(key, value);
  }

  root.style.setProperty("--blue", "lightblue");
}

const colors = {
  hot: {
    "--color-bg1": "#FD7F20",
    "--color-bg2": "#FDB750",
    "--color-highlight": "#FC2E20",
    "--color-action": "#010100",
    "--color-text1": "#010100",
    "--color-text2": "white",
  },
  mid: {
    "--color-bg1": "#ADB3BC",
    "--color-bg2": "#E4E3DF",
    "--color-highlight": "#FC2E20",
    "--color-action": "#875F59",
    "--color-text1": "#010100",
    "--color-text2": "white",
  },
  cool: {
    "--color-bg1": "#82A4E3",
    "--color-bg2": "#A2C4E0",
    "--color-highlight": "#FC2E20",
    "--color-action": "#F7CB2D",
    "--color-text1": "#010100",
    "--color-text2": "white",
  },
};
