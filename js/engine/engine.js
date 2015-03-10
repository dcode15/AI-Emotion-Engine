/**
 * Created by Douglas on 2/18/2015.
 */

function Engine(){
    this.goals = {};
}

function Event(impacts, cause, associations) {
    this.impacts = impacts;
    this.cause = cause;
    this.associations = associations;
}

Engine.prototype.addGoal = function(name, importance) {
    this.goals[name] = importance;
}

Engine.prototype.triggerEvent = function(Event) {
    desirability = this.eventEval(Event);
    console.log(desirability);
}

Engine.prototype.eventEval = function(event) {
    var impactVar = new FuzzyVar("Impact", ["HighlyNegative", "SlightlyNegative", "NoImpact", "SlightlyPositive", "HighlyPositive"],
        [[-1,-1,-0.2], [-0.8,-0.4,0], [-0.25,0,0.25], [0,0.4,0.8], [0.2,1,1]]);
    var importanceVar = new FuzzyVar("Importance", ["NotImportant", "SlightlyImportant", "ExtremelyImportant"],
        [[0,0,0.5], [0.2,0.5,0.8], [0.5,1,1]]);
    var desirabilityVar = new FuzzyVar("Desirability", ["HighlyUndesired", "SlightlyUndesired", "Neutral", "SlightlyDesired", "HighlyDesired"],
        [[-1,-1,-0.6], [-0.7,-0.4,-0.1], [-0.3,0,0.3], [0.1,0.4,0.7], [0.6,1,1]]);
    var rules = ["Impact HighlyNegative AND Importance NotImportant THEN Desirability Neutral",
        "Impact SlightlyNegative AND Importance NotImportant THEN Desirability Neutral",
        "Impact NoImpact AND Importance NotImportant THEN Desirability Neutral",
        "Impact SlightlyPositive AND Importance NotImportant THEN Desirability Neutral",
        "Impact HighlyPositive AND Importance NotImportant THEN Desirability Neutral",
        "Impact HighlyNegative AND Importance SlightlyImportant THEN Desirability SlightlyUndesired",
        "Impact SlightlyNegative AND Importance SlightlyImportant THEN Desirability SlightlyUndesired",
        "Impact NoImpact AND Importance SlightlyImportant THEN Desirability Neutral",
        "Impact SlightlyPositive AND Importance SlightlyImportant THEN Desirability SlightlyUndesired",
        "Impact HighlyPositive AND Importance SlightlyImportant THEN Desirability SlightlyUndesired",
        "Impact HighlyNegative AND Importance ExtremelyImportant THEN Desirability HighlyUndesired",
        "Impact SlightlyNegative AND Importance ExtremelyImportant THEN Desirability SlightlyUndesired",
        "Impact NoImpact AND Importance ExtremelyImportant THEN Desirability Neutral",
        "Impact SlightlyPositive AND Importance ExtremelyImportant THEN Desirability SlightlyDesired",
        "Impact HighlyPositive AND Importance ExtremelyImportant THEN Desirability HighlyDesired"];

    var fuzzy = new FuzzySystem([impactVar, importanceVar],[desirabilityVar], rules);
    var totalDesirability = 0;
    var affectedGoals = 0;


    for(var impactNum = 0; impactNum<event.impacts.length; impactNum++){
        var impactGoal = event.impacts[impactNum][0];

        if(impactGoal in this.goals){
            var impact = event.impacts[impactNum][1];
            console.log(impact);
            console.log(this.goals[impactGoal]);
            console.log(fuzzy.processValue([impact, this.goals[impactGoal]])["Desirability"]);
            totalDesirability += fuzzy.processValue([impact, this.goals[impactGoal]])["Desirability"];
            affectedGoals++;
        }
    }

    return totalDesirability/affectedGoals;
}