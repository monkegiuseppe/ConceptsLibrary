import * as THREE from 'three';

// --- (Module-level state and other functions remain the same) ---
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

export const vizController3D = {
    init: (containerElement: HTMLDivElement, overlayElement: HTMLDivElement) => {
        // ... (init function is unchanged)
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
    
    // --- FIX: Increased the sphere's radius again ---
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

    // --- FIX: Updated helper to set color and fix z-fighting ---
    createVector: (phi: number, theta: number, color = 0xffffff, length = 1.6): THREE.ArrowHelper => {
        const x = length * Math.sin(theta) * Math.cos(phi);
        const y = length * Math.sin(theta) * Math.sin(phi);
        const z = length * Math.cos(theta);
        const dir = new THREE.Vector3(x, y, z);
        const origin = new THREE.Vector3(0, 0, 0);
        
        const arrow = new THREE.ArrowHelper(dir.normalize(), origin, length, color, 0.15, 0.08);
        
        // This is the key fix: it tells the renderer to "pull" the arrow material
        // slightly towards the camera, so it always draws on top of the axis lines.
        arrow.children.forEach(child => {
            const material = (child as THREE.Mesh).material as THREE.Material;
            material.polygonOffset = true;
            material.polygonOffsetFactor = -1;
            material.polygonOffsetUnits = -1;
        });

        return arrow;
    },
    
    // --- UPDATED ALL 3D ANIMATIONS WITH NEW CAMERA AND SIZES ---

    animateBlochSphere: () => {
        if (!camera || !renderer) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4); // Closer camera
        camera.lookAt(0,0,0);
        sphere = vizController3D.createSphere();
        const stateVector = vizController3D.createVector(Math.PI / 4, Math.PI / 3);
        sphere.add(stateVector);
        vizController3D.animate();
    },

    animateMixedState: () => {
        if (!camera || !renderer || !overlay) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4); // Closer camera
        camera.lookAt(0, 0, 0);
        
        sphere = vizController3D.createSphere();
        
        const stateDirection = new THREE.Vector3(1, 1, 1).normalize(); // Use a non-axis vector
        const stateVector = new THREE.ArrowHelper(stateDirection.clone(), new THREE.Vector3(0,0,0), 1.6, 0xffffff, 0.15, 0.08);
        
        // Apply the z-fighting fix to this manually created arrow
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
            
            // --- FIX: Spinning code has been removed ---

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
        if (!camera || !renderer) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4);
        camera.lookAt(0,0,0);
        sphere = vizController3D.createSphere();
        const startVec = new THREE.Vector3(1, 0, 0);
        const stateVector = new THREE.ArrowHelper(startVec.normalize(), new THREE.Vector3(0,0,0), 1.6, 0xffffff, 0.15, 0.08);
        // Apply z-fighting fix
        stateVector.children.forEach(c => ((c as THREE.Mesh).material as THREE.Material).polygonOffset = true);
        sphere.add(stateVector);

        const q = new THREE.Quaternion();
        const zAxis = new THREE.Vector3(0, 0, 1);
        const loop = (time: number) => {
            if(!renderer) return;
            const angle = (time / 3000) * Math.PI;
            q.setFromAxisAngle(zAxis, angle);
            const newDir = startVec.clone().applyQuaternion(q);
            stateVector.setDirection(newDir);
            renderer.render(scene, camera);
            animationFrameId3D = requestAnimationFrame(loop);
        };
        vizController3D.animate(loop);
    },

    animateMeasurement: () => {
        if (!camera || !renderer) return;
        vizController3D.reset();
        camera.position.set(2, 2, 4);
        camera.lookAt(0,0,0);
        sphere = vizController3D.createSphere();
        const startVec = new THREE.Vector3(1,0,1).normalize();
        const stateVector = new THREE.ArrowHelper(startVec.clone(), new THREE.Vector3(0,0,0), 1.6, 0xffffff, 0.15, 0.08);
        stateVector.children.forEach(c => ((c as THREE.Mesh).material as THREE.Material).polygonOffset = true);
        sphere.add(stateVector);

        let phase = 'measuring';
        let outcomeVec = new THREE.Vector3(0,0,1);
        const animateState = { startTime: performance.now() };
        const loop = (time: number) => {
            if(!renderer) return;
            const elapsedTime = time - animateState.startTime;
             if (phase === 'measuring' && elapsedTime > 500) {
                phase = 'collapsing';
                animateState.startTime = time;
                outcomeVec = Math.random() < 0.5 ? new THREE.Vector3(0,0,1) : new THREE.Vector3(0,0,-1);
            } else if (phase === 'collapsing') {
                const progress = Math.min(1, elapsedTime / 800);
                const newDir = new THREE.Vector3().lerpVectors(startVec, outcomeVec, progress);
                stateVector.setDirection(newDir.normalize());
                stateVector.setLength(1.6);
                if(progress === 1) {
                    phase = 'resetting';
                    animateState.startTime = time;
                }
            } else if (phase === 'resetting' && elapsedTime > 2000) {
                phase = 'measuring';
                animateState.startTime = time;
                stateVector.setDirection(startVec);
            }
            renderer.render(scene, camera);
            animationFrameId3D = requestAnimationFrame(loop);
        };
        vizController3D.animate(loop);
    },

    animateBellState: () => {
        if (!camera || !renderer) return;
        vizController3D.reset();
        camera.position.set(2.5, 2.5, 7);
        camera.lookAt(0,0,0);
        const group = new THREE.Group();
        const sphere1 = vizController3D.createSphere(new THREE.Vector3(-2.2, 0, 0));
        const sphere2 = vizController3D.createSphere(new THREE.Vector3(2.2, 0, 0));
        const vector1 = vizController3D.createVector(0,0, 0xffffff, 1.6);
        const vector2 = vizController3D.createVector(0,0, 0xffffff, 1.6);
        sphere1.add(vector1);
        sphere2.add(vector2);
        group.add(group);
        scene.add(group);
        twoSpheres = [sphere1, sphere2];
        const material = new THREE.LineBasicMaterial({ color: 0x6b7280 });
        const points = [new THREE.Vector3(-2, 0, 0), new THREE.Vector3(2, 0, 0)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        group.add(line);
        // ... (rest of bell state logic is fine)
    },
    
    // ... (rest of the controller: animate, reset, resize, cleanup)
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