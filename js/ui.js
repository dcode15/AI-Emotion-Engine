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
var entryMode = false;
var agentsList = {};
var event = {
    name: "",
    impacts: "",
    expectation: 0.5,
    addButton: function(){ console.log("eventClicked") }
};
var goal = {
    agentName: "",
    goalName: "",
    importance: 0.5,
    addButton: function(){ console.log("goalClicked") }
};
var agent = {
    name: "",
    addButton: function(){ entryMode = true;}
}

init();
render();

function init() {

    //Set up GUI controls
    var agentAddition = gui.addFolder("Add Agent");
    agentAddition.add(agent, "name").name("Name");
    agentAddition.add(agent, "addButton").name("Add Agent");

    var eventAddition = gui.addFolder('Add Event');
    eventAddition.add(event, "name").name("Name");
    eventAddition.add(event, "impacts").name("Goal Impacts");
    eventAddition.add(event, "expectation").min(0).max(1).step(.01).name("Expectation");
    eventAddition.add(event, "addButton").name("Add Event");

    var goalAddition = gui.addFolder('Add Goal');
    goalAddition.add(goal, "agentName").name("Agent Name");
    goalAddition.add(goal, "goalName").name("Goal Name");
    goalAddition.add(goal, "importance").min(0).max(1).step(.01).name("Importance");
    goalAddition.add(goal, "addButton").name("Add Goal");

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

function onClick(event) {

    if(entryMode === true) {
        if(!(agent.name === "" || agent.name in agentsList)) {
            var mouse = {x: 0, y: 0};
            //Just a coordinate system conversion
            mouse.x = (event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            //Create ray and check where it intersects the floor plane
            var mouseVector = new THREE.Vector3(mouse.x, mouse.y, 1);
            mouseVector.unproject(camera);
            var ray = new THREE.Raycaster(camera.position, mouseVector.sub(camera.position).normalize());

            //Location variable holds the point at which the ray intersected the floor
            var intersect = ray.intersectObject(floor);
            var location = intersect[0].point;

            var geometry = new THREE.CylinderGeometry(1, 1, 4, 40);
            var material = new THREE.MeshLambertMaterial({color: 0xcc0000});
            var newCylinder = new THREE.Mesh(geometry, material);

            //Place cylinder at the location where the ray intersected  the floor
            newCylinder.position.set(location.x, 0, location.z);
            agentsList[agent.name] = {};
            agentsList[agent.name]["Engine"] = new Engine(agent.name);
            agentsList[agent.name]["Model"] = newCylinder;
            scene.add(agentsList[agent.name]["Model"]);
            entryMode = false;
        }
        else{
            alert("Invalid agent name: agent name is either empty or is already in use");
            entryMode = false;
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