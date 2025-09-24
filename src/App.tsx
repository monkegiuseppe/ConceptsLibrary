// src/App.tsx

import { useState, useMemo } from 'react'; // <-- No longer need useEffect here
import NavigationPanel from './components/NavigationPanel.tsx';
import VisualizationArea from './components/VisualizationArea.tsx';
import ExplanationPanel from './components/ExplanationPanel.tsx';
import { library } from './data/quantumConcepts.ts';
import type { QuantumConcept } from './types/index.ts';

function App() {
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);


  const activeConcept = useMemo((): QuantumConcept | null => {
    if (!activeConceptId) return null;
    return library.find((c: QuantumConcept) => c.id === activeConceptId) || null;
  }, [activeConceptId]);

  return (
    <div className="bg-gray-900 text-gray-200 flex h-screen antialiased font-sans">
      <NavigationPanel
        concepts={library}
        activeConceptId={activeConceptId}
        onSelectConcept={setActiveConceptId}
      />
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <VisualizationArea concept={activeConcept} />
        <ExplanationPanel concept={activeConcept} />
      </main>
    </div>
  );
}

export default App;