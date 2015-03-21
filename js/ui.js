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
var goalAddition;
var agentDropdown;
var goalField;
var importanceSlider;
var addGoalButton;
var motivationFolder;
var motivationAgent;
var motivationName;
var motivationValue;
var setMotivation;
var motivationRule;
var addMotivationRule;
var triggerFolder;
var eventsDropdown;
var trigger;
var agentsList = {};
var agentNames = [" "];
var eventsList = [" "];
var mouse = {x: 0, y: 0};
var event = {
    name: "",
    impacts: "",
    expectation: 0.5,
    addButton: function(){newEvent(this.name,this.impacts,this.expectation)}
};
var goal = {
    agentName: " ",
    goalName: "",
    importance: 0.5,
    addButton: function() {
        if (this.agentName !== " ") {
            agentsList[this.agentName]["Engine"].addGoal(this.goalName, this.importance);
        }
        else {
            alert("Please select an agent");
        }
    }
};
var agent = {
    name: "",
    addButton: function(){
        if(!(agent.name === "" || agent.name in agentsList)) {
            newAgent(this.name);
        }
        else{
            alert("Invalid agent name: agent name is either empty or is already in use");
        }
    }
}
var eventTrigger = {
    eventName: " ",
    triggerButton: function() {
        for(var agentName in agentsList) {
            agentsList[agentName]["Engine"].triggerEvent(this.eventName);
        }
        updateColors();
    }
}
var motivations = {
    name: " ",
    motivation: "",
    value: 0,
    setMotivationButton: function() {},
    rule: "",
    addRuleButton: function() {}
}
var otherTriggers = {
    recalculateButton: function() {alert("recalculating")}
}

initGUI();
initScene();
render();

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

    goalAddition = gui.addFolder('Add Goal');
    agentDropdown = goalAddition.add(goal, "agentName", agentNames).name("Agent Name");
    goalField = goalAddition.add(goal, "goalName").name("Goal Name");
    importanceSlider = goalAddition.add(goal, "importance").min(0).max(1).step(.01).name("Importance");
    addGoalButton = goalAddition.add(goal, "addButton").name("Add Goal");

    triggerFolder = gui.addFolder("Trigger Events");
    eventsDropdown = triggerFolder.add(eventTrigger, "eventName", eventsList).name("Event");
    trigger = triggerFolder.add(eventTrigger, "triggerButton").name("Trigger Event");

    motivationFolder = gui.addFolder('Motivations');
    motivationAgent = motivationFolder.add(motivations, "name", agentNames).name("Agent Name");
    motivationName = motivationFolder.add(motivations, "motivation").name("Motivation Name");
    motivationValue = motivationFolder.add(motivations, "value").name("Motivation Value");
    setMotivation = motivationFolder.add(motivations, "setMotivationButton").name("Set Motivation");
    motivationRule = motivationFolder.add(motivations, "rule").name("Inhibition Rule");
    addMotivationRule = motivationFolder.add(motivations, "addRuleButton").name("Add Rule");

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
        agentsList[agent.name] = {};
        agentsList[agent.name]["Engine"] = new Engine(agent.name, 0.4);
        agentsList[agent.name]["Model"] = newCylinder;
        agentsList[agent.name]["Model"].name = agent.name;
        scene.add(agentsList[agent.name]["Model"]);
        entryMode = false;
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

function newAgent(name) {
    entryMode = true;
    agentNames.push(name);

    goalAddition.remove(agentDropdown);
    goalAddition.remove(goalField);
    goalAddition.remove(importanceSlider);
    goalAddition.remove(addGoalButton);

    agentDropdown = goalAddition.add(goal, "agentName", agentNames).name("Agent Name");
    goalField = goalAddition.add(goal, "goalName").name("Goal Name");
    importanceSlider = goalAddition.add(goal, "importance").min(0).max(1).step(.01).name("Importance");
    addGoalButton = goalAddition.add(goal, "addButton").name("Add Goal");

    motivationFolder.remove(motivationAgent);
    motivationFolder.remove(motivationName);
    motivationFolder.remove(motivationValue);
    motivationFolder.remove(setMotivation);
    motivationFolder.remove(motivationRule);
    motivationFolder.remove(addMotivationRule);

    motivationAgent = motivationFolder.add(motivations, "name", agentNames).name("Agent Name");
    motivationName = motivationFolder.add(motivations, "motivation").name("Motivation Name");
    motivationValue = motivationFolder.add(motivations, "value").name("Motivation Value");
    setMotivation = motivationFolder.add(motivations, "setMotivationButton").name("Set Motivation");
    motivationRule = motivationFolder.add(motivations, "rule").name("Inhibition Rule");
    addMotivationRule = motivationFolder.add(motivations, "addRuleButton").name("Add Rule");
}

function newEvent(name, impacts, expectation) {
    if(!(name === " " || name in eventsList)) {
        eventsList.push(name);
        triggerFolder.remove(eventsDropdown);
        triggerFolder.remove(trigger);
        eventsDropdown = triggerFolder.add(eventTrigger, "eventName", eventsList).name("Event");
        trigger = triggerFolder.add(eventTrigger, "triggerButton").name("Trigger Event");

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

function updateColors() {
    for(var agentName in agentsList) {
        var color = calculateColor(agentsList[agentName]["Engine"].emotionalState);
        agentsList[agentName]["Model"].material.color.set(color);
    }
}

function calculateColor(emotions) {
    var totalR = 0;
    var totalG = 0;
    var totalB = 0;
    var totalColors = 0;
    var colors = {"Joy":"#8f7700","Sad":"#05008f","Disappointment":"#00458F","Relief":"#8F008C","Hope":"#8F002B","Fear":"#5A8F00","Pride":"#8F3E00",
        "Shame":"#008f6b","Reproach":"#8F2D00","Admiration":"#58008F","Anger":"#8F0000", "Gratitude":"#00648F","Gratification":"#078F00","Remorse":"#4A008F"};

    console.log(emotions);
    for(var emotion in emotions.state) {
        if(emotions.state[emotion] > 0) {
            var color = colors[emotion];
            color = shadeColor(color, emotions.state[emotion]*20);
            totalR += color[0];
            totalG += color[1];
            totalB += color[2];
            totalColors++;
        }
    }

    var avgR = Math.round(totalR/totalColors);
    var avgG = Math.round(totalG/totalColors);
    var avgB = Math.round(totalB/totalColors);
    var colorString = "rgb(" + avgR.toString() + "," + avgG.toString() + "," + avgB.toString() + ")";
    var color = new THREE.Color(colorString);

    return color;
}

//Modified from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    return [R, G, B];
}