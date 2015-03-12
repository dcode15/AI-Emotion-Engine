function Appraiser() {
    this.memory = [];
}

Appraiser.prototype.appraiseEvent = function(event, standards, state) {
    var newEmotions = new Emotions();

    if(desirability > 0){
        newEmotions.state["Joy"] = (1.7*Math.pow(this.events[event.name]["Expectation"],0.5)) + (0.7*desirability);
    }
    if(desirability < 0){
        newEmotions.state["Sad"] = (2*Math.pow(this.events[event.name]["Expectation"],2))-desirability;
    }



    return emotions;
}