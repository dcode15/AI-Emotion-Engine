function Appraiser(name) {this.name = name;}

Appraiser.prototype.appraiseEvent = function(name, oldEmotions, events) {
    var newEmotions = oldEmotions;

    if(events[name]["Desirability"] > 0){
        newEmotions.state["Joy"] += (1.7*Math.pow(events[name]["Expectation"],0.5)) + (0.7*events[name]["Desirability"]);
    }
    if(events[name]["Desirability"] < 0){
        newEmotions.state["Sad"] += (2*Math.pow(events[name]["Expectation"],2))-events[name]["Desirability"];
    }

    newEmotions.state["Fear"] = this.calculateFear(events);
    newEmotions.state["Hope"] = this.calculateHope(events);
    newEmotions.state["Anger"] = Math.min(newEmotions.state["Sad"],newEmotions.state["Reproach"]);
    newEmotions.state["Gratitude"] = Math.min(newEmotions.state["Joy"],newEmotions.state["Admiration"]);
    newEmotions.state["Gratification"] = Math.min(newEmotions.state["Joy"],newEmotions.state["Pride"]);
    newEmotions.state["Remorse"] = Math.min(newEmotions.state["Sad"],newEmotions.state["Shame"]);

    return newEmotions;
}

Appraiser.prototype.appraiseBehavior = function(behaviorName, agentName, oldEmotions, standards) {
    var newEmotions = oldEmotions;

    if(behaviorName in standards) {
        var perception = standards[behaviorName]["Overall"] / standards[behaviorName]["Count"];

        if (agentName === this.name) {
            if (perception >= 0) {
                newEmotions.state["Pride"] += perception;
            }
            else {
                newEmotions.state["Shame"] +=  -1 * perception;
            }
        }
        else {
            if (perception >= 0) {
                newEmotions.state["Admiration"] += perception;
            }
            else {
                newEmotions.state["Reproach"] +=  -1 * perception;
            }
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