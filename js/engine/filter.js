
//Constructor for Filter class
function Filter() {
    this.motivations = {};
    this.rules = [];
}


//Add filtering rule to system
//rule is a string representing the logic rule
//Ex.: "Hunger > 30 THEN Joy"
Filter.prototype.addRule = function(rule){
    this.rules.push(rule.split(" "));
}


//Set the intensity of a motivational state
//motivation is the name of the motivation (string)
//value is the new numerical intensity of the motivation
Filter.prototype.setMotivation = function(motivation, value) {
    this.motivations[motivation] = value;
}


//Set the intensity of a motivational state relatively
//motivation is the name of the motivation (string)
//change is the amount to add to the current state intensity
Filter.prototype.changeMotivation = function(motivation, change) {
    this.motivations[motivation] += change;
}


//Apply rules and inhibit corresponding emotions
//emotions is an Emotions object representing current state
//returns update emotional state
Filter.prototype.applyRules = function(emotions) {
    for(var ruleNum = 0; ruleNum < this.rules.length; ruleNum++) {
        var rule = this.rules[ruleNum];
        var overallTruth = false;
        var motivation = rule[0];
        var relationalOp = rule[1];
        var value = rule[2];
        overallTruth = this.checkRelation(motivation, relationalOp, value);
        var logicOp = rule[3].toLowerCase();
        var tokenNum = 4;

        while(logicOp !== "then") {
            motivation = rule[tokenNum];
            tokenNum++;
            relationalOp = rule[tokenNum];
            tokenNum++;
            value = rule[tokenNum];
            tokenNum++;

            var expTruth = this.checkRelation(motivation, relationalOp, value);
            if(logicOp === "and") {
                overallTruth = overallTruth && expTruth;
            }
            else if(logicOp === "or") {
                overallTruth = overallTruth || expTruth;
            }

            logicOp = rule[tokenNum].toLowerCase();
            tokenNum++;
        }

        if(overallTruth) {
            emotions.state[rule[tokenNum]] = 0;
        }
    }
    return emotions;
}


//Checks validity of relational operator in rule
//returns whether relation is true or false (boolean)
Filter.prototype.checkRelation = function(motivation, relationalOp, value) {

    var relation = false;
    if(motivation in this.motivations) {
        if(relationalOp === "<=") {
            relation = this.motivations[motivation] <= value;
        }
        else if(relationalOp === "<") {
            relation = this.motivations[motivation] < value;
        }
        else if(relationalOp === ">=") {
            relation = this.motivations[motivation] >= value;
        }
        else if(relationalOp === ">") {
            relation = this.motivations[motivation] > value;
        }
        else if(relationalOp === "==") {
            relation = this.motivations[motivation] === value;
        }
        else if(relationalOp === "!=") {
            relation = this.motivations[motivation] !== value;
        }
    }

    return relation;
}