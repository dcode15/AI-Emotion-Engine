function Evaluator(goals) {
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

    this.fuzzy = new FuzzySystem([impactVar, importanceVar],[desirabilityVar], rules);
    this.goals = goals;
}

Evaluator.prototype.eventEval = function(name, goals) {
    var totalDesirability = 0;
    var affectedGoals = 0;


    for(var impactNum = 0; impactNum<this.events[name]["Impacts"].length; impactNum++){
        var impactGoal = this.events[name]["Impacts"][impactNum][0];

        if(impactGoal in goals){
            var impact = this.events["Impacts"][impactNum][1];
            totalDesirability += this.fuzzy.processValue([impact, goals[impactGoal]])["Desirability"];
            affectedGoals++;
        }
    }

    return totalDesirability/affectedGoals;
}