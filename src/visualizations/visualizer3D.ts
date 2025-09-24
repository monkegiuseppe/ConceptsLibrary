import * as THREE from 'three';

let container: HTMLDivElement | null = null;
let overlay: HTMLDivElement | null = null;
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
let animationFrameId3D: number | null = null;
let sphere: THREE.Group | null = null;
let twoSpheres: THREE.Group[] = [];
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let onPointerDown: (e: PointerEvent | TouchEvent) => void;
let onPointerUp: () => void;
let onPointerMove: (e: PointerEvent | TouchEvent) => void;

function createTextSprite(message: string, options: { fontsize?: number; fontface?: string; } = {}) {
    const { fontface = 'Inter', fontsize = 32 } = options;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Sprite(); 

    const font = `Bold ${fontsize}px ${fontface}`;
    context.font = font;

    const metrics = context.measureText(message);
    const textWidth = Math.ceil(metrics.width);
    canvas.width = textWidth;
    canvas.height = fontsize;
    
    context.font = font;
    context.fillStyle = 'rgba(255, 255, 255, 1.0)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(message, textWidth / 2, fontsize / 2);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    const aspect = canvas.width / canvas.height;
    sprite.scale.set(aspect * 2, 2, 1.0); 
    
    return sprite;
}

export const vizController3D = {
    init: (containerElement: HTMLDivElement, overlayElement: HTMLDivElement) => {
        if (renderer) return;
        container = containerElement;
        overlay = overlayElement;
        scene = new THREE.Scene();
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        const ambientLight = new THREE.AmbientLight(0xcccccc, 1.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2, 2, 5);
        scene.add(directionalLight);
        onPointerDown = (e) => {
            isDragging = true;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            previousMousePosition = { x: clientX, y: clientY };
        };
        onPointerUp = () => { isDragging = false; };
        onPointerMove = (e) => {
            if (!isDragging) return;
            const group = sphere || (twoSpheres.length > 0 ? twoSpheres[0].parent : null);
            if (!group) return;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            const deltaMove = {
                x: clientX - previousMousePosition.x,
                y: clientY - previousMousePosition.y
            };
            group.rotation.y += deltaMove.x * 0.005;
            group.rotation.x += deltaMove.y * 0.005;
            previousMousePosition = { x: clientX, y: clientY };
        };
        renderer.domElement.addEventListener('pointerdown', onPointerDown);
        renderer.domElement.addEventListener('pointerup', onPointerUp);
        renderer.domElement.addEventListener('pointerleave', onPointerUp);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
    },
    
    createSphere: (position = new THREE.Vector3(0,0,0)): THREE.Group => {
        const group = new THREE.Group();
        group.position.copy(position);
        
        const geometry = new THREE.SphereGeometry(1.6, 32, 32); 
        const material = new THREE.MeshPhongMaterial({ color: 0x374151, transparent: true, opacity: 0.2 });
        const sphereMesh = new THREE.Mesh(geometry, material);
        group.add(sphereMesh);
        
        const wireframe = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x4b5563, transparent: true, opacity: 0.3 })
        );
        group.add(wireframe);

        const axes = new THREE.AxesHelper(1.9); 
        group.add(axes);
        
        scene.add(group);
        return group;
    },

    createVector: (phi: number, theta: number, color = 0xffffff, length = 1.6): THREE.ArrowHelper => {
        const x = length * Math.sin(theta) * Math.cos(phi);
        const y = length * Math.sin(theta) * Math.sin(phi);
        const z = length * Math.cos(theta);
        const dir = new THREE.Vector3(x, y, z);
        const origin = new THREE.Vector3(0, 0, 0);
        
        const arrow = new THREE.ArrowHelper(dir.normalize(), origin, length, color, 0.15, 0.08);

        arrow.children.forEach(child => {
            const material = (child as THREE.Mesh).material as THREE.Material;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -1;
            material.polygonOffsetUnits = -1;
        });

        return arrow;
    },
    
    animateBlochSphere: () => {
        if (!camera || !renderer) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4); 
        camera.lookAt(0,0,0);
        sphere = vizController3D.createSphere();
        const stateVector = vizController3D.createVector(Math.PI / 4, Math.PI / 3);
        sphere.add(stateVector);
        vizController3D.animate();
    },

    animateMixedState: () => {
        if (!camera || !renderer || !overlay) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4); 
        camera.lookAt(0, 0, 0);
        
        sphere = vizController3D.createSphere();
        
        const stateDirection = new THREE.Vector3(1, 1, 1).normalize(); 
        const stateVector = new THREE.ArrowHelper(stateDirection.clone(), new THREE.Vector3(0,0,0), 1.6, 0xffffff, 0.15, 0.08);
        
        stateVector.children.forEach(child => {
            const material = (child as THREE.Mesh).material as THREE.Material;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -1;
        });

        sphere.add(stateVector);

        const textContainer = document.createElement('div');
        textContainer.className = 'p-4 bg-gray-900/70 rounded-lg backdrop-blur-sm';
        overlay.appendChild(textContainer);

        const loop = (time: number) => {
            if (!renderer || !sphere) return;
            
            const r = 0.55 + 0.45 * Math.sin(time / 2000);
            stateVector.setLength(r * 1.6, 0.15, 0.08);


            const r_vec = stateDirection.clone().multiplyScalar(r);
            const purity = 0.5 * (1 + r_vec.lengthSq());
            
            textContainer.innerHTML = `
                <h4 class="text-md font-semibold text-white mb-2">Density Matrix (ρ)</h4>
                <p class="text-sm text-gray-400 mb-2">Purity: Tr(ρ²) = ${purity.toFixed(2)}</p>
                <div class="text-lg text-amber-300">
                $$ \\rho = \\frac{1}{2}(I + \\vec{r} \\cdot \\vec{\\sigma}) $$
                </div>
            `;
            if (window.renderMathInElement) {
                window.renderMathInElement(textContainer, {
                    delimiters: [{ left: '$$', right: '$$', display: true }],
                    throwOnError: false
                });
            }
            
            renderer.render(scene, camera);
            animationFrameId3D = requestAnimationFrame(loop);
        };
        vizController3D.animate(loop);
    },
    
    animateUnitaryEvolution: () => {
        if (!camera || !renderer || !overlay) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4);
        camera.lookAt(0,0,0);
        sphere = vizController3D.createSphere();
        const startVec = new THREE.Vector3(1, 0, 0);
        const stateVector = new THREE.ArrowHelper(startVec.normalize(), new THREE.Vector3(0,0,0), 1.6, 0xffffff, 0.15, 0.08);
        stateVector.children.forEach(c => ((c as THREE.Mesh).material as THREE.Material).polygonOffset = true);
        sphere.add(stateVector);

        const textContainer = document.createElement('div');
        textContainer.className = 'p-4 bg-gray-900/70 rounded-lg backdrop-blur-sm';
        overlay.appendChild(textContainer);

        const q = new THREE.Quaternion();
        const zAxis = new THREE.Vector3(0, 0, 1);
        const loop = (time: number) => {
            if(!renderer) return;
            
            const totalAngleRad = (time / 3000) * (2 * Math.PI);
            const wrappedAngleRad = totalAngleRad % (2 * Math.PI);
            
            q.setFromAxisAngle(zAxis, totalAngleRad); 
            const newDir = startVec.clone().applyQuaternion(q);
            stateVector.setDirection(newDir);

            textContainer.innerHTML = `
              <h4 class="text-md font-semibold text-white">Live State Vector</h4>
              <p class="text-sm text-gray-400">θ = 90.0°, φ = ${(wrappedAngleRad * 180 / Math.PI).toFixed(1)}°</p>
              <div class="text-lg text-amber-300 mt-2">
              $$ |\\psi\\rangle = 0.71|0\\rangle + e^{i${wrappedAngleRad.toFixed(2)}}0.71|1\\rangle $$
              </div>`;
            if (window.renderMathInElement) {
                window.renderMathInElement(textContainer, {
                    delimiters: [{ left: '$$', right: '$$', display: true }],
                    throwOnError: false
                });
            }
            
            renderer.render(scene, camera);
            animationFrameId3D = requestAnimationFrame(loop);
        };
        vizController3D.animate(loop);
    },

    animateMeasurement: () => {
        if (!camera || !renderer || !overlay) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4);
        camera.lookAt(0,0,0);
        sphere = vizController3D.createSphere();
        const startVec = new THREE.Vector3(1,0,1).normalize();
        const stateVector = new THREE.ArrowHelper(startVec.clone(), new THREE.Vector3(0,0,0), 1.6, 0xffffff, 0.15, 0.08);
        stateVector.children.forEach(c => ((c as THREE.Mesh).material as THREE.Material).polygonOffset = true);
        sphere.add(stateVector);

        const textContainer = document.createElement('div');
        textContainer.className = 'p-4 bg-gray-900/70 rounded-lg backdrop-blur-sm';
        overlay.appendChild(textContainer);
        
        const theta = Math.PI / 4; 
        const p0 = Math.cos(theta/2)**2;
        const p1 = Math.sin(theta/2)**2;

        textContainer.innerHTML = `
          <h4 class="text-md font-semibold text-white">Probabilities</h4>
          <p class="text-blue-400">P(|0⟩) = cos²(θ/2) = ${p0.toFixed(2)}</p>
          <p class="text-red-400">P(|1⟩) = sin²(θ/2) = ${p1.toFixed(2)}</p>
          <p class="text-gray-400 mt-2 italic">Collapsing...</p>`;

        let phase = 'measuring';
        let outcomeVec = new THREE.Vector3(0,0,1);
        const animateState = { startTime: performance.now() };

        const loop = (time: number) => {
            if(!renderer) return;
            const elapsedTime = time - animateState.startTime;
             if (phase === 'measuring' && elapsedTime > 1500) {
                phase = 'collapsing';
                animateState.startTime = time;
                outcomeVec = Math.random() < p0 ? new THREE.Vector3(0,0,1) : new THREE.Vector3(0,0,-1);
                const resultText = outcomeVec.z > 0 ? '|0⟩' : '|1⟩';
                textContainer.innerHTML += `<p class="mt-2 text-xl text-amber-300">Measured ${resultText}!</p>`;
            } else if (phase === 'collapsing') {
                const progress = Math.min(1, elapsedTime / 800);
                const newDir = new THREE.Vector3().lerpVectors(startVec, outcomeVec, progress);
                stateVector.setDirection(newDir.normalize());
                stateVector.setLength(1.6);
                if(progress === 1) phase = 'done';
            }
            renderer.render(scene, camera);
            if (phase !== 'done') animationFrameId3D = requestAnimationFrame(loop);
        };
        vizController3D.animate(loop);
    },

    animateBellStateCreation: () => {
        if (!camera || !renderer || !overlay) return;
        vizController3D.reset();
        camera.position.set(0, 2.5, 8);
        camera.lookAt(0, 0, 0);

        const textContainer = document.createElement('div');
        textContainer.className = 'p-4 bg-gray-900/70 rounded-lg backdrop-blur-sm';
        overlay.appendChild(textContainer);

        const sphereA = vizController3D.createSphere(new THREE.Vector3(-2.5, 0, 0));
        const sphereB = vizController3D.createSphere(new THREE.Vector3(2.5, 0, 0));

        const vecA = vizController3D.createVector(0, 0); 
        const vecB = vizController3D.createVector(0, 0);
        sphereA.add(vecA);
        sphereB.add(vecB);
        
        const startQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
        const endQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), -Math.PI/2);

        const hadamardSymbol = createTextSprite('H', { fontsize: 32 });
        hadamardSymbol.position.set(-2.5, 1.8, 0);
        hadamardSymbol.visible = false;
        scene.add(hadamardSymbol);
        
        const cnotLineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0 });
        const cnotLineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2.5,0,0), new THREE.Vector3(2.5,0,0)]);
        const cnotLine = new THREE.Line(cnotLineGeometry, cnotLineMaterial);
        scene.add(cnotLine);

        const loop = (time: number) => {
            if(!renderer) return;
            const progress = Math.min((time - startTime) / 8000, 1);
            
            if (progress < 0.33) {
                textContainer.innerHTML = `<h4>Step 1: Apply Hadamard to Qubit A</h4><p>State: |+⟩|0⟩</p>`;
                hadamardSymbol.visible = true;
                const p = progress / 0.33;
                const currentQuat = new THREE.Quaternion().slerpQuaternions(startQuat, endQuat, p);
                vecA.quaternion.copy(currentQuat);

            } else if (progress < 0.66) {
                hadamardSymbol.visible = false;
                textContainer.innerHTML = `<h4>Step 2: Apply CNOT(A, B)</h4><p>Correlating the qubits...</p>`;
                const p = (progress - 0.33) / 0.33;
                cnotLineMaterial.opacity = Math.sin(p * Math.PI);
                vecA.setLength(1.6 * (1 - p), 0.15, 0.08);
                vecB.setLength(1.6 * (1 - p), 0.15, 0.08);
            
            } else {
                cnotLineMaterial.opacity = 0;
                textContainer.innerHTML = `<h4 class="text-amber-300">Result: Entangled Bell State |Φ⁺⟩</h4><p>Individual states are undefined. Measurements are correlated.</p>`;
                vecA.setLength(0, 0, 0);
                vecB.setLength(0, 0, 0);

                const flash = 0.5 + 0.5 * Math.sin(performance.now() / 200);
                (cnotLine.material as THREE.LineBasicMaterial).color.setHex(0xffffff);
                (cnotLine.material as THREE.LineBasicMaterial).opacity = flash;
            }

            renderer.render(scene, camera);
            animationFrameId3D = requestAnimationFrame(loop);
        };
        const startTime = performance.now();
        vizController3D.animate(loop);
    },

    
    animate: (loopCallback: ((time: number) => void) | null = null) => {
        if (animationFrameId3D) cancelAnimationFrame(animationFrameId3D);
        const loop = loopCallback || function animateLoop() {
            if(!renderer) return;
            renderer.render(scene, camera);
            animationFrameId3D = requestAnimationFrame(animateLoop);
        };
        loop(performance.now());
    },
    reset: () => {
        if (overlay) overlay.innerHTML = '';
        if (animationFrameId3D) {
            cancelAnimationFrame(animationFrameId3D);
            animationFrameId3D = null;
        }
        if(scene) {
            while(scene.children.length > 0){ scene.remove(scene.children[0]); }
        } else {
             scene = new THREE.Scene();
        }
        const ambientLight = new THREE.AmbientLight(0xcccccc, 1.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 5);
        scene.add(directionalLight);
        sphere = null;
        twoSpheres = [];
    },
    resize: () => {
        if (!renderer || !container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        if (width === 0 || height === 0) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    },
    cleanup: () => {
        if (renderer) {
            renderer.domElement.removeEventListener('pointerdown', onPointerDown);
            renderer.domElement.removeEventListener('pointerup', onPointerUp);
            renderer.domElement.removeEventListener('pointerleave', onPointerUp);
            renderer.domElement.removeEventListener('pointermove', onPointerMove);
        }
        if (animationFrameId3D) {
            cancelAnimationFrame(animationFrameId3D);
        }
        renderer?.dispose();
    }
};