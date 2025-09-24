    // src/components/ExplanationPanel.tsx

    import { useEffect, useRef } from 'react';
    import type { QuantumConcept } from '../types/index.ts';


    declare global {
      interface Window {
        renderMathInElement?: (element: HTMLElement, options: object) => void;
      }
    }

    interface Props {
      concept: QuantumConcept | null;
    }

    const ExplanationPanel = ({ concept }: Props) => {
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {

        if (concept && containerRef.current && typeof window.renderMathInElement === 'function') {
          try {
            // Now it's safe to call the function.
            window.renderMathInElement(containerRef.current, {
              delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$', right: '$', display: false },
              ],
              throwOnError: false, // Prevents a single bad formula from crashing the app
            });
          } catch (error) {
            console.error("KaTeX rendering failed:", error);
          }
        }
      }, [concept]); // The dependency array ensures this code re-runs on concept change.

      return (
        <div ref={containerRef} className="w-full md:w-[450px] bg-gray-800/50 p-6 flex flex-col">
          {concept ? (
            <>
              <div className="space-y-2 mb-4">
                <h2 id="concept-title" className="text-2xl font-bold text-white">
                  {concept.title}
                </h2>
                <p id="concept-description" className="text-sm text-gray-400">
                  {concept.description}
                </p>
              </div>
              {/* Using dangerouslySetInnerHTML to render the HTML from your data file */}
              <div id="matrix-display" className="mb-4" dangerouslySetInnerHTML={{ __html: concept.matrixLatex }} />
              <div className="flex-1 bg-gray-900 p-4 rounded-lg overflow-y-auto">
                <h3 className="text-md font-semibold mb-3 text-white">Mathematical Operation</h3>
                <div id="math-explanation" className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: concept.mathExplanation }} />
              </div>
            </>
          ) : (
            // Fallback content for when no concept is selected
            <>
              <h2 className="text-2xl font-bold text-white">Select a concept</h2>
              <p className="text-sm text-gray-400">
                Choose an operator or concept from the library to see its mathematical definition and a visual animation.
              </p>
            </>
          )}
        </div>
      );
    };

    export default ExplanationPanel;