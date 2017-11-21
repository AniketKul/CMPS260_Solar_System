/*
Álvaro Peris

Solar system.

All data is real:
	- Orbits
	- Rotation periods
	- Translation periods
	- Planet's sizes
	(by default, in order to have a good visualization of the planets, they are scaled x1000)

*/


// Global vars

var renderer,scene,camera;
var cameraControls;
var far=10000;
var near = 0.001;
var cam, bgScene, bgCam	;
var text2;


var sprite;

var geoSol,geoMerc,geoVen;

var keyboard = new THREEx.KeyboardState();
var axisHelper;
var i;
var dias = 0;
var anyos = 0;
var theta = 0;
var tamScale = 1;
var posScale = 1;
var timeScale = 1;
var positions;

var orbitas = new THREE.Object3D();

var scale_factor = 0.1; // Avoids Z-buffer precision problems

var scaled = false;

// Planet vars

var sol = new THREE.Object3D();
var mercurio;
var venus;




// Planets data

// Radious: Thousands of km

var 	 sol_rad 	 = scale_factor*1392/100;
var mercurio_rad	 = scale_factor*2.49;
var    venus_rad 	 = scale_factor*6;

var 	 sol_tam 	 = sol_rad;
var mercurio_tam	 = mercurio_rad;
var    venus_tam 	 = venus_rad;


// Major axis == Distance to the sun. In thousand of km.

var mercurio_ejeM =  scale_factor*57.909;
var    venus_ejeM =  scale_factor*108.208;


// Orbits obliquity. In rads.

var mercurio_obli =  1/360*2*Math.PI*7;
var    venus_obli =  1/360*2*Math.PI*3.39;


// Orbits data: Major axis, minor axis and excentricity.

var mercurio_a = mercurio_ejeM;
var mercurio_e =0.205;
var mercurio_b = mercurio_a*Math.sqrt(1-mercurio_e*mercurio_e);
var mercurio_theta = 0;

var venus_a = venus_ejeM;
var venus_e = 0.0067;
var venus_b = venus_a*Math.sqrt(1-venus_e*venus_e);
var venus_theta = 0;


// Rotation periods (days)
var mercurio_rot = 58.64;
var venus_rot	= -243;


//Orbital periods (years)
var mercurio_per = 0.240  ;
var    venus_per = 0.615  ;

function init (){

	renderer = new THREE.WebGLRenderer();
	renderer.antialias = true;
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x000000),1.0);



	dias = 0;
	i=0;
	document.getElementById('container').appendChild(renderer.domElement);



	text2 = document.createElement('div');
	text2.style.position = 'absolute';
	text2.style.width = 180;
	text2.style.height = 40;
	text2.style.color="#00E5E5";


	text2.style.top = 40 + 'px';
	text2.style.left = 10 + 'px';
	document.body.appendChild(text2);

	//Instancia la escena
	scene = new THREE.Scene();

	var aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(/*fovy*/60, /*razon de aspecto*/aspectRatio,/*cerca*/ near,/*lejos*/far);

	// Positioning the camera
	camera.position.set(scale_factor*450,scale_factor*50,scale_factor*450);
	// Setting the point of interes
	camera.lookAt(new THREE.Vector3(0,0,0));


	// Instanciation of the camera controls
	cameraControls = new THREE.OrbitControls(camera,renderer.domElement);

	// Orbitational center
	cameraControls.target.set(0,0,0);
	cameraControls.maxDistance = far/4;

	// Register resize callback
	window.addEventListener('resize',updateAspectRatio);

	// Lighting
	var luzAmbiente = new THREE.AmbientLight( 0x404040);  // Ambient light
	scene.add(luzAmbiente)

	var luzPuntual = new THREE.PointLight(0xFFFFFF,3); // Point light (sun)
	luzPuntual.position.set(0,0,0);
	scene.add(luzPuntual);

	// Enable shadows
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;


    // Stats
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '10px';
    stats.domElement.style.left = '10px';
    document.body.appendChild(stats.domElement);



}











