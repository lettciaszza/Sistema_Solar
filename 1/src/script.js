
//Cria a cena principal adicionando os elementos lua, terra e sol

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var terra;
var transformacionTerra;
var step=0;
var steplua=0;
var mvlua=true;
var sol;
var lights = []; // Array para armazenar as luzes da balada
var lightIntensity = 1; // Intensidade inicial das luzes
var lightStep = 0.05; // Passo de variação da intensidade das luzes

main();

function renderScene() {

	step+=0.01;
	if(mvlua) steplua+=0.015;
	else steplua-=0.01;
	terra.animar(step,steplua);

  // Altera a intensidade das luzes
  for (var i = 0; i < lights.length; i++) {
    lights[i].intensity += lightStep;
    if (lights[i].intensity >= 2 || lights[i].intensity <= 0.5) {
      lightStep *= -1; // Inverte o sentido da variação
    }
  }
  
	requestAnimationFrame(renderScene);
	renderer.render(scene, camera);

}
 

function switchLua(){
	mvlua=!mvlua;
}


  
function main() {

	renderer.setClearColor(0x0000,1.0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMapEnabled = false; //no shadow casting
	renderer.setSize(window.innerWidth, window.innerHeight);
 

  
//Adiciona o sol
	sol = new Sun(6,'img/sun.jpg');
	sol.draw(scene);


//Adiciona planeta
	terra= new Planeta(4,'img/earth.jpg',25);
	sol.addPlaneta(terra);


//Adiciona a lua
	lua= new Satelite(2,'img/moon.gif',10);
	terra.addSatelite(lua);



//Iluminação
var spotLight = new THREE.SpotLight(0xff148f, 10, 100, Math.PI / 4, 1, 2); //azul escuro
spotLight.position.set(0,10,0);
spotLight.target.position.set(0,0,0);
    spotLight.intensity = 7; // 

scene.add(spotLight);

var pointLight = new THREE.PointLight(0xff0000); //vermelho
pointLight.position.set(0,0,0);
pointLight.castShadow=true;
    spotLight.intensity = 4; // 

scene.add(pointLight);

var directionalLight = new THREE.DirectionalLight(0x186f00); //verde
directionalLight.position.set(0,1,0);
directionalLight.castShadow=true;
    spotLight.intensity = 4; //

scene.add(directionalLight);


var directionalLight = new THREE.DirectionalLight(0xffff00); //amarelo
directionalLight.position.set(0,1,0);
directionalLight.castShadow=true;
    spotLight.intensity = 4; // 

scene.add(directionalLight);
 
var ambientLight = new THREE.AmbientLight (0xffffff); //branco
ambientLight.position.set(0,0,0);
ambientLight.castShandow=true;
    spotLight.intensity = 4;

scene.add (ambientLight);
  

// Cria a camera da cena
camera.position.x = -30;
  camera.position.y = 20;
camera.position.z = 30;
camera.lookAt(scene.position);
$("#canvas").append(renderer.domElement);

renderScene();
  
}
  
