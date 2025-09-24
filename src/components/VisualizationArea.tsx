// src/components/VisualizationArea.tsx

import { useRef, useEffect } from 'react';
import type { QuantumConcept } from '../types/index.ts';
import { vizController2D } from '../visualizations/visualizer2D.ts';
import { vizController3D } from '../visualizations/visualizer3D.ts';
import { staticVisualizer } from '../visualizations/staticVisualizer.ts';
import '../styles/visualization.css';

interface Props {
  concept: QuantumConcept | null;
}

const VisualizationArea = ({ concept }: Props) => {
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const container3DRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const staticContentRef = useRef<HTMLDivElement>(null); // Ref for the new static view

  // Initialize all controllers once on mount
  useEffect(() => {
    if (canvas2DRef.current && container3DRef.current && overlayRef.current && staticContentRef.current) {
      vizController2D.init(canvas2DRef.current);
      vizController3D.init(container3DRef.current, overlayRef.current);
      staticVisualizer.init(staticContentRef.current);
    }
    const handleResize = () => {
      vizController2D.resize();
      vizController3D.resize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      vizController3D.cleanup();
    };
  }, []);


  useEffect(() => {
    if (!concept) {
      staticVisualizer.clear();
      return;
    };

    if (concept.vizType === 'static') {
      // Step 1: Display the new HTML content
      concept.animation(staticVisualizer);
      
      setTimeout(() => {
        if (window.renderMathInElement) {

          window.renderMathInElement(document.body, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
            ],
            throwOnError: false,
          });
        }
      }, 0); 

    } else if (concept.vizType === '3d') {
      setTimeout(() => {
        vizController3D.resize();
        concept.animation(vizController3D);
      }, 0);
    } else { // '2d'
      setTimeout(() => {
        vizController2D.resize();
        vizController2D.reset();
        concept.animation(vizController2D);
      }, 0);
    }
  }, [concept]);

  return (
    <div id="viz-container" className="flex-1 flex items-center justify-center p-8 relative bg-gray-900">
      
      {/* Static Content View (only visible if vizType is 'static') */}
      <div
        ref={staticContentRef}
        className={`w-full h-full text-gray-300 ${concept?.vizType === 'static' ? 'block' : 'hidden'}`}
      ></div>

      {/* 2D Canvas View (only visible if vizType is '2d') */}
      <canvas
        ref={canvas2DRef}
        className={`rounded-lg ${concept?.vizType === '2d' ? 'block' : 'hidden'}`}
      />

      {/* 3D Canvas View (only visible if vizType is '3d') */}
      <div
        ref={container3DRef}
        id="visualizer-3d-container"
        className={`${concept?.vizType === '3d' ? 'block' : 'hidden'}`}
        style={{ width: '100%', height: '100%' }}
      >
        <div ref={overlayRef} id="viz-overlay" />
      </div>

      {/* Placeholder when no concept is selected */}
      {!concept && (
        <div className="text-center text-gray-500">
          <h3 className="text-xl font-semibold">Welcome to the Quantum Library</h3>
          <p>Select a concept from the left panel to begin.</p>
        </div>
      )}
    </div>
  );
};

export default VisualizationArea;