// Scene description
function loadScene(){



// Load the texture cube (some fancy stars)
var urls = ["textures/backgroundcube.png", "textures/backgroundcube.png",
"textures/backgroundcube.png", "textures/backgroundcube.png",
"textures/backgroundcube.png", "textures/backgroundcube.png",];

var mapaEntorno = THREE.ImageUtils.loadTextureCube(urls);
mapaEntorno.format = THREE.RGBFormat;



// Room (our universe)

var shader = THREE.ShaderLib.cube;
shader.uniforms.tCube.value = mapaEntorno;

var wallsMaterial = new THREE.ShaderMaterial({
	fragmentShader:shader.fragmentShader,
	vertexShader: shader.vertexShader,
	uniforms: shader.uniforms,
	depthWrite: false,
	side: THREE.BackSide
});

var room = new THREE.Mesh(new THREE.BoxGeometry(far,far,far),wallsMaterial);

scene.add(room);


// Load and configure textures

	// Sun
	var texSol = new THREE.ImageUtils.loadTexture("textures/sunmap.jpg");
	texSol.repeat.set(1,1);
	texSol.magFilter = THREE.LinearFilter;
	texSol.minFilter = THREE.LinearFilter;


	// Mercury
	var texMerc = new THREE.ImageUtils.loadTexture("textures/mercurymap.jpg");
	texMerc.repeat.set(1,1);
	texMerc.magFilter = THREE.LinearFilter;
	texMerc.minFilter = THREE.LinearFilter;


	// Venus
	var texVen = new THREE.ImageUtils.loadTexture("textures/venusmap.jpg");
	texVen.repeat.set(1,1);
	texVen.magFilter = THREE.LinearFilter;
	texVen.minFilter = THREE.LinearFilter;


	// Create the materials
	var materialSol		 = new THREE.MeshPhongMaterial({ ambient:0xFFF300, side: THREE.Frontside,map: texSol});
	var materialMercurio = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texMerc});
	var materialVenus 	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texVen});

	// Create the sun: Trivial approach -> Shining sprite

	geoSol = new THREE.SphereGeometry(sol_tam, 32,32 );
	sol = new THREE.Mesh(geoSol,materialSol);

	var spriteMaterial = new THREE.SpriteMaterial(
	{
		map: new THREE.ImageUtils.loadTexture( 'textures/lensflare.png' ),
		useScreenCoordinates: true,
		color: 0xFFF300, transparent: true, blending: THREE.AdditiveBlending,
		scaleByViewport:true
	});
	sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(9*sol_tam, 9*sol_tam,9*sol_tam);
	scene.add(sprite); // this centers the glow at the mesh



	// Create the planets objects


	geoMerc = new THREE.SphereGeometry(mercurio_tam, 32,32 );
	mercurio = new THREE.Mesh(geoMerc,materialMercurio);
	mercurio.position.x = mercurio_a;


	geoVen = new THREE.SphereGeometry(venus_tam, 32,32 );
	venus = new THREE.Mesh(geoVen,materialVenus);
	venus.position.x = venus_a;

	// Shadow configuration: Only between the earth and the moon (style decision)

	mercurio.receiveShadow = false;
	venus.receiveShadow = false;

	// Add the objects to the scene

	scene.add(mercurio);
	scene.add(venus);


  // Configure orbits

	// Colours
	var mercuriomat = new THREE.LineBasicMaterial({color: 0xBEBA99,}); //Gris/beige
	var    venusmat = new THREE.LineBasicMaterial({color: 0xFFF300,}); //Amarillo



	// Geometries
	var mercurio_orbit = new THREE.Geometry();
	var    venus_orbit = new THREE.Geometry();



	// Compute each orbit: Polar coordinates

	for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI/365){
		mercurio_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercurio_a*mercurio_a)+ Math.sin(theta)*Math.sin(theta)/(mercurio_b*mercurio_b))) * Math.cos(theta),
			Math.sin(mercurio_obli+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercurio_a*mercurio_a)+ Math.sin(theta)*Math.sin(theta)/(mercurio_b*mercurio_b))) * Math.sin(theta)));
	}
	for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI /365){
		venus_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venus_a*venus_a)+ Math.sin(theta)*Math.sin(theta)/(venus_b*venus_b))) * Math.cos(theta),
			Math.sin(venus_obli+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venus_a*venus_a)+ Math.sin(theta)*Math.sin(theta)/(venus_b*venus_b))) * Math.sin(theta)));
	}



	// Add the orbits to the scene
	orbitas.add(new THREE.Line(mercurio_orbit,mercuriomat));
	orbitas.add(new THREE.Line(venus_orbit,   venusmat));


	// Axis

	axisHelper = new THREE.AxisHelper(far);
	axisHelper.visible=false;
	orbitas.visible=false;

	scene.add(axisHelper);
	scene.add(orbitas);

}

var antes = Date.now();
var angulo = 0;

// Update function

