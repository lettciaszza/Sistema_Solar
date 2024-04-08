import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

//Tramanho de tela 
let SCREEN_WIDTH = window.innerWidth; //Define as variaveis de 
let SCREEN_HEIGHT = window.innerHeight; // largura
let aspect_ratio = SCREEN_WIDTH / SCREEN_HEIGHT; //Calcula a proporção entre a largura e altura da janela para definir o aspect ratio da câmera.

let camera_perspective, active_camera, scene, renderer, stats, controls;
let cubo; //declara a variavel cubo


// Para utilizar shaders temos que declarar algumas variaveis principais como uniforms, normalVertexShader e fragmentshaders

//Utiliza o uniforms para passar info para GPU
const uniforms = {
    u_mouse: { value: { x: window.innerWidth / 2, y: window.innerHeight / 2 } },
  u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
  u_time: { value: 0.0 },
  u_color: { value: new THREE.Color(0xFF0000) }
}
 //ria um objeto 'uniforms' que contém as informações a serem passadas para o shader na GPU.

const clock = new THREE.Clock(); //Mede o tempo decorrido

//inicia a cena
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    camera_perspective = new THREE.PerspectiveCamera(45, aspect_ratio, 0.1, 1000);
//camera
    active_camera = camera_perspective;
    active_camera.position.set(1, 0.5, 10);
//linhas de eixo
    let axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

	//cria o objeto shader apartir do vertice de 4
    function createShaderObject() {
        const basicVertexShader = `
                    void main() {
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `;

        const basicFragmentShader = `
                    void main() {
                      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    }
                `;

        const scaleVertexShader = `
                    void main() {
                        vec3 scale = vec3(2.0, 1.0, 1.0);
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position * scale, 1.0);
                    }
                `;

        const redAnimationFragmentShader = `
                    uniform vec2 u_mouse; // mouse position in screen pixels
                  uniform vec2 u_resolution; //Canvas size (width,height)
                  uniform float u_time; // shader playback time (in seconds)

                    void main() {
                      gl_FragColor = vec4(0.0, abs(sin(u_time)), 0.0, 1.0);
                    }
                `;

        const colorInterpFragmentShader = `
                uniform vec2 u_mouse; // mouse position in screen pixels
                  uniform vec2 u_resolution; //Canvas size (width,height)
                  uniform float u_time; // shader playback time (in seconds)

                    void main() {
                        vec2 st = gl_FragCoord.xy/u_resolution.xy; // px / 1920 e py / 1080
                        gl_FragColor = vec4(st.x,st.y,0.0,1.0);
                    }
                `;

        const normalVertexShader = `
                    varying vec3 v_normal;
                    void main() {
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                      v_normal = normal;
                    }
                `;

        const normalFragmentShader = `
                    varying vec3 v_normal;
										uniform vec3 u_mouse;
uniform vec3 u_resolution;
uniform vec3 u_color;
uniform float u_time;
                    void main() {
										
										
                      gl_FragColor = vec4(1.0, 0.0, abs(sin(u_time * 1.0)), 1.0);
                    }
                `;// Muda de cor vermelho para rosa nas camadas rgba

        // Renderizando o cubo
        const geometry = new THREE.BoxGeometry(1,1,1);
        const planeGeometry = new THREE.PlaneGeometry(4, 4);
        const material = new THREE.ShaderMaterial({
            vertexShader: normalVertexShader,
            fragmentShader: normalFragmentShader,
            uniforms
        });

        cubo = new THREE.Mesh(geometry, material);
        scene.add(cubo);

        cubo.position.set(1, 1, 1);
    }
    createShaderObject();

    renderer = new THREE.WebGLRenderer({ alpha: true,
  antialias: true, });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;

    createControls(camera_perspective);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', (e) => {
        window.addEventListener('resize', onWindowResize, false);
        uniforms.u_mouse.value.x = e.clientX;
        uniforms.u_mouse.value.y = e.clientY;
    })
}

function onWindowResize() { // Chamada quando ocorreredimensionamento da janela do navegador.
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    aspect_ratio = SCREEN_WIDTH / SCREEN_HEIGHT;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    active_camera.aspect = aspect_ratio;
    active_camera.updateProjectionMatrix();

    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;

    console.log(uniforms.u_resolution);
}

function createControls(camera) {
    active_camera = camera;
    active_camera.position.set(1, 0.5, 10);
	

    controls = new TrackballControls(active_camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = ['KeyA', 'KeyS', 'KeyD']; //Define as teclas do teclado que serão usadas para realizar os movimentos dos controles.
}

const animate = function () {
	cubo.rotation.y += 0.01;
  cubo.rotation.x += 0.01;
    
	

    uniforms.u_time.value = clock.getElapsedTime();

    controls.update();
    stats.update();
requestAnimationFrame(animate);
    renderer.render(scene, active_camera);
};

init();
animate();

/*LINKS:
  https://dev.to/maniflames/creating-a-custom-shader-in-threejs-3bhi
  https://www.youtube.com/watch?v=C8Cuwq1eqDw
  https://www.javascript.christmas/2020/10
  https://medium.com/@sidiousvic/how-to-use-shaders-as-materials-in-three-js-660d4cc3f12a
  https://thebookofshaders.com/
  https://threejs.org/docs/#api/en/materials/ShaderMaterial
  https://aerotwist.com/tutorials/an-introduction-to-shaders-part-1/
  https://www.shadertoy.com/
*/