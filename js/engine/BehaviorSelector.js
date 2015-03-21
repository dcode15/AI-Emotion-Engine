function BehaviorSelector() {
    this.rules = [];
}

function Rule(emotionalConditions, event, cause, behavior) {
    this.conditions = emotionalConditions;
    this.event = event;
    this.eventCause = cause;
    this.behavior = behavior;
}

BehaviorSelector.prototype.addRule  = function(emotionalConditions, event, cause) {
    var newRule = new Rule(emotionalConditions, event, cause);
    this.rules.push(newRule);
}

BehaviorSelector.prototype.applyRules = function(eventName, cause, emotions) {
    for(var ruleNum = 0; ruleNum < this.rules.length; ruleNum++) {
        var rule = this.rules[ruleNum];

        if(rule.event === eventName && rule.eventCause === cause) {


            var tokenNum = 0;
            while(tokenNum < rule.conditions.length) {
                var emotion = rule.conditions[tokenNum];
                tokenNum++;
            }
        }
    }
}