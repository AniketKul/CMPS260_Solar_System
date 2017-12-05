/*
	CMPS260: Computer Graphics Course Project
	* Solar system Simulation using ThreeJS*

	- Orbits
	- Rotation periods
	- Translation periods
	- Planet's sizes
*/

var renderer;
var scene;
var camera;
var cameraControls;
var far=10000;
var near = 0.001;
var cam, bgScene, bgCam	;
var text2;

var sprite;

var geoSun, geoMercury, geoVenus, geoEarth, geoMoon, geoMars, geoJupiter ,geoSaturn, geoSaturnRings, geoUranus, geoUranusRings, geoNeptune;

var keyboard = new THREEx.KeyboardState();
var axisHelper;
var i;
//var dias = 0;
//var anyos = 0;
var theta = 0;
// var tamScale = 1;
// var posScale = 1;
var timeScale = 1;
var positions;

var orbits = new THREE.Object3D();
var scale_factor = 0.1;
var scaled = false;

var sun = new THREE.Object3D();
var mercury;
var venus;
var earth;
var mars;
var jupiter;
var saturn;
var saturnRings;
var uranus;
var neptune;

// Radious: Thousands of km

var 	 sun_rad 	 = scale_factor * 1392/100;
var mercury_rad	 = scale_factor * 2.49;
var    venus_rad 	 = scale_factor * 6;
var   earth_rad 	 = scale_factor * 6.3;
var     moon_rad 	 = scale_factor * 1.7;
var    mars_rad 	 = scale_factor * 3.38;
var  jupiter_rad 	 = scale_factor * 69.9;
var  saturn_rad	 = scale_factor * 58.2;
var satRings_rad_max = scale_factor * (58.2 + 120);
var satRings_rad_min = scale_factor * (58.2 + 6.63);
var    uranus_rad 	 = scale_factor * 25.3;
var uraRings_rad_max = scale_factor * (25.3 + 98);
var uraRings_rad_min = scale_factor * (25.3 + 38);
var  neptune_rad 	 = scale_factor * 24.62;

var 	 sun_tam 	 = sun_rad;
var mercury_tam	 = mercury_rad;
var    venus_tam 	 = venus_rad;
var   earth_tam 	 = earth_rad;
var     moon_tam 	 = moon_rad;
var    mars_tam 	 = mars_rad;
var  jupiter_tam 	 = jupiter_rad;
var  saturn_tam	 = saturn_rad;
var satRings_tam_max = satRings_rad_max;
var satRings_tam_min = satRings_rad_min;
var    uranus_tam 	 = uranus_rad;
var uraRings_tam_max = uraRings_rad_max;
var uraRings_tam_min = uraRings_rad_min;
var  neptune_tam 	 = neptune_rad;

// Major axis == Distance to the sun (in thousand of kms).

var mercury_dist_from_sun =  scale_factor * 57.909;
var    venus_dist_from_sun =  scale_factor * 108.208;
var   earth_dist_from_sun =  scale_factor * 149.597;
var     moon_dist_from_sun =  scale_factor * 10.384399;
var    mars_dist_from_sun =  scale_factor * 227.936;
var  jupiter_dist_from_sun =  scale_factor * 778.412;
var  saturn_dist_from_sun =  scale_factor * 1426.725;
var    uranus_dist_from_sun =  scale_factor * 2870.972;
var  neptune_dist_from_sun =  scale_factor * 4498.252;

// Orbits obliquity. In rads.

var mercury_orbit_angle =  1/360 * 2 * Math.PI * 7;
var    venus_orbit_angle =  1/360 * 2 * Math.PI * 3.39;
var   earth_orbit_angle =  1/360 * 2 * Math.PI *0;
var     moon_orbit_angle =  1/360 * 2 * Math.PI * 5.14;
var    mars_orbit_angle =  1/360 * 2 * Math.PI * 1.85;
var  jupiter_orbit_angle =  1/360 * 2 * Math.PI * 1.305;
var  saturn_orbit_angle =  1/360 * 2 * Math.PI * 2.48;
var    uranus_orbit_angle =  1/360 * 2 * Math.PI * 0.769;
var  neptune_orbit_angle =  1/360 * 2 * Math.PI * 1.769;

// Orbits data: Major axis, minor axis and excentricity.

var mercury_a = mercury_dist_from_sun;
var mercury_e = 0.205;
var mercury_b = mercury_a * Math.sqrt(1-mercury_e * mercury_e);
var mercury_theta = 0;

var venus_a = venus_dist_from_sun;
var venus_e = 0.0067;
var venus_b = venus_a * Math.sqrt(1 - venus_e * venus_e);
var venus_theta = 0;

var earth_a = earth_dist_from_sun;
var earth_e = 0.0167;
var earth_b = earth_a * Math.sqrt(1 - earth_e * earth_e);
var earth_theta = 0;


var moon_a = moon_dist_from_sun;
var moon_e = 0.0549;
var moon_b = moon_a * Math.sqrt(1 - moon_e * moon_e);
var moon_theta = 0;

var mars_a = mars_dist_from_sun;
var mars_e = 0.093;
var mars_b = mars_a * Math.sqrt(1 - mars_e * mars_e);
var mars_theta = 0;

var jupiter_a = jupiter_dist_from_sun;
var jupiter_e = 0.0483;
var jupiter_b = jupiter_a * Math.sqrt(1 - jupiter_e * jupiter_e);
var jupiter_theta = 0;


var saturn_a = saturn_dist_from_sun;
var saturn_e = 0.0541;
var saturn_b = saturn_a * Math.sqrt(1 - saturn_e * saturn_e);
var saturn_theta = 0;

