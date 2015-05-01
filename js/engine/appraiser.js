
//Constructor for Appraiser class
//name is the name of the individual (string)
function Appraiser(name) {
    this.name = name;
    this.associations = {};
    this.userModel = {};
    this.memory = [];
}


//Updates emotional state based on triggered event
//name is the name of the event (string)
//oldEmotions is an Emotions object representing emotional state prior to event
//events is the dictionary of events the agent understands
//objects is a list of associated objects (strings)
//returns updated Emotions object
Appraiser.prototype.appraiseEvent = function(name, oldEmotions, events, objects) {
    var newEmotions = oldEmotions;
    var emotionalChange = {};
    this.updateMemory(name);

    if(events[name]["Desirability"] > 0){
        var joy = (1.7*Math.pow(events[name]["Expectation"],0.5)) + (0.7*events[name]["Desirability"]);
        emotionalChange["Joy"] = joy;
        emotionalChange["Sad"] = 0;
        newEmotions.state["Joy"] += (3-newEmotions.state["Joy"])*(joy/3);
    }
    else if(events[name]["Desirability"] < 0){
        var sad = (2*Math.pow(events[name]["Expectation"],2))-events[name]["Desirability"]
        emotionalChange["Sad"] = sad;
        emotionalChange["Joy"] = 0;
        newEmotions.state["Sad"] += (3-newEmotions.state["Sad"])*(sad/3);
    }
    else if(events[name]["Desirability"] === 0) {
        emotionalChange["Sad"] = 0;
        emotionalChange["Joy"] = 0;
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


//Updates social emotions in response to a behavior
//behaviorName is the name of the behavior (string)
//agentName is the name of the agent (string)
//oldEmotions is an Emotions object representing emotional state prior to behavior
//standards is a dictionary of learned social standards for behaviors
//returns updated emotions object
Appraiser.prototype.appraiseBehavior = function(behaviorName, agentName, oldEmotions, standards) {
    var newEmotions = oldEmotions;

    if(behaviorName in standards) {
        var perception = standards[behaviorName]["Overall"] / standards[behaviorName]["Count"];

        if (agentName === this.name) {
            if (perception >= 0) {
                newEmotions.state["Pride"] += (3-newEmotions.state["Pride"])*(perception/3);
            }
            else {
                newEmotions.state["Shame"] +=  (3-newEmotions.state["Shame"])*((-1*perception)/3);
            }
        }
        else {
            if (perception >= 0) {
                newEmotions.state["Admiration"] += (3-newEmotions.state["Admiration"])*(perception/3);
            }
            else {
                newEmotions.state["Reproach"] +=  (3-newEmotions.state["Reproach"])*((-1*perception)/3);
            }
        }
    }

    return newEmotions;
}


//Calculates the maximum fear response of all known events
//events is the dictionary of events the agent understands
//returns a decimal intensity value
Appraiser.prototype.calculateFear = function(events){
    var maxFear = 0;
    for (var eventName in events) {
        if (events.hasOwnProperty(eventName)) {
            var fear = 0;

            if(events[eventName]["Desirability"] < 0) {
                fear = (1.85*Math.pow(events[eventName]["Expectation"],2))-events[eventName]["Desirability"];
            }

            if(fear > maxFear){
                maxFear = fear;
            }
        }
    }

    return maxFear;
}


//Calculates the maximum hope response of all known events
//events is the dictionary of events the agent understands
//returns a decimal intensity value
Appraiser.prototype.calculateHope = function(events){
    var maxHope = 0;
    for (var eventName in events) {
        if (events.hasOwnProperty(eventName)) {
            var hope = 0;

            if(events[eventName]["Desirability"] > 0) {
                hope = (1.55*Math.pow(events[eventName]["Expectation"],0.5))+(0.7*events[eventName]["Desirability"]);
            }

            if(hope > maxHope){
                maxHope = hope;
            }
        }
    }

    return maxHope;
}


//Updates object associations in response to new event
//objects is a list of object names (strings)
//emotionalChange is the emotional result of the associated event
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
                    if(this.associations[objectName].hasOwnProperty(emotionName)) {
                        this.associations[objectName][emotionName]["Total"] += emotionalChange[emotionName];
                        this.associations[objectName][emotionName]["Count"]++;
                    }
                    else {
                        this.associations[objectName][emotionName] = {};
                        this.associations[objectName][emotionName]["Total"] = emotionalChange[emotionName];
                        this.associations[objectName][emotionName]["Count"] = 1;
                    }
                }
            }
        }
    }
}


//Updates count of three-event sequences in agent's memory
//eventName is the name of the triggered event (string)
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


//Recalculates expectations in response to new experience
//eventsList is the dictionary of events the agent understands
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


//Gets the expectation for a particular event
//eventName is the name of the event (string)
//returns a decimal expectation between 0 and 1
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