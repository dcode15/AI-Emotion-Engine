//Engine class constructor
//id is the individual's name (string)
//decayConstant is a decimal between 0 and 1 representing the
//amount emotions should decay at each time step
function Engine(id, decayConstant){
    this.goals = {};
    this.events = {};
    this.standards = {};
    this.emotionalState = new Emotions();
    this.name = id;
    this.eval = new Evaluator();
    this.appraiser = new Appraiser(id);
    this.filter = new Filter();
    this.decayConstant = decayConstant;
    this.addEvent("empty", []);
}


//Add event to individual
//name is the event name (string)
//impacts is a list of event-goal impacts of the form ["event1", 0.3, "event2", -0.15]
//impacts should range from -1 to 1
Engine.prototype.addEvent = function(name, impacts){
    if(!(name in this.events)) {
        this.events[name] = {};
        this.appraiser.updateUserModel(this.events);
        this.updateExpectations();
        this.events[name]["Expectation"] = 0.3;
        this.events[name]["Impacts"] = impacts;
        var desirability = this.eval.eventEval(name, this.events, this.goals);
        if(isNaN(desirability)) {
            desirability = 0;
        }
        this.events[name]["Desirability"] = desirability;
    }
}


//Add goal to individual
//name is the goal's name (string)
//importance is a decimal between 0 and 1 representing the
//importance of the goal to the individual
Engine.prototype.addGoal = function(name, importance) {
    this.goals[name] = importance;

    var desirability;
    for (var eventName in this.events) {
        if (this.events.hasOwnProperty(eventName)) {
            desirability = this.eval.eventEval(eventName, this.events, this.goals);
            this.events[eventName]["Desirability"] = desirability;
        }
    }
}


//Make the individual experience an event
//name is the name of the experienced event
//objects is a list of strings representing associated objects
Engine.prototype.triggerEvent = function(name, objects) {
    this.emotionalState = this.appraiser.appraiseEvent(name, this.emotionalState, this.events, objects);
    this.emotionalState = this.filter.applyRules(this.emotionalState);
    this.updateExpectations();
}


//Expose individual to an object
//objectName is the name of the exposed object (string)
Engine.prototype.introduceObject = function(objectName) {
    var associations = this.appraiser.associations;

    for(var emotionName in associations[objectName]) {
        if(associations[objectName].hasOwnProperty(emotionName)) {
            var value = associations[objectName][emotionName]["Total"] / associations[objectName][emotionName]["Count"];
            this.emotionalState.state[emotionName] += value;
        }
    }
}


//Decay the individual's emotions
Engine.prototype.decay = function() {
    for(var emotion in this.emotionalState.state) {
        this.emotionalState.state[emotion] = this.emotionalState.state[emotion] * this.decayConstant;
    }
}


//Set the intensity of a motivational state
//motivation is the name of the motivation (string)
//value is the new numerical intensity of the motivation
Engine.prototype.setMotivation = function(motivation, value) {
    this.filter.setMotivation(motivation, value);
    this.triggerEvent("empty", []);
}


//Set the intensity of a motivational state relatively
//motivation is the name of the motivation (string)
//change is the amount to add to the current state intensity
Engine.prototype.changeMotivation = function(motivation, change) {
    this.filter.changeMotivation(motivation, change);
    this.triggerEvent("empty", []);
}


//Add a new filtering rule (string)
Engine.prototype.addFilter = function(rule) {
    this.filter.addRule(rule);
    this.triggerEvent("empty", []);
}


//Provide social feedback
//behavior is the name of the behavior (string)
//feedback is a positive or negative decimal representing the nature
//and intensity of the feedback
Engine.prototype.provideFeedback = function(behavior, feedback) {
    if(behavior in this.standards) {
        this.standards[behavior]["Overall"] += feedback;
        this.standards[behavior]["Count"]++;
    }
    else {
        this.standards[behavior] = {};
        this.standards[behavior]["Overall"] = feedback;
        this.standards[behavior]["Count"] = 1;
    }
}


//Have the agent or another individual execute a behavior
//behavior is the name of the behavior (string)
//agentName is the name of the actor of the behavior (string)
Engine.prototype.triggerBehavior = function(behavior, agentName) {
    this.emotionalState = this.appraiser.appraiseBehavior(behavior, agentName, this.emotionalState, this.standards);
}


//Recalculate expectations based on new experiences
Engine.prototype.updateExpectations = function() {
    for(var eventName in this.events) {
        if(this.events.hasOwnProperty(eventName)) {
            this.events[eventName]["Expectation"] = this.appraiser.getExpectation(eventName);
        }
    }
}


//Get method for emotional state
Engine.prototype.getEmotions = function() {
    return this.emotionalState.state;
}


//Constructor for emotional state
function Emotions() {
    this.state = {"Joy":0,"Sad":0,"Disappointment":0,"Relief":0,"Hope":0,"Fear":0,"Pride":0,
        "Shame":0,"Reproach":0,"Admiration":0,"Anger":0, "Gratitude":0,"Gratification":0,"Remorse":0};
}