function update(){



	// Camera update
	cameraControls.update();


	// Menu controllers

if(effectController.escalaTam == true){


	if (scaled != true){
		mercurio_tam	 = 1/1000*mercurio_rad;
		venus_tam 		 = 1/1000*venus_rad;


		mercurio.scale.set(1/1000,1/1000,1/1000);
		venus.scale.set(1/1000,1/1000,1/1000);
		scaled=true;
	}

} else {

	if(scaled ==true){
		mercurio_tam	 = mercurio_rad;
		venus_tam 		 = venus_rad;

		mercurio.scale.set(1,1,1);
		venus.scale.set(1,1,1);

	  scaled=false;
	}

}


	switch (effectController.seguimiento){

		case "Sun" :
		if(effectController.seguir) camera.position.set(sol.position.x + 4*sol_tam,sol.position.y+sol_tam,sol.position.z+4*sol_tam);
		camera.lookAt(sol.position);
		break;

		case "Mercury" :
		if(effectController.seguir) camera.position.set(mercurio.position.x + 4*mercurio_tam,mercurio.position.y+mercurio_tam,mercurio.position.z+4*mercurio_tam);
		camera.lookAt(mercurio.position);
		break;


		case "Venus" :
		if(effectController.seguir) camera.position.set(venus.position.x + 4*venus_tam,venus.position.y+venus_tam,mercurio.position.z+4*venus_tam);
		camera.lookAt(venus.position);
		break;

		default :

		break;


	}


	// Computation of the semi-axis of the ellipses of the orbits

	mercurio_a  	 = mercurio_ejeM;
	venus_a     	 =    venus_ejeM;

	mercurio_b = mercurio_a*Math.sqrt(1-mercurio_e*mercurio_e);
	venus_b = venus_a*Math.sqrt(1-venus_e*venus_e);


	// Translation movements

	mercurio.position.x =1 /(Math.sqrt(Math.cos(mercurio_theta)*Math.cos(mercurio_theta)/(mercurio_a*mercurio_a)+ Math.sin(mercurio_theta)*Math.sin(mercurio_theta)/(mercurio_b*mercurio_b))) * Math.cos(mercurio_theta);
	mercurio.position.z =  1 /(Math.sqrt(Math.cos(mercurio_theta)*Math.cos(mercurio_theta)/(mercurio_a*mercurio_a)+ Math.sin(mercurio_theta)*Math.sin(mercurio_theta)/(mercurio_b*mercurio_b))) * Math.sin(mercurio_theta);
    mercurio.position.y  = Math.sin(mercurio_obli+mercurio_theta);// Math.cos( vz )*c;

    venus.position.x =1 /(Math.sqrt(Math.cos(venus_theta)*Math.cos(venus_theta)/(venus_a*venus_a)+ Math.sin(venus_theta)*Math.sin(venus_theta)/(venus_b*venus_b))) * Math.cos(venus_theta);
    venus.position.z =  1 /(Math.sqrt(Math.cos(venus_theta)*Math.cos(venus_theta)/(venus_a*venus_a)+ Math.sin(venus_theta)*Math.sin(venus_theta)/(venus_b*venus_b))) * Math.sin(venus_theta);
    venus.position.y  =Math.sin(venus_obli+venus_theta);// Math.cos( vz )*c;


    var ahora = Date.now();

    // Take into account the time
    timeScale = effectController.timeScale;
    dias+=(ahora-antes)*timeScale;
    anyos=dias/365;



	// Rotation movements


	mercurio.rotation.y+=(2*Math.PI/mercurio_rot*(ahora-antes))* timeScale;
	venus.rotation.y   +=(2*Math.PI/venus_rot*(ahora-antes)	)* timeScale;


	// Translation movements
	mercurio_theta +=Math.PI*2/mercurio_per /365*timeScale*(ahora-antes);
	venus_theta    +=Math.PI*2/   venus_per /365*timeScale*(ahora-antes);


	// Stats
	stats.update();
	antes = ahora;
}

function render(){
	update();
	requestAnimationFrame(render);
	renderer.render(scene,camera);

}

function updateAspectRatio(){

	// Update aspect ratio when moving the window

	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}




function setupGui(){



	effectController = {
		mensaje: 'Controls',
		escalaTam: false,
		escalaPos: false,
		timeScale: 0.0001,
		seguimiento:'None',
		seguir : false,
		drawAxes : false,
		drawOrbits : false


	};

	var gui = new dat.GUI();
	var h = gui.addFolder("System controls");
	h.add(effectController, "mensaje").name("System controls");

	h.add(effectController, "seguimiento", ["None","Sun","Mercury", "Venus"]).name("Focus on planet").onChange(function(value){


		switch (effectController.seguimiento){

			case "Mercury" :
			camera.position.set(mercurio.position.x + 4*mercurio_tam,mercurio.position.y+mercurio_tam,mercurio.position.z+4*mercurio_tam);
			camera.lookAt(mercurio.position);
			break;

			case "Venus" :
			camera.position.set(venus.position.x + 4*venus_tam,venus.position.y+venus_tam,mercurio.position.z+4*venus_tam);
			camera.lookAt(venus.position);
			break;

		}

	});
h.add(effectController, "timeScale", 0.0000,1,0.0001).name("Time control");
h.add(effectController, "drawAxes").name("Show axis").onChange(function(value){
	if(value == true)
		axisHelper.visible=true;
	else axisHelper.visible=false;
});


h.add(effectController, "drawOrbits").name("Show orbits").onChange(function(value){
	if(effectController.drawOrbits == true)
		orbitas.visible=true;
	else 	orbitas.visible=false;
});


}

//Call all functions


init();
setupGui();
loadScene();
render();
