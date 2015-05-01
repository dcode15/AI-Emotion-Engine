
//Constructor for Evaluator class
//Fuzzy logic sets and rules for event evaluation are defined here
function Evaluator() {
    var impactVar = new FuzzyVar("Impact", ["HighlyNegative", "SlightlyNegative", "NoImpact", "SlightlyPositive", "HighlyPositive"],
        [[-1.8,-1,-0.2], [-0.8,-0.4,0], [-0.25,0,0.25], [0,0.4,0.8], [0.2,1,1.8]]);
    var importanceVar = new FuzzyVar("Importance", ["NotImportant", "SlightlyImportant", "ExtremelyImportant"],
        [[-0.5,0,0.7], [0.2,0.5,0.8], [0.3,1,1.5]]);
    var desirabilityVar = new FuzzyVar("Desirability", ["HighlyUndesired", "SlightlyUndesired", "Neutral", "SlightlyDesired", "HighlyDesired"],
        [[-1.4,-1,-0.6], [-0.7,-0.4,-0.1], [-0.3,0,0.3], [0.1,0.4,0.7], [0.6,1,1.4]]);
    var rules = ["Impact HighlyNegative AND Importance NotImportant THEN Desirability Neutral",
        "Impact SlightlyNegative AND Importance NotImportant THEN Desirability Neutral",
        "Impact NoImpact AND Importance NotImportant THEN Desirability Neutral",
        "Impact SlightlyPositive AND Importance NotImportant THEN Desirability Neutral",
        "Impact HighlyPositive AND Importance NotImportant THEN Desirability Neutral",
        "Impact HighlyNegative AND Importance SlightlyImportant THEN Desirability SlightlyUndesired",
        "Impact SlightlyNegative AND Importance SlightlyImportant THEN Desirability SlightlyUndesired",
        "Impact NoImpact AND Importance SlightlyImportant THEN Desirability Neutral",
        "Impact SlightlyPositive AND Importance SlightlyImportant THEN Desirability SlightlyDesired",
        "Impact HighlyPositive AND Importance SlightlyImportant THEN Desirability SlightlyDesired",
        "Impact HighlyNegative AND Importance ExtremelyImportant THEN Desirability HighlyUndesired",
        "Impact SlightlyNegative AND Importance ExtremelyImportant THEN Desirability SlightlyUndesired",
        "Impact NoImpact AND Importance ExtremelyImportant THEN Desirability Neutral",
        "Impact SlightlyPositive AND Importance ExtremelyImportant THEN Desirability SlightlyDesired",
        "Impact HighlyPositive AND Importance ExtremelyImportant THEN Desirability HighlyDesired"];

    this.fuzzy = new FuzzySystem([impactVar, importanceVar],[desirabilityVar], rules);
}


//Evaluates desirability of an event
//name is the name of the event (string)
//events is a dictionary of all events known by the agent
//goals is a dictionary of all of the agent's goals
//returns a decimal between 0 and 1 representing event desirability
Evaluator.prototype.eventEval = function(name, events, goals) {
    var totalDesirability = 0;
    var affectedGoals = 0;
    var currentIndex = 0;


    while(currentIndex < events[name]["Impacts"].length){
        var impactGoal = events[name]["Impacts"][currentIndex];
        currentIndex++;

        if(impactGoal in goals){
            var impact = events[name]["Impacts"][currentIndex];
            totalDesirability += this.fuzzy.processValue([impact, goals[impactGoal]])["Desirability"];
            affectedGoals++;
        }
        currentIndex++;
    }

    return totalDesirability/affectedGoals;
}