var uranus_a = uranus_dist_from_sun;
var uranus_e = 0.0471;
var uranus_b = uranus_a * Math.sqrt(1 - uranus_e * uranus_e);
var uranus_theta = 0;


var neptune_a = neptune_dist_from_sun;
var neptune_e = 0.0085;
var neptune_b = neptune_a * Math.sqrt(1 - neptune_e * neptune_e);
var neptune_theta = 0;

// Rotation periods (days)
var mercury_rot = 58.64;
var venus_rot	= -243;
var earth_rot	= 0.99;
var moon_rot	= 0.3781;
var mars_rot	= 1.025;
var jupiter_rot	= 0.413;
var saturn_rot	= 0.444;
var uranus_rot	= -0.718;
var neptune_rot	= 0.671;


//Orbital periods (years)
var mercury_per = 0.240;
var venus_per = 0.615;
var earth_per = 1;
var moon_per = 0.074;
var mars_per = 1.88;
var jupiter_per = 11.86;
var saturn_per = 29.447;
var uranus_per = 84.016;
var neptune_per = 64.7913;


function init (){

	renderer = new THREE.WebGLRenderer();
	renderer.antialias = true;
	renderer.setSize(window.innerWidth,window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x000000),1.0);

	//dias = 0;
	i=0;
	document.getElementById('container').appendChild(renderer.domElement);

	text2 = document.createElement('div');
	text2.style.position = 'absunute';
	text2.style.width = 180;
	text2.style.height = 40;
	text2.style.color="#00E5E5";


	text2.style.top = 40 + 'px';
	text2.style.left = 10 + 'px';
	document.body.appendChild(text2);

	scene = new THREE.Scene();

	var aspectRatio = window.innerWidth/window.innerHeight;
	camera = new THREE.PerspectiveCamera(60, aspectRatio, near, far);

	// Positioning the camera
	camera.position.set(scale_factor*450,scale_factor*50,scale_factor*450);
	// Setting the lookat point
	camera.lookAt(new THREE.Vector3(0,0,0));

	cameraControls = new THREE.OrbitControls(camera,renderer.domElement);

	// Orbitational Center
	cameraControls.target.set(0,0,0);
	cameraControls.maxDistance = far/4;

	window.addEventListener('resize',updateAspectRatio);

	// Lighting
	// Ambient light
	var ambient_light = new THREE.AmbientLight( 0x404040);
	scene.add(ambient_light)

	// Point light (sun)
	var point_light = new THREE.PointLight(0xFFFFFF,3);
	point_light.position.set(0,0,0);
	scene.add(point_light);

	// Shadows
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;


    // Stats
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absunute';
    stats.domElement.style.bottom = '10px';
    stats.domElement.style.left = '10px';
    document.body.appendChild(stats.domElement);

}


