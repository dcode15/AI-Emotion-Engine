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

Engine.prototype.addEvent = function(name, impacts,  expectation){
    this.events[name] = {};
    this.events[name]["Expectation"] = expectation;
    this.events[name]["Impacts"] = impacts;
    var desirability = this.eval.eventEval(name, this.events, this.goals);
    this.events[name]["Desirability"] = desirability;
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

Engine.prototype.triggerEvent = function(name) {
    this.emotionalState = this.appraiser.appraiseEvent(name, this.emotionalState, this.events);
    this.emotionalState = this.filter.applyRules(this.emotionalState);
    console.log(this.emotionalState);
}

Engine.prototype.decay = function() {
    for(var emotion in this.emotionalState.state) {
        this.emotionalState.state[emotion] = this.emotionalState.state[emotion] * this.decayConstant;
    }
}

Engine.prototype.setMotivation = function(motivation, value) {
    this.filter.setMotivation(motivation, value);
}

Engine.prototype.addFilter = function(rule) {
    this.filter.addRule(rule);
}

function Emotions() {
    this.state = {"Joy":0,"Sad":0,"Disappointment":0,"Relief":0,"Hope":0,"Fear":0,"Pride":0,
        "Shame":0,"Reproach":0,"Admiration":0,"Anger":0, "Gratitude":0,"Gratification":0,"Remorse":0};
}