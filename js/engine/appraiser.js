function Appraiser() {
    this.memory = [];
}

Appraiser.prototype.appraiseEvent = function(name, standards, state) {
    var newEmotions = new Emotions();

    if(this.events[name]["Desirability"] > 0){
        newEmotions.state["Joy"] = (1.7*Math.pow(this.events[name]["Expectation"],0.5)) + (0.7*desirability);
    }
    if(this.events[name]["Desirability"] > 0){
        newEmotions.state["Sad"] = (2*Math.pow(this.events[name]["Expectation"],2))-desirability;
    }



    return emotions;
}