// Loading the whole scene
function loadScene(){

// Load the texture cube (some fancy stars)
var urls = ["textures/backgroundcube.png", "textures/backgroundcube.png",
"textures/backgroundcube.png", "textures/backgroundcube.png",
"textures/backgroundcube.png", "textures/backgroundcube.png",];

var texture_cube = THREE.ImageUtils.loadTextureCube(urls);
texture_cube.format = THREE.RGBFormat;

// Creating the universe

var shader = THREE.ShaderLib.cube;
shader.uniforms.tCube.value = texture_cube;

var universeMaterial = new THREE.ShaderMaterial({
	fragmentShader:shader.fragmentShader,
	vertexShader: shader.vertexShader,
	uniforms: shader.uniforms,
	depthWrite: false,
	side: THREE.BackSide
});

var universe = new THREE.Mesh(new THREE.BoxGeometry(far,far,far),universeMaterial);

scene.add(universe);


// Load and configure textures

	// Sun
	var texture_sun = new THREE.ImageUtils.loadTexture("textures/sunmap.jpg");
	texture_sun.repeat.set(1,1);
	texture_sun.magFilter = THREE.LinearFilter;
	texture_sun.minFilter = THREE.LinearFilter;


	// Mercury
	var texture_mercury = new THREE.ImageUtils.loadTexture("textures/mercurymap.jpg");
	texture_mercury.repeat.set(1,1);
	texture_mercury.magFilter = THREE.LinearFilter;
	texture_mercury.minFilter = THREE.LinearFilter;


	// Venus
	var texture_venus = new THREE.ImageUtils.loadTexture("textures/venusmap.jpg");
	texture_venus.repeat.set(1,1);
	texture_venus.magFilter = THREE.LinearFilter;
	texture_venus.minFilter = THREE.LinearFilter;



	// Earth
	var texture_earth = new THREE.ImageUtils.loadTexture("textures/earthmap1k.jpg");
	texture_earth.repeat.set(1,1);
	texture_earth.magFilter = THREE.LinearFilter;
	texture_earth.minFilter = THREE.LinearFilter;



	//Moon
	var texture_moon = new THREE.ImageUtils.loadTexture("textures/moonmap1k.jpg");
	texture_moon.repeat.set(1,1);
	texture_moon.magFilter = THREE.LinearFilter;
	texture_moon.minFilter = THREE.LinearFilter;



	// Mars
	var texture_mars = new THREE.ImageUtils.loadTexture("textures/marsmap1k.jpg");
	texture_mars.repeat.set(1,1);
	texture_mars.magFilter = THREE.LinearFilter;
	texture_mars.minFilter = THREE.LinearFilter;



	// Jupiter
	var texture_jupiter= new THREE.ImageUtils.loadTexture("textures/jupitermap.jpg");
	texture_jupiter.repeat.set(1,1);
	texture_jupiter.magFilter = THREE.LinearFilter;
	texture_jupiter.minFilter = THREE.LinearFilter;



	// Saturn
	var texture_saturn = new THREE.ImageUtils.loadTexture("textures/saturnmap.jpg");
	texture_saturn.repeat.set(1,1);
	texture_saturn.magFilter = THREE.LinearFilter;
	texture_saturn.minFilter = THREE.LinearFilter;


	// Saturn rings
	var texture_saturnRings = new THREE.ImageUtils.loadTexture("textures/saturnringcolor.jpg");
	texture_saturnRings.repeat.set(1,1);
	texture_saturnRings.magFilter = THREE.LinearFilter;
	texture_saturnRings.minFilter = THREE.LinearFilter;

	var texture_saturnRingsAlpha = THREE.ImageUtils.loadTexture( "textures/saturnringpatternrot.gif" );
	texture_saturnRingsAlpha.repeat.set(1,1);
	texture_saturnRingsAlpha.magFilter = THREE.LinearFilter; //Píxel menor que texel
	texture_saturnRingsAlpha.minFilter = THREE.LinearFilter; //Texel menor que píxel

	// Uranus
	var texture_uranus = new THREE.ImageUtils.loadTexture("textures/uranusmap.jpg");
	texture_uranus.repeat.set(1,1);
	texture_uranus.magFilter = THREE.LinearFilter;
	texture_uranus.minFilter = THREE.LinearFilter;


	// Uranus rings
	var texture_uranusRings = new THREE.ImageUtils.loadTexture("textures/uranusringcolour.jpg");
	texture_uranusRings.repeat.set(1,1);
	texture_uranusRings.magFilter = THREE.LinearFilter;
	texture_uranusRings.minFilter = THREE.LinearFilter;


	var texture_uranusRingsAlpha = THREE.ImageUtils.loadTexture( "textures/uranusringtrans.gif" );
	texture_uranusRingsAlpha.repeat.set(1,1);
	texture_uranusRingsAlpha.magFilter = THREE.LinearFilter;
	texture_uranusRingsAlpha.minFilter = THREE.LinearFilter;


	// Neptune
	var texture_neptune = new THREE.ImageUtils.loadTexture("textures/neptunemap.jpg");
	texture_neptune.repeat.set(1,1);
	texture_neptune.magFilter = THREE.LinearFilter;
	texture_neptune.minFilter = THREE.LinearFilter;

	// Create the materials
	var materialsun		 = new THREE.MeshPhongMaterial({ ambient:0xFFF300, side: THREE.Frontside,map: texture_sun});
	var materialmercury = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texture_mercury});
	var materialVenus 	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texture_venus});
	var materialearth	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texture_earth});
	var materialmoon 	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texture_moon});
	var materialmars 	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texture_mars});
	var materialJupiter	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF,  side: THREE.BothSides,  map: texture_jupiter});
	var materialsaturn	 = new THREE.MeshLambertMaterial({side: THREE.Frontside,ambient:0xFFFFFF, map: texture_saturn});

	var materialsaturnRings = new THREE.MeshLambertMaterial({
		ambient					: 0xFFFFFF,
		transparent     : true,
		alphaTest       : 0.05,
		shininess       : 100,
		opacity         : 1,
		shading         : THREE.SmoothShading ,
		map 						: texture_saturnRings,
		alphaMap        : texture_saturnRingsAlpha,
	});

	var materialuranus	 = new THREE.MeshLambertMaterial({ambient: 0xFFFFFF, map: texture_uranus});

	var materialuranusRings = new THREE.MeshLambertMaterial({
		ambient: 0xFFFFFF,
		transparent     : true,
		alphaTest       : 0.05,
		shininess       : 100,
		opacity         : 0.5,
		shading         : THREE.SmoothShading,
		map 						: texture_uranusRings,
		alphaMap        : texture_uranusRingsAlpha
	});

	materialuranusRings.side= THREE.DoubleSide;
	var materialneptune	 = new THREE.MeshLambertMaterial({ambient:0xFFFFFF, map: texture_neptune});

	// Create the sun: Shining sprite using spriteMaterial

	geoSun = new THREE.SphereGeometry(sun_tam, 32,32 );
	sun = new THREE.Mesh(geoSun,materialsun);

	var spriteMaterial = new THREE.SpriteMaterial(
	{
		map: new THREE.ImageUtils.loadTexture( 'textures/lensflare.png' ),
		useScreenCoordinates: true,
		color: 0xFFF300, transparent: true, blending: THREE.AdditiveBlending,
		scaleByViewport:true
	});

	sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(9*sun_tam, 9*sun_tam,9*sun_tam);
	scene.add(sprite); // this centers the glow at the mesh

	// Create the planets objects

	geoMercury = new THREE.SphereGeometry(mercury_tam, 32,32 );
	mercury = new THREE.Mesh(geoMercury,materialmercury);
	mercury.position.x = mercury_a;


	geoVenus = new THREE.SphereGeometry(venus_tam, 32,32 );
	venus = new THREE.Mesh(geoVenus,materialVenus);
	venus.position.x = venus_a;


	geoEarth = new THREE.SphereGeometry(earth_tam, 32,32 );
	earth = new THREE.Mesh(geoEarth,materialearth);
	earth.position.x = earth_a;

	geoMoon = new THREE.SphereGeometry(moon_tam, 32,32 );
	moon = new THREE.Mesh(geoMoon,materialmoon);
	moon.position.x = earth_a +moon_a;

	geoMars = new THREE.SphereGeometry(mars_tam, 32,32 );
	mars = new THREE.Mesh(geoMars,materialmars);
	mars.position.x = mars_a;


	geoJupiter = new THREE.SphereGeometry(jupiter_tam, 32,32 );
	jupiter = new THREE.Mesh(geoJupiter,materialJupiter);
	jupiter.position.x = jupiter_a;

	geoSaturn= new THREE.SphereGeometry(saturn_tam, 32,32 );
	saturn = new THREE.Mesh(geoSaturn,materialsaturn);
	saturn.position.x = saturn_a;
	saturn.position.z = saturn_a;

	var geoSaturnRings =  new THREE.TorusGeometry(satRings_tam_max , satRings_tam_min, 2, 70 );
	saturnRings = new THREE.Mesh(geoSaturnRings,materialsaturnRings);
	saturnRings.position.x = saturn_a;
	saturnRings.rotation.x = Math.PI/2.2;

	geoUranus = new THREE.SphereGeometry(uranus_tam, 32,32 );
	uranus = new THREE.Mesh(geoUranus,materialuranus);
	uranus.position.x = uranus_a;

	geoUranusRings =  new THREE.TorusGeometry(uraRings_tam_max , uraRings_tam_min, 2, 70 );
	uranusRings = new THREE.Mesh(geoUranusRings,materialuranusRings);
	uranusRings.position.x =uranus_a;


	geoNeptune= new THREE.SphereGeometry(neptune_tam, 32,32 );
	neptune = new THREE.Mesh(geoNeptune,materialneptune);
	neptune.position.x = neptune_a;


	// Shadow configuration: Only between the earth and the moon (style decision)

	mercury.receiveShadow = false;
	venus.receiveShadow = false;
	earth.receiveShadow = true;
	moon.receiveShadow = true;
	mars.receiveShadow = false;
	jupiter.receiveShadow = false;
	saturn.receiveShadow = false;
	saturnRings.receiveShadow = false;
	uranus.receiveShadow = false;
	uranusRings.receiveShadow = false;
	neptune.receiveShadow = false;
	mercury.castShadow = false;
	venus.castShadow = false;
	earth.castShadow = true;
	moon.castShadow = true;
	mars.castShadow = false;
	jupiter.castShadow = false;
	saturn.castShadow = false;
	saturnRings.castShadow = false;
	uranus.castShadow = false;
	uranusRings.castShadow = false;
	neptune.castShadow = false;

	// Add the objects to the scene

	scene.add(mercury);
	scene.add(venus);
	scene.add(earth);
	scene.add(moon);
	scene.add(mars);
	scene.add(jupiter);
	scene.add(saturn);
	scene.add(saturnRings);
	scene.add(uranus);
	scene.add(uranusRings);
	scene.add(neptune);

	// Earth and Moon shadows

	var earth_light = new THREE.SpotLight(0xAA0000,1);
	earth_light.position.set(0,0,0);
	earth_light.target = earth;
	earth_light.angle = Math.PI/2;
	earth_light.shadowCameraNear = 0.1;
	earth_light.shadowCameraFar = 500;
	//earth_light.shadowCameraVisible = true;
	earth_light.castShadow = true;
	earth_light.shadowMapWidth = 1024;
	earth_light.shadowMapHeight = 1024 	;
	earth_light.shadowDarkness = 0.7;

	var moon_light = new THREE.SpotLight(0xAA0000,1);
	moon_light.position.set(0,0,0);
	moon_light.target = moon;
	moon_light.angle = Math.PI/2;
	moon_light.shadowCameraNear = 0.1;
	moon_light.shadowCameraFar = 500;
	//moon_light.shadowCameraVisible = true;
	moon_light.castShadow = true;
	moon_light.shadowMapWidth = 1024;
	moon_light.shadowMapHeight = 1024 	;
	moon_light.shadowDarkness = 0.7;

	scene.add(earth_light);
	scene.add(moon_light);

  // Creating orbits

	// Colours
	var mercurymat = new THREE.LineBasicMaterial({color: 0xBEBA99,});
	var    venusmat = new THREE.LineBasicMaterial({color: 0xFFF300,});
	var   earthmat = new THREE.LineBasicMaterial({color: 0x15FF00,});
	var    marsmat = new THREE.LineBasicMaterial({color: 0xFF0000,});
	var  jupitermat = new THREE.LineBasicMaterial({color: 0xFF9A00,});
	var  saturnmat = new THREE.LineBasicMaterial({color: 0xF0D1A1,});
	var    uranusmat = new THREE.LineBasicMaterial({color: 0x060F69,});
	var  neptunemat = new THREE.LineBasicMaterial({color: 0x30BBFF,});


	// Creating Geometries
	var mercury_orbit = new THREE.Geometry();
	var    venus_orbit = new THREE.Geometry();
	var   earth_orbit = new THREE.Geometry();
	var     moon_orbit = new THREE.Geometry();
	var    mars_orbit = new THREE.Geometry();
	var  jupiter_orbit = new THREE.Geometry();
	var  saturn_orbit = new THREE.Geometry();
	var    uranus_orbit = new THREE.Geometry();
	var  neptune_orbit = new THREE.Geometry();


	// Compute each orbit: Polar coordinates

	for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI/365) {
		mercury_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercury_a*mercury_a)+ Math.sin(theta)*Math.sin(theta)/(mercury_b*mercury_b))) * Math.cos(theta),
			Math.sin(mercury_orbit_angle+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mercury_a*mercury_a)+ Math.sin(theta)*Math.sin(theta)/(mercury_b*mercury_b))) * Math.sin(theta)));
	}

	for(var theta = 0;  theta <= 2*Math.PI;  theta+=Math.PI /365) {
		venus_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venus_a*venus_a)+ Math.sin(theta)*Math.sin(theta)/(venus_b*venus_b))) * Math.cos(theta),
			Math.sin(venus_orbit_angle+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(venus_a*venus_a)+ Math.sin(theta)*Math.sin(theta)/(venus_b*venus_b))) * Math.sin(theta)));
	}

	for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI /365) {
		earth_orbit.vertices.push(new THREE.Vector3( 1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(earth_a*earth_a)+ Math.sin(theta)*Math.sin(theta)/(earth_b*earth_b))) * Math.cos(theta),
			Math.sin(earth_orbit_angle+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(earth_a*earth_a)+ Math.sin(theta)*Math.sin(theta)/(earth_b*earth_b))) * Math.sin(theta)));
	}

	for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365) {
		mars_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mars_a*mars_a)+ Math.sin(theta)*Math.sin(theta)/(mars_b*mars_b))) * Math.cos(theta),
			Math.sin(theta+mars_orbit_angle),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(mars_a*mars_a)+ Math.sin(theta)*Math.sin(theta)/(mars_b*mars_b))) * Math.sin(theta)));
	}

	for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365) {
		jupiter_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(jupiter_a*jupiter_a)+ Math.sin(theta)*Math.sin(theta)/(jupiter_b*jupiter_b))) * Math.cos(theta),
			Math.sin(jupiter_orbit_angle+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(jupiter_a*jupiter_a)+ Math.sin(theta)*Math.sin(theta)/(jupiter_b*jupiter_b))) * Math.sin(theta)));
	}

	for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365) {
		saturn_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(saturn_a*saturn_a)+ Math.sin(theta)*Math.sin(theta)/(saturn_b*saturn_b))) * Math.cos(theta),
			Math.sin(saturn_orbit_angle+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(saturn_a*saturn_a)+ Math.sin(theta)*Math.sin(theta)/(saturn_b*saturn_b))) * Math.sin(theta)));
	}

	for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI/365) {
		uranus_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(uranus_a*uranus_a)+ Math.sin(theta)*Math.sin(theta)/(uranus_b*uranus_b))) * Math.cos(theta),
			Math.sin(uranus_orbit_angle+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(uranus_a*uranus_a)+ Math.sin(theta)*Math.sin(theta)/(uranus_b*uranus_b))) * Math.sin(theta)));
	}

	for(var theta = 0;  theta < 2*Math.PI;  theta+=Math.PI /365) {
		neptune_orbit.vertices.push(new THREE.Vector3(1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(neptune_a*neptune_a)+ Math.sin(theta)*Math.sin(theta)/(neptune_b*neptune_b))) * Math.cos(theta),
			Math.sin(neptune_orbit_angle+theta),
			1 /(Math.sqrt(Math.cos(theta)*Math.cos(theta)/(neptune_a*neptune_a)+ Math.sin(theta)*Math.sin(theta)/(neptune_b*neptune_b))) * Math.sin(theta)));
	}

	// Add the orbits to the scene

	orbits.add(new THREE.Line(mercury_orbit,mercurymat));
	orbits.add(new THREE.Line(venus_orbit,   venusmat));
	orbits.add(new THREE.Line(earth_orbit,  earthmat));
	orbits.add(new THREE.Line(mars_orbit,   marsmat));
	orbits.add(new THREE.Line(jupiter_orbit, jupitermat));
	orbits.add(new THREE.Line(saturn_orbit, saturnmat));
	orbits.add(new THREE.Line(uranus_orbit,   uranusmat));
	orbits.add(new THREE.Line(neptune_orbit, neptunemat));

	// Creating Axis

	axisHelper = new THREE.AxisHelper(far);
	axisHelper.visible=false;
	orbits.visible=false;

	scene.add(axisHelper);
	scene.add(orbits);

}

var prev_date = Date.now();
//var angulo = 0;

// Update function

function update(){

cameraControls.update();

// Dat.GUI controllers

if(effectController.escalaTam == true){


	if (scaled != true) {

		mercury_tam	 = 1/1000*mercury_rad;
		venus_tam 		 = 1/1000*venus_rad;
		earth_tam 		 = 1/1000*earth_rad;
		moon_tam 		 = 1/1000*moon_rad;
		mars_tam 		 = 1/1000*mars_rad;
		jupiter_tam 	 = 1/1000*jupiter_rad;
		saturn_tam		 = 1/1000*saturn_rad;
		satRings_tam_max = 1/1000*satRings_rad_max;
		satRings_tam_min = 1/1000*satRings_rad_min;
		uranus_tam 		 = 1/1000*uranus_rad;
		uraRings_tam_max = 1/1000*uraRings_rad_max;
		uraRings_tam_min = 1/1000*uraRings_rad_min;
		neptune_tam 	 = 1/1000*neptune_rad;

		mercury.scale.set(1/1000,1/1000,1/1000);
		venus.scale.set(1/1000,1/1000,1/1000);
		earth.scale.set(1/1000,1/1000,1/1000);
		moon.scale.set(1/1000,1/1000,1/1000);
		mars.scale.set(1/1000,1/1000,1/1000);
		jupiter.scale.set(1/1000,1/1000,1/1000);
		saturn.scale.set(1/1000,1/1000,1/1000);
		saturnRings.scale.set(1/1000,1/1000,1/1000);
		uranus.scale.set(1/1000,1/1000,1/1000);
		uranusRings.scale.set(1/1000,1/1000,1/1000);
		neptune.scale.set(1/1000,1/1000,1/1000);

		scaled=true;
	}
}

else{

	if(scaled ==true){
		mercury_tam	 = mercury_rad;
		venus_tam 		 = venus_rad;
		earth_tam 		 = earth_rad;
		moon_tam 		 = moon_rad;
		mars_tam 		 = mars_rad;
		jupiter_tam 	 = jupiter_rad;
		saturn_tam		 = saturn_rad;
		satRings_tam_max = satRings_rad_max;
		satRings_tam_min = satRings_rad_min;
		uranus_tam 		 = uranus_rad;
		uraRings_tam_max = uraRings_rad_max;
		uraRings_tam_min = uraRings_rad_min;
		neptune_tam 	 = neptune_rad;

		mercury.scale.set(1,1,1);
		venus.scale.set(1,1,1);
		earth.scale.set(1,1,1);
		moon.scale.set(1,1,1);
		mars.scale.set(1,1,1);
		jupiter.scale.set(1,1,1);
		saturn.scale.set(1,1,1);
		saturnRings.scale.set(1,1,1);
		uranus.scale.set(1,1,1);
		uranusRings.scale.set(1,1,1);
		neptune.scale.set(1,1,1);

	  scaled=false;
	}

}


	switch (effectController.planet_list){

		case "Sun" :
		if(effectController.seguir) camera.position.set(sun.position.x + 4*sun_tam,sun.position.y+sun_tam,sun.position.z+4*sun_tam);
		camera.lookAt(sun.position);
		break;

		case "Mercury" :
		if(effectController.seguir) camera.position.set(mercury.position.x + 4*mercury_tam,mercury.position.y+mercury_tam,mercury.position.z+4*mercury_tam);
		camera.lookAt(mercury.position);
		break;


		case "Venus" :
		if(effectController.seguir) camera.position.set(venus.position.x + 4*venus_tam,venus.position.y+venus_tam,mercury.position.z+4*venus_tam);
		camera.lookAt(venus.position);
		break;


		case "Earth" :
		if(effectController.seguir) camera.position.set(earth.position.x + 4*earth_tam,earth.position.y+earth_tam,earth.position.z+4*earth_tam);
		camera.lookAt(earth.position);
		break;
		case "Moon" :
		if(effectController.seguir) camera.position.set(moon.position.x + 4*moon_tam,moon.position.y+moon_tam,moon.position.z+4*moon_tam);
		camera.lookAt(moon.position);
		break;
		case "Mars" :
		if(effectController.seguir) camera.position.set(mars.position.x + 4*mars_tam,mars.position.y+mars_tam,mars.position.z+4*mars_tam);
		camera.lookAt(mars.position);
		break;
		case "Jupiter" :
		if(effectController.seguir) camera.position.set(jupiter.position.x + 4*jupiter_tam,jupiter.position.y+jupiter_tam,jupiter.position.z+4*jupiter_tam);
		camera.lookAt(jupiter.position);
		break;

		case "Saturn" :
		if(effectController.seguir) camera.position.set(saturn.position.x + 4*saturn_tam,saturn.position.y+saturn_tam,saturn.position.z+4*saturn_tam);
		camera.lookAt(saturn.position);
		break;

		case "Uranus" :
		if(effectController.seguir) camera.position.set(uranus.position.x + 20*uranus_tam,uranus.position.y+uranus_tam,uranus.position.z+20*uranus_tam);
		camera.lookAt(uranus.position);
		break;

		case "Neptune" :
		if(effectController.seguir) camera.position.set(neptune.position.x + 4*neptune_tam,neptune.position.y,neptune.position.z+4*neptune_tam);
		camera.lookAt(neptune.position);
		break;
		default :

		break;


	}


	// Computation of the semi-axis of the ellipses of the orbits

	mercury_a  	 = mercury_dist_from_sun;
	venus_a     	 =    venus_dist_from_sun;
	earth_a 		 =   earth_dist_from_sun;
	moon_a 			 =     moon_dist_from_sun;
	mars_a   		 =    mars_dist_from_sun;
	jupiter_a 		 =  jupiter_dist_from_sun;
	saturn_a 		 =  saturn_dist_from_sun;
	neptune_a 		 =  neptune_dist_from_sun;
	uranus_a 	 	 =    uranus_dist_from_sun;


	mercury_b = mercury_a*Math.sqrt(1-mercury_e*mercury_e);
	venus_b = venus_a*Math.sqrt(1-venus_e*venus_e);
	earth_b = earth_a*Math.sqrt(1-earth_e*earth_e);
	moon_b = moon_a*Math.sqrt(1-moon_e*moon_e);
	mars_b = mars_a*Math.sqrt(1-mars_e*mars_e);
	jupiter_b = jupiter_a*Math.sqrt(1-jupiter_e*jupiter_e);
	saturn_b = saturn_a*Math.sqrt(1-saturn_e*saturn_e);
	neptune_b = neptune_a*Math.sqrt(1-neptune_e*neptune_e);
	uranus_b = uranus_a*Math.sqrt(1-uranus_e*uranus_e);



	// Translation movements

	mercury.position.x =1 /(Math.sqrt(Math.cos(mercury_theta)*Math.cos(mercury_theta)/(mercury_a*mercury_a)+ Math.sin(mercury_theta)*Math.sin(mercury_theta)/(mercury_b*mercury_b))) * Math.cos(mercury_theta);
	mercury.position.z =  1 /(Math.sqrt(Math.cos(mercury_theta)*Math.cos(mercury_theta)/(mercury_a*mercury_a)+ Math.sin(mercury_theta)*Math.sin(mercury_theta)/(mercury_b*mercury_b))) * Math.sin(mercury_theta);
  mercury.position.y  = Math.sin(mercury_orbit_angle+mercury_theta);

	venus.position.x =1 /(Math.sqrt(Math.cos(venus_theta)*Math.cos(venus_theta)/(venus_a*venus_a)+ Math.sin(venus_theta)*Math.sin(venus_theta)/(venus_b*venus_b))) * Math.cos(venus_theta);
  venus.position.z =  1 /(Math.sqrt(Math.cos(venus_theta)*Math.cos(venus_theta)/(venus_a*venus_a)+ Math.sin(venus_theta)*Math.sin(venus_theta)/(venus_b*venus_b))) * Math.sin(venus_theta);
  venus.position.y  =Math.sin(venus_orbit_angle+venus_theta);

  earth.position.x =1 /(Math.sqrt(Math.cos(earth_theta)*Math.cos(earth_theta)/(earth_a*earth_a)+ Math.sin(earth_theta)*Math.sin(earth_theta)/(earth_b*earth_b))) * Math.cos(earth_theta);
  earth.position.z =  1 /(Math.sqrt(Math.cos(earth_theta)*Math.cos(earth_theta)/(earth_a*earth_a)+ Math.sin(earth_theta)*Math.sin(earth_theta)/(earth_b*earth_b))) * Math.sin(earth_theta);
  earth.position.y  =Math.sin(earth_orbit_angle+earth_theta);

  moon.position.x =earth.position.x + 1 /(Math.sqrt(Math.cos(moon_theta)*Math.cos(moon_theta)/(moon_a*moon_a)+ Math.sin(moon_theta)*Math.sin(moon_theta)/(moon_b*moon_b))) * Math.cos(moon_theta);
  moon.position.z =  earth.position.z + 1 /(Math.sqrt(Math.cos(moon_theta)*Math.cos(moon_theta)/(moon_a*moon_a)+ Math.sin(moon_theta)*Math.sin(moon_theta)/(moon_b*moon_b))) * Math.sin(moon_theta);
  moon.position.y  = earth.position.y + Math.sin(moon_orbit_angle+moon_theta);

  mars.position.x =1 /(Math.sqrt(Math.cos(mars_theta)*Math.cos(mars_theta)/(mars_a*mars_a)+ Math.sin(mars_theta)*Math.sin(mars_theta)/(mars_b*mars_b))) * Math.cos(mars_theta);
  mars.position.z =  1 /(Math.sqrt(Math.cos(mars_theta)*Math.cos(mars_theta)/(mars_a*mars_a)+ Math.sin(mars_theta)*Math.sin(mars_theta)/(mars_b*mars_b))) * Math.sin(mars_theta);
  mars.position.y  = Math.sin(mars_orbit_angle+mars_theta);

  jupiter.position.x =1 /(Math.sqrt(Math.cos(jupiter_theta)*Math.cos(jupiter_theta)/(jupiter_a*jupiter_a)+ Math.sin(jupiter_theta)*Math.sin(jupiter_theta)/(jupiter_b*jupiter_b))) * Math.cos(jupiter_theta);
  jupiter.position.z =  1 /(Math.sqrt(Math.cos(jupiter_theta)*Math.cos(jupiter_theta)/(jupiter_a*jupiter_a)+ Math.sin(jupiter_theta)*Math.sin(jupiter_theta)/(jupiter_b*jupiter_b))) * Math.sin(jupiter_theta);
  jupiter.position.y  = Math.sin(jupiter_orbit_angle+jupiter_theta);

  saturn.position.x =1 /(Math.sqrt(Math.cos(saturn_theta)*Math.cos(saturn_theta)/(saturn_a*saturn_a)+ Math.sin(saturn_theta)*Math.sin(saturn_theta)/(saturn_b*saturn_b))) * Math.cos(saturn_theta);
  saturn.position.z =  1 /(Math.sqrt(Math.cos(saturn_theta)*Math.cos(saturn_theta)/(saturn_a*saturn_a)+ Math.sin(saturn_theta)*Math.sin(saturn_theta)/(saturn_b*saturn_b))) * Math.sin(saturn_theta);
  saturn.position.y  = Math.sin(saturn_orbit_angle+saturn_theta);

  saturnRings.position.x =saturn.position.x;
  saturnRings.position.y =saturn.position.y;
  saturnRings.position.z =saturn.position.z;


  uranusRings.position.x =uranus.position.x;
  uranusRings.position.y =uranus.position.y;
  uranusRings.position.z =uranus.position.z;

  uranus.position.x =1 /(Math.sqrt(Math.cos(uranus_theta)*Math.cos(uranus_theta)/(uranus_a*uranus_a)+ Math.sin(uranus_theta)*Math.sin(uranus_theta)/(uranus_b*uranus_b))) * Math.cos(uranus_theta);
  uranus.position.z =  1 /(Math.sqrt(Math.cos(uranus_theta)*Math.cos(uranus_theta)/(uranus_a*uranus_a)+ Math.sin(uranus_theta)*Math.sin(uranus_theta)/(uranus_b*uranus_b))) * Math.sin(uranus_theta);
  uranus.position.y  = Math.sin(uranus_orbit_angle+uranus_theta);


  neptune.position.x =1 /(Math.sqrt(Math.cos(neptune_theta)*Math.cos(neptune_theta)/(neptune_a*neptune_a)+ Math.sin(neptune_theta)*Math.sin(neptune_theta)/(neptune_b*neptune_b))) * Math.cos(neptune_theta);
  neptune.position.z =  1 /(Math.sqrt(Math.cos(neptune_theta)*Math.cos(neptune_theta)/(neptune_a*neptune_a)+ Math.sin(neptune_theta)*Math.sin(neptune_theta)/(neptune_b*neptune_b))) * Math.sin(neptune_theta);
  neptune.position.y  = Math.sin(neptune_orbit_angle+neptune_theta);


    var current_date = Date.now();

    // Take into account the time
    timeScale = effectController.timeScale;
    //dias+=(current_date-prev_date)*timeScale;
    //anyos=dias/365;



	// Rotation movements

	mercury.rotation.y+=(2*Math.PI/mercury_rot*(current_date-prev_date))* timeScale;
	venus.rotation.y   +=(2*Math.PI/venus_rot*(current_date-prev_date)	)* timeScale;
	earth.rotation.y  +=(2*Math.PI/earth_rot*(current_date-prev_date))* timeScale;
	moon.rotation.y    +=(2*Math.PI/moon_rot*(current_date-prev_date)	)* timeScale;
	mars.rotation.y   +=(2*Math.PI/mars_rot*(current_date-prev_date)	)* timeScale;
	jupiter.rotation.y +=(2*Math.PI/jupiter_rot*(current_date-prev_date))* timeScale;
	saturn.rotation.y +=(2*Math.PI/saturn_rot*(current_date-prev_date))* timeScale;
	uranus.rotation.y   +=(2*Math.PI/uranus_rot*(current_date-prev_date)	)* timeScale;
	neptune.rotation.y +=(2*Math.PI/neptune_rot*(current_date-prev_date))* timeScale;


	// Translation movements
	mercury_theta +=Math.PI*2/mercury_per /365*timeScale*(current_date-prev_date);
	venus_theta    +=Math.PI*2/   venus_per /365*timeScale*(current_date-prev_date);
	earth_theta   +=Math.PI*2/  earth_per /365*timeScale*(current_date-prev_date);
	moon_theta     +=  Math.PI*2/    moon_per /365*timeScale*(current_date-prev_date);
	mars_theta    +=Math.PI*2/   mars_per /365*timeScale*(current_date-prev_date);
	jupiter_theta  +=Math.PI*2/ jupiter_per /365*timeScale*(current_date-prev_date);
	saturn_theta  +=Math.PI*2/ saturn_per /365*timeScale*(current_date-prev_date);
	uranus_theta  +=Math.PI*2/   uranus_per /365*timeScale*(current_date-prev_date);
	neptune_theta    +=Math.PI*2/ neptune_per /365*timeScale*(current_date-prev_date);

	// Stats
	stats.update();
	prev_date = current_date;
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
		//mensaje: 'Controls',
		//escalaTam: false,
		//escalaPos: false,
		timeScale: 0.0001,
		planet_list:'None',
		//seguir : false,
		drawAxes : false,
		drawOrbits : false
	};

	var gui = new dat.GUI();
	var h = gui.addFolder("Dat.GUI Options");
	//h.add(effectController, "mensaje").name("System controls");
	//h.add(effectController, "escalaTam").name("Real-scaled planets");
	//h.add(effectController, "seguir").name("Follow planet");
	h.add(effectController, "planet_list", ["None","Sun","Mercury", "Venus", "Earth", "Moon", "Mars", "Jupiter","Saturn","Uranus","Neptune"]).name("Focus on planet").onChange(function(value){


		switch (effectController.planet_list){

			case "Mercury" :
			camera.position.set(mercury.position.x + 4*mercury_tam,mercury.position.y+mercury_tam,mercury.position.z+4*mercury_tam);
			camera.lookAt(mercury.position);
			break;

			case "Venus" :
			camera.position.set(venus.position.x + 4*venus_tam,venus.position.y+venus_tam,mercury.position.z+4*venus_tam);
			camera.lookAt(venus.position);
			break;

			case "Earth" :
			camera.position.set(earth.position.x + 4*earth_tam,earth.position.y+earth_tam,earth.position.z+4*earth_tam);
			camera.lookAt(earth.position);
			break;

			case "Moon" :
			camera.position.set(moon.position.x + 4*moon_tam,moon.position.y+moon_tam,moon.position.z+4*moon_tam);
			camera.lookAt(moon.position);
			break;

			case "Mars" :
			camera.position.set(mars.position.x + 4*mars_tam,mars.position.y+mars_tam,mars.position.z+4*mars_tam);
			camera.lookAt(mars.position);
			break;

			case "Jupiter" :
			camera.position.set(jupiter.position.x + 4*jupiter_tam,jupiter.position.y+jupiter_tam,jupiter.position.z+4*jupiter_tam);
			camera.lookAt(jupiter.position);
			break;

			case "Saturn" :
			camera.position.set(saturn.position.x + 4*saturn_tam,saturn.position.y+saturn_tam,saturn.position.z+4*saturn_tam);
			camera.lookAt(saturn.position);
			break;

			case "Uranus" :
			camera.position.set(uranus.position.x + 20*uranus_tam,uranus.position.y+uranus_tam,uranus.position.z+20*uranus_tam);
			camera.lookAt(uranus.position);
			break;

			case "Neptune" :
			camera.position.set(neptune.position.x + 4*neptune_tam,neptune.position.y,neptune.position.z+4*neptune_tam);
			camera.lookAt(neptune.position);
			break;

			case "Sun" :
			camera.position.set(scale_factor*450,scale_factor*50,scale_factor*450);
			camera.lookAt(0,0,0);
			break;

		}

	});

	h.add(effectController, "timeScale", 0.0000,1,0.0001).name("Time control");
	h.add(effectController, "drawAxes").name("Show axis").onChange(function(value){

	if(value == true)
			axisHelper.visible=true;
	else
			axisHelper.visible=false;

});


	h.add(effectController, "drawOrbits").name("Show orbits").onChange(function(value){

	if(effectController.drawOrbits == true)
			orbits.visible=true;
	else
			orbits.visible=false;


});


}

init();
setupGui();
loadScene();
render();
