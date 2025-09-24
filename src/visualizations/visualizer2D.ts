// src/visualizations/visualizer2D.ts

// --- Module-level state ---
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let size: number, scale: number, originX: number, originY: number;
let animationFrameId2D: number | null = null;

interface Vector {
    angle: number;
    length: number;
    color: string;
    label: string;
}

const basisVectors = {
    ket0: { angle: 0, label: '|0⟩', color: '#60a5fa' },
    ket1: { angle: 90, label: '|1⟩', color: '#f87171' }
};

let currentVectors: Vector[] = [];
let extraVisuals: (() => void)[] = [];
let isTwoQubitSystem = false;


// --- Drawing Functions ---

function drawScene2D() {
    if (!ctx || !size) return;

    const dpr = window.devicePixelRatio || 1;
    
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);

    ctx.save();
    ctx.scale(dpr, dpr);

    // Axes
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, originY); ctx.lineTo(size, originY);
    ctx.moveTo(originX, 0); ctx.lineTo(originX, size);
    ctx.stroke();
    
    if (isTwoQubitSystem) {
         drawTwoQubitSystem();
    } else {
         drawVectorGuide(basisVectors.ket0.angle, 8, basisVectors.ket0.color, basisVectors.ket0.label);
         drawVectorGuide(basisVectors.ket1.angle, 8, basisVectors.ket1.color, basisVectors.ket1.label);
         currentVectors.forEach(v => drawVector(v.angle, v.length, v.color, v.label));
    }
    
    extraVisuals.forEach(vis => vis());

    ctx.restore();
}

function drawTwoQubitSystem() {
    if (!ctx || !size) return;
    const controlQubit = currentVectors[0];
    const targetQubit = currentVectors[1];
    ctx.save();
    ctx.beginPath();
    ctx.arc(originX - size/4, originY, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = controlQubit.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'center';
    ctx.font = '14px Inter';
    ctx.fillText(controlQubit.label, originX - size/4, originY + 5);
    ctx.beginPath();
    ctx.arc(originX + size/4, originY, 20, 0, 2 * Math.PI);
    ctx.strokeStyle = targetQubit.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillText(targetQubit.label, originX + size/4, originY + 5);
    ctx.beginPath();
    ctx.moveTo(originX - size/4 + 20, originY);
    ctx.lineTo(originX + size/4 - 20, originY);
    ctx.strokeStyle = '#6b7280';
    ctx.stroke();
    ctx.font = '16px Inter';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText("Control", originX - size/4, originY - 30);
    ctx.fillText("Target", originX + size/4, originY - 30);
    ctx.restore();
}

function drawVector(angleDeg: number, length: number, color: string, label: string) {
    if (!ctx) return;
    const angleRad = angleDeg * Math.PI / 180;
    const endX = originX + length * scale * Math.cos(angleRad);
    const endY = originY - length * scale * Math.sin(angleRad);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    const headlen = 10;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angleRad - Math.PI / 6), endY + headlen * Math.sin(angleRad - Math.PI / 6));
    ctx.lineTo(endX - headlen * Math.cos(angleRad + Math.PI / 6), endY + headlen * Math.sin(angleRad + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(label, endX + 20 * Math.cos(angleRad), endY - 20 * Math.sin(angleRad));
    ctx.restore();
}

function drawVectorGuide(angleDeg: number, length: number, color: string, label: string) {
    if (!ctx) return;
    const angleRad = angleDeg * Math.PI / 180;
    const endX = originX + length * scale * Math.cos(angleRad);
    const endY = originY - length * scale * Math.sin(angleRad);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.font = '14px Inter';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.fillText(label, endX + 20 * Math.cos(angleRad), endY - 20 * Math.sin(angleRad));
    ctx.restore();
}

function getMatrixDimensions(matrix: string[][], cx: number, cy: number) {
    const cell_w = 60 / (matrix[0].length > 2 ? 1.5 : 1);
    const cell_h = 40 / (matrix.length > 2 ? 1.5 : 1);
    const total_w = cell_w * matrix[0].length;
    const total_h = cell_h * matrix.length;
    const startX = cx - total_w / 2;
    const startY = cy - total_h / 2;
    return { cell_w, cell_h, total_w, total_h, startX, startY };
}

function drawMatrixOnCanvas(matrix: string[][], cx: number, cy: number, p = 1, highlightDiagonal = false, animName = '') {
    if (!ctx) return;
    const { cell_w, cell_h, total_w, total_h, startX, startY } = getMatrixDimensions(matrix, cx, cy);
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const bracketPadding = 10;
    const bracketThickness = 6;
    const bracketExtension = 5;
    const bracketX_L = startX - bracketPadding;
    const bracketX_R = startX + total_w + bracketPadding;
    const bracketY_T = startY - bracketExtension;
    const bracketY_B = startY + total_h + bracketExtension;
    ctx.moveTo(bracketX_L, bracketY_T);
    ctx.lineTo(bracketX_L, bracketY_B);
    ctx.moveTo(bracketX_L, bracketY_T);
    ctx.lineTo(bracketX_L + bracketThickness, bracketY_T);
    ctx.moveTo(bracketX_L, bracketY_B);
    ctx.lineTo(bracketX_L + bracketThickness, bracketY_B);
    ctx.moveTo(bracketX_R, bracketY_T);
    ctx.lineTo(bracketX_R, bracketY_B);
    ctx.moveTo(bracketX_R, bracketY_T);
    ctx.lineTo(bracketX_R - bracketThickness, bracketY_T);
    ctx.moveTo(bracketX_R, bracketY_B);
    ctx.lineTo(bracketX_R - bracketThickness, bracketY_B);
    ctx.stroke();
    ctx.font = `${24 / (matrix.length > 2 ? 1.5 : 1)}px Inter`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            const x = startX + j * cell_w + cell_w / 2;
            const y = startY + i * cell_h + cell_h / 2;
            ctx.fillStyle = (highlightDiagonal && i === j && p > 0.25) ? '#facc15' : 'white';
            let text = matrix[i][j];
            if (animName === 'hermitian-conjugate') {
                const stage_p = p * 2;
                if (stage_p <= 1) { // Transpose
                    if (i !== j) {
                        const p_x = startX + (1 - j) * cell_w + cell_w / 2;
                        const p_y = startY + (1 - i) * cell_h + cell_h / 2;
                        const move_p = stage_p;
                        ctx.fillText(text, x + (p_x - x) * move_p, y + (p_y - y) * move_p);
                    } else {
                        ctx.fillText(text, x, y);
                    }
                } else { // Conjugate
                    const conj_p = stage_p - 1;
                    let newText = text;
                    if (i === 0 && j === 1) newText = "3+2i";
                    if (i === 1 && j === 0) newText = "2-i";
                    ctx.globalAlpha = conj_p;
                    ctx.fillText(newText, x, y);
                    ctx.globalAlpha = 1.0;
                }
            } else {
                 ctx.fillText(text, x, y);
            }
        }
    }
    ctx.restore();
}

