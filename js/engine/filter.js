function filter() {
    this.motivations = {};
    this.rules = [];
}

filter.prototype.addRule = function(rule){
    this.rules.push(rule.split[" "]);
}

filter.prototype.setMotivation = function(motivation, value) {
    this.motivations[motivation] = value;
}

filter.prototype.changeMotivation = function(motivation, change) {
    this.motivations[motivation] += change;
}

filter.prototype.applyRules = function(emotions) {
    for(var ruleNum = 0; ruleNum < this.rules.length; ruleNum++) {
        var rule = this.rules[ruleNum];
        var truth = false;
        var motivation = rule[0];
        var relationalOp = rule[1];
        var value = rule[2];
        truth = this.checkRelation(motivation, relationalOp, value);
        var logicOp = rule[3].toLowerCase();
        var tokenNum = 4;

        while(logicOp !== "then") {
            
        }

        if(truth) {
            emotions.state[rule[tokenNum]] = 0;
        }
    }
}


filter.prototype.checkRelation = function(motivation, relationalOp, value) {

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