function Appraiser() {}

Appraiser.prototype.appraiseEvent = function(name, oldEmotions, events) {
    var newEmotions = oldEmotions;

    if(this.events[name]["Desirability"] > 0){
        newEmotions.state["Joy"] += (1.7*Math.pow(this.events[name]["Expectation"],0.5)) + (0.7*desirability);
    }
    if(this.events[name]["Desirability"] > 0){
        newEmotions.state["Sad"] += (2*Math.pow(this.events[name]["Expectation"],2))-desirability;
    }

    newEmotions.state["Fear"] = this.calculateFear(events);
    newEmotions.state["Hope"] = this.calculateHope(events);
    newEmotions.state["Anger"] = Math.max(newEmotions.state["Sad"],newEmotions.state["Reproach"]);
    newEmotions.state["Gratitude"] = Math.max(newEmotions.state["Joy"],newEmotions.state["Admiration"]);
    newEmotions.state["Gratification"] = Math.max(newEmotions.state["Joy"],newEmotions.state["Pride"]);
    newEmotions.state["Remorse"] = Math.max(newEmotions.state["Sad"],newEmotions.state["Shame"]);

    return newEmotions;
}

Appraiser.prototype.appraiseBehavior = function(behaviorName, agentName, oldEmotions, standards) {
    var newEmotions = oldEmotions;

    if(agentName === this.name) {
        if(standards[behaviorName] >= 0) {
            newEmotions.state["Pride"] += standards[behaviorName];
        }
        else {
            newEmotions.state["Shame"] += -1*standards[behaviorName];
        }
    }
    else {
        if(standards[behaviorName] >= 0) {
            newEmotions.state["Admiration"] += standards[behaviorName];
        }
        else {
            newEmotions.state["Reproach"] += -1*standards[behaviorName];
        }
    }

    return newEmotions;
}


Appraiser.prototype.calculateFear = function(events){
    var maxFear = 0;
    for (var eventName in events) {
        if (events.hasOwnProperty(eventName)) {
            var fear = 0;

            if(events[eventName]["Desirability"] < 0 && events[eventName]["Expectation"] !== 1) {
                fear = (2*Math.pow(events[eventName]["Expectation"],2))-events[eventName]["Desirability"];
            }

            if(fear > maxFear){
                maxFear = fear;
            }
        }
    }

    return maxFear;
}

Appraiser.prototype.calculateHope = function(events){
    var maxHope = 0;
    for (var eventName in events) {
        if (events.hasOwnProperty(eventName)) {
            var hope = 0;

            if(events[eventName]["Desirability"] > 0 && events[eventName]["Expectation"] !== 1) {
                hope = (1.7*Math.pow(events[eventName]["Expectation"],0.5))+(0.7*events[eventName]["Desirability"]);
            }

            if(hope > maxHope){
                maxHope = hope;
            }
        }
    }

    return maxHope;
}