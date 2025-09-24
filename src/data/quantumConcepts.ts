// src/data/quantumConcepts.ts

import type { QuantumConcept, VizController2D, VizController3D, StaticVisualizer } from '../types';

export const library: QuantumConcept[] = [
    {
        id: 'bloch-sphere',
        title: "Bloch Sphere",
        group: 'Core Concepts',
        vizType: '3d',
        description: "A 3D representation of a single qubit's state space. Pure states are points on the surface of the sphere.",
        matrixLatex: "",
        mathExplanation: "<p>A qubit state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ can be written in terms of two angles, $\\theta$ and $\\phi$:</p>$$ |\\psi\\rangle = \\cos(\\frac{\\theta}{2})|0\\rangle + e^{i\\phi}\\sin(\\frac{\\theta}{2})|1\\rangle $$<p>Here, $\\theta$ is the polar angle from the Z-axis ($|0\\rangle$) and $\\phi$ is the azimuthal angle from the X-axis.</p><p>For example, $|+\\rangle$ has $\\theta=\\pi/2, \\phi=0$.</p>",
        animation: (controller) => (controller as VizController3D).animateBlochSphere()
    },
    {
        id: 'measurement',
        title: "Measurement",
        group: 'Core Concepts',
        vizType: '3d',
        description: "Observing a qubit in superposition collapses its state to a basis state.",
        matrixLatex: "",
        mathExplanation: "<p>For a state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$, measurement collapses it:</p><p>Result $|0\\rangle$ with probability $|\\alpha|^2$.</p><p>Result $|1\\rangle$ with probability $|\\beta|^2$.</p><p>This is represented by projection operators $P_0 = |0\\rangle\\langle0|$ and $P_1 = |1\\rangle\\langle1|$.</p>",
        animation: (controller) => (controller as VizController3D).animateMeasurement()
    },
    {
        id: 'unitary-evolution',
        title: "Unitary Evolution",
        group: 'Core Concepts',
        vizType: '3d',
        description: "The evolution of a closed quantum system over time, described by a unitary operator. This is governed by the Schrödinger equation.",
        matrixLatex: "$$ |\\psi(t)\\rangle = U(t)|\\psi(0)\\rangle = e^{-iHt}|\\psi(0)\\rangle $$",
        mathExplanation: "<p>The state of a quantum system evolves according to the Schrödinger equation, where H is the Hamiltonian operator (representing the system's total energy).</p><p>For a simple Hamiltonian like $H = \\sigma_z$, the state vector will precess (rotate) around the Z-axis of the Bloch sphere at a constant frequency.</p>",
        animation: (controller) => (controller as VizController3D).animateUnitaryEvolution()
    },
    {
        id: 'bell-state-circuit',
        title: "Bell State (Creation Circuit)",
        group: 'Core Concepts',
        vizType: '3d',
        description: "How the simplest entangled state is created from two unentangled qubits using a Hadamard and a CNOT gate.",
        matrixLatex: "$$ |00\\rangle \\xrightarrow{H \\otimes I} \\frac{1}{\\sqrt{2}}(|00\\rangle + |10\\rangle) \\xrightarrow{CNOT} \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle) $$",
        mathExplanation: "<p>Entanglement is created by a sequence of operations:</p><ol class='list-decimal list-inside space-y-2'><li>A Hadamard gate is applied to the first qubit, putting it into an equal superposition of |0⟩ and |1⟩.</li><li>A CNOT gate is applied, with the first qubit as the control and the second as the target. This correlates the two qubits.</li></ol><p>After these operations, the qubits' individual states are undefined, but their measurement outcomes will always be the same.</p>",
        animation: (controller) => (controller as VizController3D).animateBellStateCreation()
    },
    {
        id: 'eigen-values',
        title: "Eigenvalues & Eigenvectors",
        group: 'Math Operations',
        vizType: '2d',
        description: "For an operator A, an eigenvector is a special vector that is only scaled by a number (the eigenvalue) when A is applied.",
        matrixLatex: "$$ A|\\psi\\rangle = \\lambda|\\psi\\rangle $$",
        mathExplanation: "<p>Eigenvectors represent the 'axes' of a transformation. For a Hermitian operator, eigenvalues are real and represent possible measurement outcomes.</p><p>The animation shows the operator $A = \\sigma_x$. Its eigenvectors are $|+\\rangle$ and $|-\\rangle$ with eigenvalues $+1$ and $-1$. Notice how these vectors only scale (or flip), while all other vectors rotate.</p>",
        animation: (controller) => (controller as VizController2D).animateEigenvectors()
    },
     {
        id: 'projection',
        title: "Projection Operator",
        group: 'Math Operations',
        vizType: '2d',
        description: "An operator P that 'projects' a vector onto a subspace. Measurements are described by projection operators.",
        matrixLatex: "$$ P_0 = |0\\rangle\\langle0| = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} $$",
        mathExplanation: "<p>A projection operator is idempotent, meaning $P^2 = P$. When you apply it twice, you get the same result.</p><p>The probability of measuring a state $|\\psi\\rangle$ in the state $|\\phi\\rangle$ is given by $p = \\langle\\psi|P_\\phi|\\psi\\rangle$, where $P_\\phi = |\\phi\\rangle\\langle\\phi|$.</p>",
        animation: (controller) => (controller as VizController2D).animateProjection()
    },
    {
        id: 'inner-product',
        title: "Inner Product",
        group: 'Math Operations',
        vizType: '2d',
        description: "Calculates the projection of one state vector onto another. It's used to find probability amplitudes.",
        matrixLatex: "$$ \\langle\\phi|\\psi\\rangle $$",
        mathExplanation: "<p>The inner product (or bracket) of two vectors $|\\phi\\rangle = \\begin{pmatrix} a \\\\ b \\end{pmatrix}$ and $|\\psi\\rangle = \\begin{pmatrix} c \\\\ d \\end{pmatrix}$ is:</p>$$ \\langle\\phi|\\psi\\rangle = \\begin{pmatrix} a^* & b^* \\end{pmatrix} \\begin{pmatrix} c \\\\ d \\end{pmatrix} = a^*c + b^*d $$<p>The squared magnitude, $|\\langle\\phi|\\psi\\rangle|^2$, gives the probability of measuring state $|\\psi\\rangle$ if the system is in state $|\\phi\\rangle$.</p>",
        animation: (controller) => (controller as VizController2D).animateInnerProduct()
    },
    {
        id: 'outer-product',
        title: "Outer Product (Operator)",
        group: 'Math Operations',
        vizType: '2d',
        description: "Creates a transformation operator from two vectors. The animation shows how this new operator transforms the basis vectors |0⟩ and |1⟩.",
        matrixLatex: "$$ A = |\\psi\\rangle\\langle\\phi| $$",
        mathExplanation: "<p>An outer product creates a matrix (an operator). This operator's behavior is defined by the two vectors used to create it.</p><p>When applied to a basis state like |0⟩, it first calculates the inner product ⟨φ|0⟩ (a number), then creates a new vector by scaling |ψ⟩ by that amount. The final result is: A|0⟩ = ⟨φ|0⟩|ψ⟩.</p>",
        animation: (controller) => (controller as VizController2D).animateOuterProduct()
    },
    {
        id: 'tensor-product',
        title: "Tensor Product (⊗)",
        group: 'Math Operations',
        vizType: 'static', // CHANGED
        description: "Combines vector spaces of individual systems into a larger space for the composite system.",
        matrixLatex: "$$ |\\psi\\rangle \\otimes |\\phi\\rangle $$",
        mathExplanation: "<p>This operation is used to describe the state of a composite quantum system, like two qubits.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 1: Distribute the First Element</h3>
              <p class="text-sm mb-4">Take the top element of the first vector and multiply it by the entire second vector.</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ \\begin{pmatrix} \\bf{a} \\\\ b \\end{pmatrix} \\otimes \\begin{pmatrix} c \\\\ d \\end{pmatrix} = \\begin{pmatrix} a \\begin{pmatrix} c \\\\ d \\end{pmatrix} \\\\ ... \\end{pmatrix} = \\begin{pmatrix} ac \\\\ ad \\\\ ... \\end{pmatrix} $$</span>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 2: Distribute the Second Element</h3>
              <p class="text-sm mb-4">Take the bottom element of the first vector and multiply it by the entire second vector.</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ \\begin{pmatrix} a \\\\ \\bf{b} \\end{pmatrix} \\otimes \\begin{pmatrix} c \\\\ d \\end{pmatrix} = \\begin{pmatrix} ... \\\\ b \\begin{pmatrix} c \\\\ d \\end{pmatrix} \\end{pmatrix} = \\begin{pmatrix} ... \\\\ bc \\\\ bd \\end{pmatrix} $$</span>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 3: Combine to Form Final Vector</h3>
              <p class="text-sm mb-4">Stack the results from the previous steps to form the final, higher-dimensional vector.</p>
               <span class="text-2xl">$$ \\begin{pmatrix} a \\\\ b \\end{pmatrix} \\otimes \\begin{pmatrix} c \\\\ d \\end{pmatrix} = \\begin{pmatrix} ac \\\\ ad \\\\ bc \\\\ bd \\end{pmatrix} $$</span>
            </div>
          </div>
        `)
    },
    {
        id: 'hermitian-conjugate',
        title: "Hermitian Conjugate (†)",
        group: 'Math Operations',
        vizType: 'static', // CHANGED
        description: "The conjugate transpose of an operator. For a matrix, you swap rows and columns and take the complex conjugate of each element.",
        matrixLatex: "$$ A^\\dagger = (A^T)^* $$",
        mathExplanation: "<p>An operator A is Hermitian (an observable) if $A = A^\\dagger$. It is Unitary (a valid gate) if $A^\\dagger A = I$.</p><p>For bra-ket notation: $(|\\psi\\rangle\\langle\\phi|)^\\dagger = |\\phi\\rangle\\langle\\psi|$.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 1: Transpose the Matrix (A<sup>T</sup>)</h3>
              <p class="text-sm mb-4">Swap the elements across the main diagonal. The element at (row, col) moves to (col, row).</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ A = \\begin{pmatrix} a & b+ic \\\\ d-ie & f \\end{pmatrix} $$</span>
                <span class="text-3xl text-gray-500">→</span>
                <span class="text-2xl">$$ A^T = \\begin{pmatrix} a & d-ie \\\\ b+ic & f \\end{pmatrix} $$</span>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 2: Take the Complex Conjugate ((A<sup>T</sup>)*)</h3>
              <p class="text-sm mb-4">For every element in the transposed matrix, flip the sign of the imaginary part (the part with 'i').</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ A^T = \\begin{pmatrix} a & d-ie \\\\ b+ic & f \\end{pmatrix} $$</span>
                <span class="text-3xl text-gray-500">→</span>
                <span class="text-2xl">$$ A^\\dagger = \\begin{pmatrix} a & d+ie \\\\ b-ic & f \\end{pmatrix} $$</span>
              </div>
            </div>
          </div>
        `)
    },
    {
        id: 'trace',
        title: "Trace (Tr)",
        group: 'Math Operations',
        vizType: 'static', // CHANGED
        description: "The sum of the diagonal elements of a square matrix. It is independent of the basis.",
        matrixLatex: "$$ \\text{Tr}(A) = \\sum_i A_{ii} $$",
        mathExplanation: "<p>The trace has a cyclic property: $\\text{Tr}(ABC) = \\text{Tr}(BCA) = \\text{Tr}(CAB)$.</p><p>The partial trace is used to find the state of a subsystem from a composite entangled state.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Operation: Sum the Diagonal Elements</h3>
              <p class="text-sm mb-4">Identify the elements on the main diagonal (from top-left to bottom-right) and add them together.</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ A = \\begin{pmatrix} \\bf{a} & b \\\\ c & \\bf{d} \\end{pmatrix} $$</span>
                <span class="text-3xl text-gray-500">→</span>
                <span class="text-2xl">$$ \\text{Tr}(A) = a + d $$</span>
              </div>
            </div>
             <div>
              <h3 class="text-lg font-semibold text-white mb-2">Example with a 3x3 Matrix</h3>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ B = \\begin{pmatrix} \\bf{1} & 2 & 3 \\\\ 4 & \\bf{5} & 6 \\\\ 7 & 8 & \\bf{9} \\end{pmatrix} $$</span>
                <span class="text-3xl text-gray-500">→</span>
                <span class="text-2xl">$$ \\text{Tr}(B) = 1 + 5 + 9 = 15 $$</span>
              </div>
            </div>
          </div>
        `)
    },
    {
        id: 'commutator',
        title: "Commutator [A,B]",
        group: 'Math Operations',
        vizType: 'static', // CHANGED
        description: "Measures how much two operators fail to commute. If [A,B] = 0, they can be measured simultaneously.",
        matrixLatex: "$$ [A,B] = AB - BA $$",
        mathExplanation: "<p>The commutator is fundamental to the uncertainty principle. For position (x) and momentum (p), the commutator is $[x, p] = i\\hbar$. Since this is not zero, you cannot simultaneously know the exact position and momentum of a particle.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Example: Pauli Matrices [σ<sub>x</sub>, σ<sub>y</sub>]</h3>
              <p class="text-sm mb-4">We calculate AB and BA separately, then subtract the results.</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ \\sigma_x = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} $$</span>
                <span class="text-2xl">$$ \\sigma_y = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix} $$</span>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 1: Calculate AB (σ<sub>x</sub>σ<sub>y</sub>)</h3>
               <span class="text-2xl">$$ \\sigma_x\\sigma_y = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix} = \\begin{pmatrix} i & 0 \\\\ 0 & -i \\end{pmatrix} $$</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 2: Calculate BA (σ<sub>y</sub>σ<sub>x</sub>)</h3>
               <span class="text-2xl">$$ \\sigma_y\\sigma_x = \\begin{pmatrix} 0 & -i \\\\ i & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} -i & 0 \\\\ 0 & i \\end{pmatrix} $$</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 3: Subtract BA from AB</h3>
               <span class="text-2xl">$$ [\\sigma_x, \\sigma_y] = \\begin{pmatrix} i & 0 \\\\ 0 & -i \\end{pmatrix} - \\begin{pmatrix} -i & 0 \\\\ 0 & i \\end{pmatrix} = \\begin{pmatrix} 2i & 0 \\\\ 0 & -2i \\end{pmatrix} = 2i\\sigma_z $$</span>
            </div>
          </div>
        `)
    },
    {
        id: 'partial-trace',
        title: "Partial Trace (Tr_B)",
        group: 'Math Operations',
        vizType: 'static', // CHANGED
        description: "Finds the state of a subsystem from a composite system's state by 'tracing out' the other subsystem.",
        matrixLatex: "$$ \\rho_A = \\text{Tr}_B(\\rho_{AB}) $$",
        mathExplanation: "<p>This is crucial for understanding entanglement. If you have an entangled state of two qubits (A and B), the partial trace gives you the state of just qubit A, which will appear as a mixed state.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 1: Decompose the Density Matrix</h3>
              <p class="text-sm mb-4">View the 4x4 density matrix of the combined system (AB) as a 2x2 matrix of smaller 2x2 blocks.</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ \\rho_{AB} = \\begin{pmatrix} A & B \\\\ C & D \\end{pmatrix} = \\left(\\begin{array}{cc|cc} a & b & c & d \\\\ e & f & g & h \\\\ \\hline i & j & k & l \\\\ m & n & o & p \\end{array}\\right) $$</span>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step 2: Sum the Diagonal Blocks</h3>
              <p class="text-sm mb-4">To get the reduced density matrix for subsystem A (ρ<sub>A</sub>), simply add the 2x2 blocks that lie on the main diagonal of the block matrix.</p>
              <div class="flex items-center justify-center space-x-4">
                <span class="text-2xl">$$ \\rho_A = A + D = \\begin{pmatrix} a & b \\\\ e & f \\end{pmatrix} + \\begin{pmatrix} k & l \\\\ o & p \\end{pmatrix} = \\begin{pmatrix} a+k & b+l \\\\ e+o & f+p \\end{pmatrix} $$</span>
              </div>
            </div>
          </div>
        `)
    },
        {
        id: 'mixed-states',
        title: "Mixed States & Density Matrix",
        group: 'Core Operator Concepts',
        vizType: '3d',
        description: "A way to describe quantum systems that are in a statistical ensemble of pure states, or are entangled with an environment.",
        matrixLatex: "$$ \\rho = \\sum_i p_i |\\psi_i\\rangle\\langle\\psi_i| $$",
        mathExplanation: "<p>A pure state is a vector on the surface of the Bloch Sphere (purity Tr(ρ²)=1). A mixed state is a point inside the sphere (purity Tr(ρ²)<1).</p><p>The maximally mixed state, $\\rho = \\frac{1}{2}I$, is at the very center of the sphere and represents a state of complete ignorance, like the result of a fair coin flip.</p>",
        animation: (controller) => (controller as VizController3D).animateMixedState()
    },
    {
        id: 'operator-hierarchy',
        title: "Operator Hierarchy",
        group: 'Core Operator Concepts',
        vizType: 'static',
        description: "Operators in quantum mechanics form a nested hierarchy based on their properties. This structure determines their physical meaning.",
        matrixLatex: "",
        mathExplanation: "<p>This hierarchy is key: Projectors are a special case of Hermitian operators, which are in turn a special case of Normal operators. Unitary operators are also Normal.</p><p>Only Normal operators can be diagonalized, which is why this property is so important.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-4 p-4 border border-gray-700 rounded-lg">
            <h3 class="text-lg font-bold text-white text-center">Normal Operators: [A, A<sup>†</sup>] = 0</h3>
            <p class="text-sm text-center text-gray-400">The most general class of operators that can be diagonalized.</p>
            <div class="flex space-x-4">
              <div class="flex-1 space-y-4 p-4 border border-gray-600 rounded-lg">
                <h4 class="text-md font-semibold text-white text-center">Hermitian: A = A<sup>†</sup></h4>
                <p class="text-sm text-center text-gray-400">Represents physical observables. Has real eigenvalues.</p>
                 <div class="space-y-4 p-4 border border-gray-500 rounded-lg">
                    <h5 class="text-sm font-semibold text-white text-center">Projector: P = P<sup>†</sup>, P² = P</h5>
                    <p class="text-xs text-center text-gray-400">Represents measurement outcomes. Has eigenvalues 0 or 1.</p>
                 </div>
              </div>
              <div class="flex-1 space-y-4 p-4 border border-gray-600 rounded-lg">
                <h4 class="text-md font-semibold text-white text-center">Unitary: U<sup>†</sup>U = I</h4>
                <p class="text-sm text-center text-gray-400">Represents valid, reversible time evolution. Eigenvalues have magnitude 1.</p>
              </div>
            </div>
          </div>
        `)
    },
    {
        id: 'spectral-decomposition',
        title: "Spectral Decomposition",
        group: 'Core Operator Concepts',
        vizType: 'static',
        description: "Expressing a normal operator in terms of its eigenvalues and its corresponding projectors (its 'spectrum').",
        matrixLatex: "$$ A = \\sum_{i} \\lambda_i P_i = \\sum_{i} \\lambda_i |\\psi_i\\rangle\\langle\\psi_i| $$",
        mathExplanation: "<p>This theorem is fundamental because it guarantees that observables (Hermitian operators) can be fully described by a set of real outcomes (eigenvalues λᵢ) and the states (eigenvectors |ψᵢ⟩) you'd find the system in after measuring that outcome.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-8">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Decomposing the Pauli-Z Matrix</h3>
              <p class="text-sm mb-4">The Z operator has eigenvalues λ₁=+1, λ₂=-1 and corresponding projectors P₀ and P₁.</p>
              <span class="text-2xl">$$ Z = (\\bf{+1}) \\cdot P_0 + (\\bf{-1}) \\cdot P_1 $$</span>
              <span class="text-2xl">$$ Z = (\\bf{+1}) \\cdot |0\\rangle\\langle0| + (\\bf{-1}) \\cdot |1\\rangle\\langle1| $$</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Step-by-step Construction from Projectors</h3>
               <span class="text-2xl">$$ Z = (+1)\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} + (-1)\\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix} $$</span>
            </div>
          </div>
        `)
    },
    {
        id: 'function-of-operator',
        title: "Function of an Operator",
        group: 'Core Operator Concepts',
        vizType: 'static',
        description: "Applying a function to an operator by applying it to its eigenvalues in the spectral decomposition.",
        matrixLatex: "$$ f(A) = f\\left(\\sum_i \\lambda_i P_i\\right) = \\sum_i f(\\lambda_i) P_i $$",
        mathExplanation: "<p>This is extremely powerful. It allows us to define complex functions like e<sup>A</sup> or √A in a simple and intuitive way. It's the mathematical foundation for describing time evolution, U(t) = e<sup>-iHt</sup>.</p>",
        animation: (controller) => (controller as StaticVisualizer).displayHTML(`
          <div class="space-y-8">
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Example: Calculating e<sup>iθZ</sup></h3>
              <p class="text-sm mb-4">We start with the spectral decomposition of Z and apply the function f(λ) = e<sup>iθλ</sup> to its eigenvalues (+1 and -1).</p>
              <span class="text-2xl">$$ e^{i\\theta Z} = e^{i\\theta (\\bf{+1})} P_0 + e^{i\\theta (\\bf{-1})} P_1 $$</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white mb-2">Substituting the Projector Matrices</h3>
               <span class="text-2xl">$$ = e^{i\\theta} \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} + e^{-i\\theta} \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} e^{i\\theta} & 0 \\\\ 0 & e^{-i\\theta} \\end{pmatrix} $$</span>
               <p class="mt-4">This is the matrix for a rotation around the Z-axis by an angle of 2θ.</p>
            </div>
          </div>
        `)
    },
    {
        id: 'local-operator',
        title: "Applying a Local Operator",
        group: 'Two-Qubit Gates',
        vizType: '2d',
        description: "Applying a gate to a single qubit in a multi-qubit system. This is achieved via the tensor product with the Identity operator.",
        matrixLatex: "$$ H \\otimes I $$",
        mathExplanation: "<p>To apply an operator G to the first qubit and an operator H to the second, the combined operator is G ⊗ H.</p><p>If we want to do nothing to the second qubit, we use the Identity operator, I. The animation shows the Hadamard gate (H) being applied to the first qubit while the second remains unchanged (I).</p>",
        animation: (controller) => (controller as VizController2D).animateLocalOperator()
    },
];