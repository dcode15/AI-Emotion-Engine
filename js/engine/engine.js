/**
 * Created by Douglas on 2/18/2015.
 */

function Engine(id){
    this.goals = {};
    this.events = {};
    this.standards = {};
    this.emotions = new Emotions();
    this.name = id;
    this.eval = new Evaluator();
    this.appraiser = new Appraiser();
}

function Emotions() {
    this.state = {"Joy":0,"Sad":0,"Disappointment":0,"Relief":0,"Hope":0,"Fear":0,"Pride":0,
    "Shame":0,"Reproach":0,"Admiration":0,"Anger":0, "Gratitude":0,"Gratification":0,"Remorse":0};
}

Engine.prototype.addEvent = function(name, impacts,  expectation){
    this.events[name] = {};
    this.events[name]["Expectation"] = expectation;
    this.events[name]["Impacts"] = impacts;
    var desirability = this.eval.eventEval(name, this.goals);
    this.events[name]["Desirability"] = desirability;
}

Engine.prototype.addGoal = function(name, importance) {
    this.goals[name] = importance;

    var desirability;
    for (var eventName in this.events) {
        if (dictionary.hasOwnProperty(key)) {
            desirability = this.eval.eventEval(eventName, this.goals);
            this.events[eventName]["Desirability"] = desirability;
        }
    }
}

Engine.prototype.triggerEvent = function(name) {
    this.emotionalState = this.appraiser.appraiseEvent(name, this.standards, this.emotionalState);
    console.log(desirability);
}