function drawVectorAt(cx: number, cy: number, angleDeg: number, length: number, color: string, label: string) {
    if (!ctx) return;
    const angleRad = angleDeg * Math.PI / 180;
    const endX = cx + length * scale * Math.cos(angleRad);
    const endY = cy - length * scale * Math.sin(angleRad);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    // Draw line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    // Draw arrowhead
    const headlen = 10;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - headlen * Math.cos(angleRad - Math.PI / 6), endY + headlen * Math.sin(angleRad - Math.PI / 6));
    ctx.lineTo(endX - headlen * Math.cos(angleRad + Math.PI / 6), endY + headlen * Math.sin(angleRad + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    // Draw label
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(label, endX + 20 * Math.cos(angleRad), endY - 20 * Math.sin(angleRad));
    ctx.restore();
}

function animate2D(callback: (progress: number) => void, duration = 1500) {
    if (animationFrameId2D) cancelAnimationFrame(animationFrameId2D);
    let startTime: number | null = null;
    const animationStep = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
        callback(easedProgress);
        if (progress < 1) animationFrameId2D = requestAnimationFrame(animationStep);
    };
    animationFrameId2D = requestAnimationFrame(animationStep);
}


// --- Controller ---
export const vizController2D = {
    init: (canvasElement: HTMLCanvasElement) => {
        canvas = canvasElement;
        ctx = canvas.getContext('2d');
    },

    resize: () => {
        if (!canvas || !ctx) return;
        const container = canvas.parentElement!;
        if (!container) return;

        size = Math.min(container.clientWidth, container.clientHeight);

        const dpr = window.devicePixelRatio || 1;

        canvas.width = size * dpr;
        canvas.height = size * dpr;

        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;

        scale = size / 20; // Based on CSS size
        originX = size / 2;
        originY = size / 2;

        drawScene2D();
    },

    animateInnerProduct: () => {
        isTwoQubitSystem = false;
        const phi = { angle: 30, length: 8, color: '#a78bfa', label: "|φ⟩" };
        const psi = { angle: 75, length: 8, color: '#facc15', label: "|ψ⟩" };
        const phiRad = (phi.angle) * Math.PI / 180;
        const psiRad = (psi.angle) * Math.PI / 180;
        const projectionLength = psi.length * Math.cos(psiRad - phiRad);
        currentVectors = [phi, psi];
        animate2D(p => {
            extraVisuals = [
                () => {
                    if(!ctx) return;
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    const psiEndX = originX + psi.length * scale * Math.cos(psiRad);
                    const psiEndY = originY - psi.length * scale * Math.sin(psiRad);
                    const projEndX = originX + projectionLength * scale * Math.cos(phiRad) * p;
                    const projEndY = originY - projectionLength * scale * Math.sin(phiRad) * p;
                    ctx.beginPath();
                    ctx.moveTo(psiEndX, psiEndY);
                    ctx.lineTo(projEndX, projEndY);
                    ctx.stroke();
                    ctx.restore();
                },
                () => { drawVector(phi.angle, projectionLength * p, '#ffffff', `⟨φ|ψ⟩`); }
            ];
            drawScene2D();
        });
    },

    animateOuterProduct: () => {
        isTwoQubitSystem = false;
        const phi = { angle: 30, length: 8, color: '#a78bfa', label: "|φ⟩" }; 
        const psi = { angle: 120, length: 8, color: '#facc15', label: "|ψ⟩" }; 
        const phiRad = (phi.angle) * Math.PI / 180;
        const ket0_proj = Math.cos(phiRad);
        const ket1_proj = Math.sin(phiRad);
        const endAngle = psi.angle;
        animate2D(p => {
            const p0_angle = 0 + (endAngle - 0) * p;
            const p0_len = 8 * (1-p) + Math.abs(ket0_proj) * psi.length * p;
            const p1_angle = 90 + (endAngle - 90) * p;
            const p1_len = 8 * (1-p) + Math.abs(ket1_proj) * psi.length * p;
            currentVectors = [
                { angle: p0_angle, length: p0_len, color: '#60a5fa', label: "A|0⟩" },
                { angle: p1_angle, length: p1_len, color: '#f87171', label: "A|1⟩" }
            ];
             extraVisuals = [
                () => drawVectorGuide(phi.angle, phi.length, phi.color, "|φ⟩ (proj)"),
                () => drawVectorGuide(psi.angle, psi.length, psi.color, "|ψ⟩ (dir)")
            ];
            drawScene2D();
        });
    },


    animateEigenvectors: () => {
        isTwoQubitSystem = false;
        const plusState = { angle: 45, length: 8, color: '#facc15', label: "|+⟩" };
        const minusState = { angle: 135, length: 8, color: '#a78bfa', label: "|-⟩" };
        const otherState = { angle: 20, length: 6, color: '#ffffff', label: "|ψ⟩" };

        const finalMinus = { ...minusState, length: -8 }; // scales by -1
        const finalOther = { angle: 70, length: 6 };

        animate2D(p => {
            const p_angle = otherState.angle + (finalOther.angle - otherState.angle) * p;
            const m_len = minusState.length + (finalMinus.length - minusState.length) * p;

            currentVectors = [
                plusState, // stays same
                { ...minusState, length: m_len },
                { ...otherState, angle: p_angle }
            ];
            drawScene2D();
        }, 2500);
    },

    animateProjection: () => {
        isTwoQubitSystem = false;
        const psi = { angle: 35, length: 8, color: '#facc15', label: "|ψ⟩" };
        const projLength = psi.length * Math.cos(psi.angle * Math.PI / 180);
        
        animate2D(p => {
            currentVectors = [psi];
            extraVisuals = [
                () => {
                    if(!ctx) return;
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    const psiRad = psi.angle * Math.PI / 180;
                    const psiEndX = originX + psi.length * scale * Math.cos(psiRad);
                    const psiEndY = originY - psi.length * scale * Math.sin(psiRad);
                    const projEndX = originX + projLength * scale * p;
                    ctx.beginPath();
                    ctx.moveTo(psiEndX, psiEndY);
                    ctx.lineTo(projEndX, psiEndY);
                    ctx.stroke();
                    ctx.restore();
                },
                () => { drawVector(0, projLength * p, '#ffffff', `P₀|ψ⟩`); }
            ];
            drawScene2D();
        });
    },

    animateLocalOperator: () => {
        isTwoQubitSystem = false; // We are manually drawing the two qubits
        currentVectors = [];
        
        const qubit1_start_angle = 0;   // |0>
        const qubit1_end_angle = 45;    // |+> (from Hadamard)
        const qubit2_angle = 0;         // |0> (Identity, no change)

        animate2D(p => {
            if (!ctx || !size) return;
            ctx.clearRect(0, 0, canvas!.width, canvas!.height);
            ctx.save();
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(0, 0, size, size);

            ctx.font = '16px Inter';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.fillText("Applying H ⊗ I", size / 2, 30);
            
            const qubit1_current_angle = qubit1_start_angle + (qubit1_end_angle - qubit1_start_angle) * p;

            // Draw Qubit 1
            ctx.fillText("Qubit 1 (H)", size * 0.25, size * 0.5 - 80);
            drawVectorAt(size * 0.25, size * 0.5, qubit1_current_angle, 8, '#60a5fa', '|ψ₁⟩');

            // Draw Qubit 2
            ctx.fillText("Qubit 2 (I)", size * 0.75, size * 0.5 - 80);
            drawVectorAt(size * 0.75, size * 0.5, qubit2_angle, 8, '#f87171', '|ψ₂⟩');

            ctx.restore();
        }, 3000);
    },


    reset: () => {
        if (animationFrameId2D) cancelAnimationFrame(animationFrameId2D);
        animationFrameId2D = null;
        isTwoQubitSystem = false;
        currentVectors = [
            { angle: 0, length: 8, color: '#60a5fa', label: "|0⟩" },
            { angle: 90, length: 8, color: '#f87171', label: "|1⟩" }
        ];
        extraVisuals = [];
        drawScene2D();
    }
};