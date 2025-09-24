// src/types/index.ts

// Forward declaration for controllers to avoid circular dependencies
export interface VizController2D {
  [key: string]: (...args: any[]) => void;
}

export interface VizController3D {
  [key: string]: (...args: any[]) => void;
}

export interface StaticVisualizer {
  init(containerElement: HTMLDivElement): void;
  displayHTML(htmlContent: string): void;
  clear(): void;
}

export type QuantumConcept = {
  id: string;
  title: string;
  group: string;
  vizType: '2d' | '3d' | 'static';
  description: string;
  matrixLatex: string;
  mathExplanation: string;
  // The animation function takes a controller of the correct type
  animation: (controller: VizController2D | VizController3D | StaticVisualizer) => void;
};