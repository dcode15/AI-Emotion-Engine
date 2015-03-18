var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({antialias:true});
//Create a plane to act as a "floor" that will let the clicked location be determined in the onClick() function
var floorPlane = new THREE.PlaneGeometry(1000,1000,1,1);
var floorMaterial = new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.DoubleSide});
var floor = new THREE.Mesh(floorPlane, floorMaterial);
//Hemisphere lighting used to light all sides of cylinders, prevents strange lighting effects
var mainLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);

var context;
var texture;
var sprite1 = makeTextSprite("Hello")
//sprite1.position.set( 0, 20, 0 );
//scene.add( sprite1 );


var gui = new dat.GUI();
var entryMode = false;
var triggerFolder;
var agentAddition;
var agentButton;
var agentsDropdown;
var eventsDropdown;
var triggerButton;
var agentsList = {};
var agentNames = [];
var eventsList = [];
var INTERSECTED;
var mouse = {x: 0, y: 0};
var event = {
    name: "",
    impacts: "",
    expectation: 0.5,
    addButton: function(){newEvent(this.name,this.impacts,this.expectation)}
};
var goal = {
    agentName: "",
    goalName: "",
    importance: 0.5,
    addButton: function(){agentsList[this.agentName]["Engine"].addGoal(this.goalName, this.importance);}
};
var agent = {
    name: "",
    addButton: function(){
        if(!(agent.name === "" || agent.name in agentsList)) {
            entryMode = true;
        }
        else{
            alert("Invalid agent name: agent name is either empty or is already in use");
        }
    }
}
var eventTrigger = {
    event: "",
    triggerButton: function() {
        for(var agentName in agentsList) {
            agentsList[agentName]["Engine"].triggerEvent(this.event);
        }
    }
}
var otherTriggers = {
    recalculateButton: function() {alert("recalculating")}
}

initGUI();
initScene();
animate();

function initGUI() {

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

    triggerFolder = gui.addFolder("Trigger Events");
    eventsDropdown = triggerFolder.add(eventTrigger, "event", eventsList).name("Event");
    triggerButton = triggerFolder.add(eventTrigger, "triggerButton").name("Trigger Event");

    var miscellaneous = gui.addFolder("Other Functions");
    miscellaneous.add(otherTriggers, "recalculateButton").name("Recalculate");
}

function initScene() {
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
    floor.name = "Floor\nHello";
    scene.add(floor);

    //Add hemisphere lighting to scene
    scene.add(mainLight);

    //Create event listener for mouse clicks, triggering onClick()
    document.addEventListener('mousedown', onClick, false);
    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onMove, false );
}

function onClick(event){

    if(entryMode === true) {
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
        agentNames.push(agent.name);
        agentsList[agent.name] = {};
        agentsList[agent.name]["Engine"] = new Engine(agent.name);
        agentsList[agent.name]["Model"] = newCylinder;
        agentsList[agent.name]["Model"].name = agent.name;
        scene.add(agentsList[agent.name]["Model"]);
        entryMode = false;
    }
}

function onMove(event){
    //sprite1.position.set( event.clientX, event.clientY - 20, 0 );
    sprite1.position.set(0, 20, 0);
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function update()
{

    // create a Ray with origin at the mouse position
    //   and direction into the scene (camera direction)
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    vector.unproject(camera);
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var intersects = ray.intersectObjects( scene.children );

    // INTERSECTED = the object in the scene currently closest to the camera
    //		and intersected by the Ray projected from the mouse position

    // if there is one (or more) intersections
    if ( intersects.length > 0 )
    {
        // if the closest object intersected is not the currently stored intersection object
        if ( intersects[0].object != INTERSECTED )
        {
            // update text, if it has a "name" field.
            if ( intersects[0].object.name )
            {
                context.clearRect(0,0,640,480);
                var message = intersects[ 0 ].object.name;
                message = message.split("\n");
                var metrics = context.measureText(message);
                var width = metrics.width;
                context.fillStyle = "rgba(0,0,0,0.95)"; // black border
                context.fillRect( 0,0, width+8,20+8);
                context.fillStyle = "rgba(255,255,255,0.95)"; // white filler
                context.fillRect( 2,2, width+4,20+4 );
                context.fillStyle = "rgba(0,0,0,1)"; // text color
                for (var i = 0; i<message.length; i++)
                    context.fillText(message[i], 5,5);
                texture.needsUpdate = true;
            }
            else
            {
                context.clearRect(0,0,300,300);
                texture.needsUpdate = true;
            }
        }
    }
    else
    {
        INTERSECTED = null;
        context.clearRect(0,0,300,300);
        texture.needsUpdate = true;
    }
}

function animate()
{
    requestAnimationFrame(animate);
    render();
    //update();
}
      
function render() {

	requestAnimationFrame(render);
	renderer.render(scene, camera);
};

function newEvent(name, impacts, expectation) {
    if(!(name === "" || name in eventsList)) {
        eventsList.push(name);
        triggerFolder.remove(eventsDropdown);
        triggerFolder.remove(triggerButton);
        eventsDropdown = triggerFolder.add(eventTrigger, "event", eventsList).name("Event");
        triggerButton = triggerFolder.add(eventTrigger, "triggerButton").name("Trigger Event");

        impacts = impacts.replace(/\s+/g, '');
        impacts = impacts.split(",");
        for(var agentName in agentsList) {
            agentsList[agentName]["Engine"].addEvent(name, impacts, expectation);
        }
    }
    else{
        alert("Invalid event name: event name is either empty or is already in use");
    }
}


//http://stackoverflow.com/questions/23514274/three-js-2d-text-sprite-labels
function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 4;
    var borderColor = parameters.hasOwnProperty("borderColor") ?parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:0, g:0, b:0, a:1.0 };

    var canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, (textWidth + borderThickness) * 1.1, fontsize * 1.4 + borderThickness, 8);

    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", 1.0)";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture, useScreenCoordinates: false } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(0.5 * fontsize, 0.25 * fontsize, 0.75 * fontsize);
    return sprite;
}

//http://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
function roundRect(ctx, x, y, w, h, r)
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}