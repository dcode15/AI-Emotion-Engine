/**
 * Created by Douglas on 2/18/2015.
 */

function Engine(goals){
    this.goals = goals;
}

function Event(impact, importance, cause, associations) {
    this.impact = impact;
    this.cause = cause;
    this.associations = items;
}

Engine.prototype.triggerEvent = function(Event) {

    desirability = this.eventEval(Event);
}

Engine.prototype.eventEval = function(Event) {
    var impactVar = new FuzzyVar("Impact", ["HighlyNegative", "SlightlyNegative", "NoImpact", "SlightlyPositive", "HighlyPositive"],
        [[-1.5,-1,-0.6], [-0.7,-0.4,-0.1], [-0.3,0,0.3], [0.1,0.4,0.7], [0.6,1,1.5]]);
    var importanceVar = new FuzzyVar("Importance", ["NotImportant", "SlightlyImportant", "ExtremelyImportant"],
        [[-0.5,0,0.4], [0.3,0.5,0.7], [0.6,1,1.5]]);
    var desirabilityVar = new FuzzyVar("Desirability", ["HighlyUndesired", "SlightlyUndesired", "Neutral", "SlightlyDesired", "HighlyDesired"],
        [[-1.5,-1,-0.6], [-0.7,-0.4,-0.1], [-0.3,0,0.3], [0.1,0.4,0.7], [0.6,1,1.5]]);
    var rules = [["Impact","HighlyNegative","AND","Importance","NotImportant","THEN","Desirability","Neutral"],
        ["Impact","SlightlyNegative","AND","Importance","NotImportant","THEN","Desirability","Neutral"],
        ["Impact","NoImpact","AND","Importance","NotImportant","THEN","Desirability","Neutral"],
        ["Impact","SlightlyPositive","AND","Importance","NotImportant","THEN","Desirability","Neutral"],
        ["Impact","HighlyPositive","AND","Importance","NotImportant","THEN","Desirability","Neutral"],
        ["Impact","HighlyNegative","AND","Importance","SlightlyImportant","THEN","Desirability","SlightlyUndesired"],
        ["Impact","SlightlyNegative","AND","Importance","SlightlyImportant","THEN","Desirability","SlightlyUndesired"],
        ["Impact","NoImpact","AND","Importance","SlightlyImportant","THEN","Desirability","Neutral"],
        ["Impact","SlightlyPositive","AND","Importance","SlightlyImportant","THEN","Desirability","SlightlyUndesired"],
        ["Impact","HighlyPositive","AND","Importance","SlightlyImportant","THEN","Desirability","SlightlyUndesired"],
        ["Impact","HighlyNegative","AND","Importance","ExtremelyImportant","THEN","Desirability","HighlyUndesired"],
        ["Impact","SlightlyNegative","AND","Importance","ExtremelyImportant","THEN","Desirability","SlightlyUndesired"],
        ["Impact","NoImpact","AND","Importance","ExtremelyImportant","THEN","Desirability","Neutral"],
        ["Impact","SlightlyPositive","AND","Importance","ExtremelyImportant","THEN","Desirability","SlightlyDesired"],
        ["Impact","HighlyPositive","AND","Importance","ExtremelyImportant","THEN","Desirability","HighlyDesired"]];

    var fuzzy = new FuzzySystem([impactVar, importanceVar],[desirabilityVar], rules);

    //fuzzy.processValue([-0.65,0.65]);
}