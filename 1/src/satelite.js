//Cria lua/satelites

function Satelite(radius,textura,distancia){
	this.resolution=25;
	this.geometry=new THREE.SphereGeometry(radius,this.resolution,this.resolution);
	this.material=new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(textura),
   emissiveIntensity: 0.0 // Valor do brilho (0.0 a 1.0)
 });

	this.mesh= new THREE.Mesh(this.geometry,this.material);
	this.mesh.position.x = distancia;
	this.mesh.position.y = 2;
	this.mesh.position.z = 0;

	this.mesh.name = "Satelite";

//Renderiza o 3D
	this.transformacion=new THREE.Object3D();
	this.transformacion.add(this.mesh);

	//cria a rotação da lua em torno da terra
	this.animar=function(stepluna){
		 this.transformacion.rotation.y=stepluna;
	};

	this.draw=function(scene){
		scene.add(this.transformacion);
	};

};
