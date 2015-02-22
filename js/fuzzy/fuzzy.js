/**
 * Created by Douglas on 2/18/2015.
 */
function fuzzyVar(variableName, setNames, setValues) {

    this.variableName = variableName;
    this.setNames = setNames;
    this.setValues = setValues;
}

function fuzzySystem(inputSets, outputSets, rules){

    this.inputSets = inputSets;
    this.outputSets = outputSets;
    this.rules = rules;
}

fuzzySystem.prototype.processValue = function(value) {

    var fuzzyValues = this.convertInputToFuzzy(value);
    console.log(fuzzyValues);
};

fuzzySystem.prototype.convertInputToFuzzy = function(value) {

    var fuzzyInputs = [];

    for(var inputNum = 0; inputNum < this.inputSets.length; inputNum++) {
        var sets = this.inputSets[inputNum].setValues;
        var setValues = {{}};

        for(var setNum = 0; setNum < sets.length; setNum++) {
            var currentSet = sets[setNum];
            var fuzzyValue;

            if(value[inputNum] > currentSet[0] && value[inputNum] <= currentSet[1]) {
                fuzzyValue = (1/(currentSet[1]-currentSet[0]))*(value[inputNum]-currentSet[0]);
            }
            else if(value[inputNum] > currentSet[1] && value[inputNum] < currentSet[2]) {
                fuzzyValue = 1 - (1/(-1*currentSet[1]+currentSet[2]))*(value[inputNum] - currentSet[1]);
            }
            else {
                fuzzyValue = 0;
            }
            setValues = [this.inputSets[inputNum].variableName, this.inputSets[inputNum].setNames[setNum], fuzzyValue];
            fuzzyInputs.push(setValues);
        }
    }

    return fuzzyInputs;
};