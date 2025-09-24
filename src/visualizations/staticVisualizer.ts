// src/visualizations/staticVisualizer.ts

let staticContainer: HTMLDivElement | null = null;

export const staticVisualizer = {
  init: (containerElement: HTMLDivElement) => {
    staticContainer = containerElement;
  },


  displayHTML: (htmlContent: string) => {
    if (staticContainer) {
      staticContainer.innerHTML = htmlContent;
    }
  },

  clear: () => {
    if (staticContainer) {
      staticContainer.innerHTML = '';
    }
  },
};