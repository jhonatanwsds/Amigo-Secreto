import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

class Anya3D {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.initThreeJS();
    this.addResizeListener();
    
  }

  initThreeJS() {
    // 1. Configuração de cena e renderizador
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    
    // 2. Ajuste responsivo do tamanho
    const containerRect = this.container.getBoundingClientRect();
    this.width = containerRect.width;
    this.height = containerRect.height;
    
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio * 0.8); // Otimização de performance
    this.container.appendChild(this.renderer.domElement);

    // 3. Configuração otimizada da câmera
    this.camera = new THREE.PerspectiveCamera(
      45, // FOV reduzido
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0.3, 1.3); // Posição ajustada

    // 4. Iluminação otimizada
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemisphereLight.position.set(1, 2, 1);
    this.scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(3, 5, 3);
    this.scene.add(directionalLight);

    // 5. Carregamento do modelo com ajustes
    new GLTFLoader().load(
      './assets/models/anya.glb',
      (gltf) => {
        this.model = gltf.scene;
        
        // Ajuste de orientação inicial
        this.model.rotation.set(-0.0, Math.PI/3, 0); // Inclinação para frente
        
        // Posicionamento vertical
        this.model.position.set(0, -1, 0); // Ajuste Y-axis
        
        // Foco na parte superior do corpo
        this.model.traverse((child) => {
          if (child.isMesh && child.name === 'Head') {
            this.camera.lookAt(child.position);
          }
        });

        this.scene.add(this.model);
        this.animate();
      },
      undefined,
      (error) => console.error('Erro:', error)
    );
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    if(this.model) {
      // Rotação suave com delta time
      this.model.rotation.y += 0.006;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

  addResizeListener() {
    window.addEventListener('resize', () => {
      const rect = this.container.getBoundingClientRect();
      this.camera.aspect = rect.width / rect.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(rect.width, rect.height);
    });
  }
}

// Inicialização otimizada
let anya3D;

window.addEventListener('load', () => {
  anya3D = new Anya3D('anya3dHeader');
  
  // Delay para carregamento de assets
  setTimeout(() => {
    const container = document.getElementById('anya3dHeader');
    container.style.opacity = '1';
    container.style.transform = 'scale(1)';
  }, 500);
});