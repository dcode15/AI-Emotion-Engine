function Appraiser(name) {
    this.name = name;
    this.associations = {};
    this.userModel = {};
    this.memory = [];
}

Appraiser.prototype.appraiseEvent = function(name, oldEmotions, events, objects) {
    var newEmotions = oldEmotions;
    var emotionalChange = {};
    this.updateMemory(name);

    if(events[name]["Desirability"] > 0){
        var joy = (1.7*Math.pow(events[name]["Expectation"],0.5)) + (0.7*events[name]["Desirability"]);
        emotionalChange["Joy"] = joy;
        emotionalChange["Sad"] = 0;
        newEmotions.state["Joy"] += joy;
    }
    if(events[name]["Desirability"] < 0){
        var sad = (2*Math.pow(events[name]["Expectation"],2))-events[name]["Desirability"]
        emotionalChange["Sad"] = sad;
        emotionalChange["Joy"] = 0;
        newEmotions.state["Sad"] += sad;
    }


    emotionalChange["Fear"] = this.calculateFear(events);
    newEmotions.state["Fear"] = emotionalChange["Fear"];
    emotionalChange["Hope"] = this.calculateHope(events);
    newEmotions.state["Hope"] = emotionalChange["Hope"];
    newEmotions.state["Anger"] = Math.min(newEmotions.state["Sad"],newEmotions.state["Reproach"]);
    emotionalChange["Anger"] = newEmotions.state["Anger"];
    newEmotions.state["Gratitude"] = Math.min(newEmotions.state["Joy"],newEmotions.state["Admiration"]);
    emotionalChange["Gratitude"] = newEmotions.state["Gratitude"];
    newEmotions.state["Gratification"] = Math.min(newEmotions.state["Joy"],newEmotions.state["Pride"]);
    emotionalChange["Gratification"] = newEmotions.state["Gratification"];
    newEmotions.state["Remorse"] = Math.min(newEmotions.state["Sad"],newEmotions.state["Shame"]);
    emotionalChange["Remorse"] = newEmotions.state["Remorse"];

    this.updateAssociations(objects, emotionalChange);

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

            if(events[eventName]["Desirability"] < 0) {
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

            if(events[eventName]["Desirability"] > 0) {
                hope = (1.7*Math.pow(events[eventName]["Expectation"],0.5))+(0.7*events[eventName]["Desirability"]);
            }

            if(hope > maxHope){
                maxHope = hope;
            }
        }
    }

    return maxHope;
}

Appraiser.prototype.updateAssociations = function(objects, emotionalChange) {
    for(var objectNum = 0; objectNum < objects.length; objectNum++) {
        var objectName = objects[objectNum];

        if(!(objectName in this.associations)) {

            this.associations[objectName] = {};
            for(var emotionName in emotionalChange) {
                if (emotionalChange.hasOwnProperty(emotionName)) {
                    this.associations[objectName][emotionName] = {};
                    this.associations[objectName][emotionName]["Total"] = emotionalChange[emotionName];
                    this.associations[objectName][emotionName]["Count"] = 1;
                }
            }
        }
        else {
            for(var emotionName in emotionalChange) {
                if (emotionalChange.hasOwnProperty(emotionName)) {
                    this.associations[objectName][emotionName]["Total"] += emotionalChange[emotionName];
                    this.associations[objectName][emotionName]["Count"]++;
                }
            }
        }
    }
}

Appraiser.prototype.updateMemory = function(eventName) {
    if(this.memory.length < 2) {
        this.memory.push(eventName);
    }
    else if(this.memory.length === 2) {
        this.memory.push(eventName);
        this.userModel[this.memory[0]][this.memory[1]][this.memory[2]]++;
    }
    else {
        this.memory[0] = this.memory[1];
        this.memory[1] = this.memory[2];
        this.memory[2] = eventName;

        this.userModel[this.memory[0]][this.memory[1]][this.memory[2]]++;
    }
}

Appraiser.prototype.updateUserModel = function(eventsList) {

    for(var eventOne in eventsList) {
        if(eventsList.hasOwnProperty(eventOne)) {
            for(var eventTwo in eventsList) {
                if(eventsList.hasOwnProperty(eventTwo)) {
                    for(var eventThree in eventsList) {
                        if(eventsList.hasOwnProperty(eventThree)) {

                            if(eventOne in this.userModel) {
                                if(eventTwo in this.userModel[eventOne]) {
                                    if(!(eventThree in this.userModel[eventOne][eventTwo])) {
                                        this.userModel[eventOne][eventTwo][eventThree] = 0;
                                    }
                                }
                                else {
                                    this.userModel[eventOne][eventTwo] = {};
                                    this.userModel[eventOne][eventTwo][eventThree] = 0;
                                }
                            }
                            else {
                                this.userModel[eventOne] = {};
                                this.userModel[eventOne][eventTwo] = {};
                                this.userModel[eventOne][eventTwo][eventThree] = 0;
                            }
                        }
                    }
                }
            }
        }
    }
}

Appraiser.prototype.getExpectation = function(eventName) {
    if(this.memory.length === 3) {
        var lastEvent = this.memory[2];
        var secondLastEvent = this.memory[1];
        var expectation;

        if (this.userModel[secondLastEvent][lastEvent][eventName] !== 0) {
            var total = 0;

            for (var event in this.userModel[secondLastEvent][lastEvent]) {
                if (this.userModel[secondLastEvent][lastEvent].hasOwnProperty(event)) {
                    if (this.userModel[secondLastEvent][lastEvent][event] !== 0) {
                        total += this.userModel[secondLastEvent][lastEvent][event];
                    }
                }
            }
            expectation = this.userModel[secondLastEvent][lastEvent][eventName] / total;
        }
        else {
            expectation = 0.3;
        }
    }
    else {
        expectation = 0.3;
    }

    return expectation;
}