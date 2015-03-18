/**
 * Created by Douglas on 2/18/2015.
 */

function Engine(id){
    this.goals = {};
    this.events = {};
    this.standards = {};
    this.emotionalState = new Emotions();
    this.name = id;
    this.eval = new Evaluator();
    this.appraiser = new Appraiser(id);
    this.standards = {};
}

Engine.prototype.addEvent = function(name, impacts,  expectation){
    this.events[name] = {};
    this.events[name]["Expectation"] = expectation;
    this.events[name]["Impacts"] = impacts;
    var desirability = this.eval.eventEval(name, this.events, this.goals);
    this.events[name]["Desirability"] = desirability;
    console.log(this.events);
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
    console.log(name);
    console.log(this.events);
    this.emotionalState = this.appraiser.appraiseEvent(name, this.emotionalState, this.events);
    console.log(this.emotionalState);
}

function Emotions() {
    this.state = {"Joy":0,"Sad":0,"Disappointment":0,"Relief":0,"Hope":0,"Fear":0,"Pride":0,
        "Shame":0,"Reproach":0,"Admiration":0,"Anger":0, "Gratitude":0,"Gratification":0,"Remorse":0};
}