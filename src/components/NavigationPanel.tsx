// src/components/NavigationPanel.tsx

import type { QuantumConcept } from '../types';

interface Props {
  concepts: QuantumConcept[];
  activeConceptId: string | null;
  onSelectConcept: (id: string) => void;
}

const NavigationPanel = ({ concepts, activeConceptId, onSelectConcept }: Props) => {
  // Group concepts by their 'group' property
  const groupedConcepts = concepts.reduce((acc, concept) => {
    (acc[concept.group] = acc[concept.group] || []).push(concept);
    return acc;
  }, {} as Record<string, QuantumConcept[]>);

  const groupOrder = ['Core Concepts', 'Core Operator Concepts', 'Two--Qubit Gates', 'Math Operations'];

  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col shadow-lg">
      <h1 className="text-xl font-bold text-white mb-4">Concept Library</h1>
      <div id="nav-library" className="overflow-y-auto">
        {groupOrder.map(groupName => (
          <div key={groupName}>
            <div className="nav-group-title">{groupName}</div>
            {groupedConcepts[groupName]?.map(concept => (
              <div
                key={concept.id}
                className={`nav-item text-white font-medium p-2 rounded-lg cursor-pointer ml-2 ${
                  activeConceptId === concept.id ? 'active' : ''
                }`}
                onClick={() => onSelectConcept(concept.id)}
              >
                {concept.title}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationPanel;