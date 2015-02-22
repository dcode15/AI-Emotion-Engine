var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias:true});
//Create a plane to act as a "floor" that will let the clicked location be determined in the onClick() function
var floorPlane = new THREE.PlaneGeometry(1000,1000,1,1);
var floorMaterial = new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.DoubleSide});
var floor = new THREE.Mesh(floorPlane, floorMaterial);
//Hemisphere lighting used to light all sides of cylinders, prevents strange lighting effects
var mainLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
var gui = new dat.GUI();
var objects = [];

var parameters = {
    color : "#ff0000",
    mode : 'Add'
};

init();
render();

function init() {

    //Set up GUI controls
    gui.addColor(parameters, 'color');
    gui.add(parameters, 'mode', [ 'Add', 'Remove' ] );

    //Set camera location and orient towards origin
    camera.position.set(0,40,0);
    camera.lookAt(new THREE.Vector3(0,0,0));
    
    //Size and add renderer to HTML document
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    //Orient floor to be perpendicular to cylinder height and
    //  add the floor to the scene
    floor.position.y = -0.1;
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);
    
    //Add hemisphere lighting to scene
    scene.add(mainLight);
    
    //Create event listener for mouse clicks, triggering onClick()
    document.addEventListener('mousedown', onClick, false);
    window.addEventListener( 'resize', onWindowResize, false );
}

function onClick( event ) {
    
    var mouse = {x: 0, y: 0};
    //Just a coordinate system conversion
    mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	
    //Create ray and check where it intersects the floor plane
    var mouseVector = new THREE.Vector3(mouse.x, mouse.y, 1);
	mouseVector.unproject(camera);
	var ray = new THREE.Raycaster(camera.position, mouseVector.sub(camera.position).normalize());
	
    //Location variable holds the point at which the ray intersected the floor
    
    if(parameters.mode === 'Add') {
        var intersect = ray.intersectObject(floor);
        var location = intersect[0].point;
        console.log(location);
    
        //Create new cylinder to be added to the scene
        if(!(location.x < (-18) && location.z < (-60))){ 
            var geometry = new THREE.CylinderGeometry(1,1,4,40);
            var material = new THREE.MeshLambertMaterial({color: parameters.color});
            var newCylinder = new THREE.Mesh(geometry, material);
            scene.add(newCylinder);
            objects.push(newCylinder);
            //console.log(objects);
    
            //Place cylinder at the location where the ray intersected  the floor
            newCylinder.position.set(location.x, 0, location.z);
        }
    }
    else if(parameters.mode === 'Remove') {
        var intersects = ray.intersectObjects(objects);
        if ( intersects.length > 0 ) {
            var cylinder = intersects[0].object;
            scene.remove(cylinder);
            //console.log(objects);
        }
    }
}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
      
function render() {

	requestAnimationFrame(render);
	renderer.render(scene, camera);
};