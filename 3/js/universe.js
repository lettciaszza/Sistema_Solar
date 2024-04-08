//Deve se adicionar as libs Trackball conforme o vídeo do Universo Discreto e Dat.GUI
//Versão do Trackball antiga
const W = window.innerWidth; // largura
const H = window.innerHeight; // altura

const clock = new THREE.Clock(); // Para o Trackball

const scene = new THREE.Scene(); // Cria a cena

const camera = new THREE.PerspectiveCamera(75, W / H, 0.1, 3000); // adiciona a perspectiva da camera

const renderer = new THREE.WebGLRenderer();
renderer.setSize(W, H);
document.body.appendChild(renderer.domElement); // Adicionar o dom Element para renderizar

const stat = new Stats();

// Declarou luz, lua,sol, e o controle do trackball
var luz, trackballControls;
var sol, lua;
var lights = []; // Array para armazenar as luzes da balada
var lightIntensity = 10; // Intensidade inicial das luzes
var lightStep = 0.5; // Passo de variação da intensidade das luzes
var now = Date.now();

// Cria função init onde vai ser adicionado os elementos, executa as tarefas que devem ser iniciadas no inicio do programa

function init() {

  // Iluminação
  camera.position.set(0, 0, 500); // Posição da camera na luz

  var spotLight = new THREE.SpotLight(0x0000ff);
  //azul escuro 4 =  É o ângulo de abertura da luz. 1 = É a atenuação linear da luz. 2 =  É a atenuação quadrática da luz.
  spotLight.position.set(0, 0,50);
  spotLight.castShadow = true;
  spotLight.intensity = 10;

  scene.add(spotLight); 

  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add( spotLightHelper );

  // Tipo de iluminação que emite um cone de luz, que pode ser direcionado para um objeto específico.

  var pointLight = new THREE.PointLight(0xff0000); //vermelho
  pointLight.position.set(400, 400, 0);
  pointLight.castShadow = true;
  pointLight.intensity = 10;

  scene.add(pointLight);

 var pointLightHelper = new THREE.PointLightHelper(pointLight, 500); // O segundo parâmetro define o tamanho do ajudante
  scene.add(pointLightHelper);

  // É um tipo de iluminação pontual, que emite raios de luzes em todas as direções.

  var directionalLight_verde = new THREE.DirectionalLight(0x186f00); //verde
directionalLight_verde.position.set(0, 100, 100);
directionalLight_verde.castShadow = true;
directionalLight_verde.intensity = 2;
scene.add(directionalLight_verde);

var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight_verde, 100);
scene.add(directionalLightHelper);

 

  // Assim como o pointLight, é uma iluminação direcionada, emitindo luzes parelelos entre si, sendo semelhante ao sol.
 
  var directionalLight_amarelo = new THREE.DirectionalLight(0xffff00); //amarelo
  directionalLight_amarelo.position.set(0, 10, 0);
  directionalLight_amarelo.castShadow = true;
  directionalLight_amarelo.intensity = 0.5;

  scene.add(directionalLight_amarelo);

  var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight_amarelo, 100);
scene.add(directionalLightHelper);


  var ambientLight = new THREE.AmbientLight(0xffffff); //branco
  ambientLight.position.set(0, 0, 0);
  ambientLight.castShadow = true;
  ambientLight.intensity = 0.5;
  
  scene.add(ambientLight);


  // Tipo de iluminação que preenche toda a cena, possuindo uma iluminação natural do ambiente.

  // Cria uma esfera do sol 
  let geo = new THREE.SphereGeometry(100, 30, 30); // tamanho do sol e lua
  let mat = new THREE.MeshLambertMaterial({
    color: 0xFFFFFF,
    map: new THREE.TextureLoader().load('img/sun.jpg') // textura
  });
  sol = new THREE.Mesh(geo, mat); // mescla o material
  scene.add(sol); // adiciona na cena

  // Cria a lua
  geo = new THREE.BoxGeometry(50, 40, 40);
  mat = new THREE.MeshPhongMaterial({ // É um tipo de material que simula o modelo de iluminação de Phong, que é amplamente utilizado na renderização de objetos 3D.  Considera iluminação, como a cor do objeto, a cor da luz, a posição da luz e a posição do observador, para calcular a cor do pixel renderizado.
    map: new THREE.TextureLoader().load('img/moon.gif')
  });
  lua = new THREE.Mesh(geo, mat);
  scene.add(lua);
  lua.position.x = 300;

  // Adiciona os trackball controls
  trackballControls = new THREE.TrackballControls(camera, renderer.domElement); // Declarou o trackball recebendo camera e render dom
  trackballControls.rotateSpeed = 1.0; // velocidade
  trackballControls.zoomSpeed = 1.0; // zoom
  trackballControls.panSpeed = 1.0; //

  var controls = new function() // cria os controles
  {
    this.rotationSpeed = 1.0;
    this.zoomSpeed = 1.0;
    this.panSpeed = 1.0;
  };

  // Gui - painel de ajuste 
  gui = new dat.GUI(
    { autoplace: false, width: 300 }
  );
  gui.add(controls, 'rotationSpeed', 0, 5.0);
  gui.add(controls, 'zoomSpeed', 0, 5.0);
  gui.add(controls, 'panSpeed', 0, 5.0);

  trackballControls.rotateSpeed = controls.rotationSpeed;

lights.push(spotLight);//manipula as luzes
lights.push(pointLight);
lights.push(directionalLight_verde);
lights.push(directionalLight_amarelo);
lights.push(ambientLight);
}

function render() {
  requestAnimationFrame(render);
  stat.begin();
  now = Date.now(); //  A animação é atualizada de acordo com o valor de 'now', como a posição da lua, rotação do sol e intensidade das luzes, que representa o tempo atual em milissegundos.
  var delta = clock.getDelta();

  for (var i = 0; i < lights.length; i++) {
    if (Math.random() < 0.05) {
      // Altera a intensidade da luz aleatoriamente
      lights[i].intensity = Math.random() * 2;
    }
  }

  // Rotação e translação da lua e sol
  lua.position.x = 300 * Math.cos(0.0005 * now);
  lua.position.z = 300 * Math.sin(0.0005 * now);

  sol.rotation.y += 0.01;
  lua.rotation.y += 0.03;

  // Atualiza a posição das luzes
  for (var i = 0; i < lights.length; i++) {
    lights[i].position.x = 200 * Math.cos(0.001 * now + i * 4 * Math.PI / lights.length);
    lights[i].position.y = 200 * Math.sin(0.001 * now + i * 2 * Math.PI / lights.length);
  }

  // Atualiza os controles do trackball
  trackballControls.update();

  stat.end();

  renderer.render(scene, camera);
}



init();

render();
