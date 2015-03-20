function Filter() {
    this.motivations = {};
    this.rules = [];
}

Filter.prototype.addRule = function(rule){
    this.rules.push(rule.split(" "));
}

Filter.prototype.setMotivation = function(motivation, value) {
    this.motivations[motivation] = value;
}

Filter.prototype.changeMotivation = function(motivation, change) {
    this.motivations[motivation] += change;
}

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

/*function applyRules(emotions) {
    for(var ruleNum = 0; ruleNum < rules.length; ruleNum++) {
        var rule = rules[ruleNum];
        var overallTruth = false;
        var motivation = rule[0];
        var relationalOp = rule[1];
        var value = rule[2];
        overallTruth = checkRelation(motivation, relationalOp, value);
        var logicOp = rule[3].toLowerCase();
        var tokenNum = 4;

        while(logicOp !== "then") {
            motivation = rule[tokenNum];
            tokenNum++;
            relationalOp = rule[tokenNum];
            tokenNum++;
            value = rule[tokenNum];
            tokenNum++;

            var expTruth = checkRelation(motivation, relationalOp, value);
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
}*/


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