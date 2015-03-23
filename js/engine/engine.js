/**
 * Created by Douglas on 2/18/2015.
 */

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
}

Engine.prototype.addEvent = function(name, impacts){
    if(!(name in this.events)) {
        this.events[name] = {};
        this.appraiser.updateUserModel(this.events);
        this.updateExpectations();
        this.events[name]["Expectation"] = 0.5;
        this.events[name]["Impacts"] = impacts;
        var desirability = this.eval.eventEval(name, this.events, this.goals);
        if(isNaN(desirability)) {
            desirability = 0;
        }
        this.events[name]["Desirability"] = desirability;
    }
}

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

Engine.prototype.triggerEvent = function(name, objects) {
    this.emotionalState = this.appraiser.appraiseEvent(name, this.emotionalState, this.events, objects);
    this.emotionalState = this.filter.applyRules(this.emotionalState);
    this.updateExpectations();
}

Engine.prototype.introduceObject = function(objectName) {
    var associations = this.appraiser.associations;

    for(var emotionName in associations[objectName]) {
        if(associations[objectName].hasOwnProperty(emotionName)) {
            var value = associations[objectName][emotionName]["Total"] / associations[objectName][emotionName]["Count"];
            this.emotionalState.state[emotionName] += value;
        }
    }
}

Engine.prototype.decay = function() {
    for(var emotion in this.emotionalState.state) {
        this.emotionalState.state[emotion] = this.emotionalState.state[emotion] * this.decayConstant;
    }
}

Engine.prototype.setMotivation = function(motivation, value) {
    this.filter.setMotivation(motivation, value);
}

Engine.prototype.changeMotivation = function(motivation, change) {
    this.filter.changeMotivation(motivation, change);
}

Engine.prototype.addFilter = function(rule) {
    this.filter.addRule(rule);
}

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

Engine.prototype.triggerBehavior = function(behavior, agentName) {
    this.emotionalState = this.appraiser.appraiseBehavior(behavior, agentName, this.emotionalState, this.standards);
}

Engine.prototype.updateExpectations = function() {
    for(var eventName in this.events) {
        if(this.events.hasOwnProperty(eventName)) {
            this.events[eventName]["Expectation"] = this.appraiser.getExpectation(eventName);
        }
    }
}

function Emotions() {
    this.state = {"Joy":0,"Sad":0,"Disappointment":0,"Relief":0,"Hope":0,"Fear":0,"Pride":0,
        "Shame":0,"Reproach":0,"Admiration":0,"Anger":0, "Gratitude":0,"Gratification":0,"Remorse":0};
}