/**
 * Created by Douglas on 2/18/2015.
 */
function FuzzyVar(variableName, setNames, setValues) {

    this.variableName = variableName;
    this.setNames = setNames;
    this.setValues = setValues;
}

function FuzzySystem(inputSets, outputSets, rules){

    this.inputSets = inputSets;
    this.outputSets = outputSets;
    this.rules = rules;

    for(var i = 0; i < this.rules.length; i++) {
        this.rules[i] = this.rules[i].split(" ");
    }
}

FuzzySystem.prototype.processValue = function(value) {

    var fuzzyInputs = this.convertInputToFuzzy(value);
    var fuzzyOutputs = this.applyRules(fuzzyInputs);
    var crispOutputs = this.defuzzify(fuzzyOutputs);
    return crispOutputs;
};

FuzzySystem.prototype.convertInputToFuzzy = function(value) {

    var fuzzyInputs = {};

    for(var inputNum = 0; inputNum < this.inputSets.length; inputNum++) {
        fuzzyInputs[this.inputSets[inputNum].variableName] = {};
        var sets = this.inputSets[inputNum].setValues;

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

            var inputVar = this.inputSets[inputNum].variableName;
            var setName = this.inputSets[inputNum].setNames[setNum];
            fuzzyInputs[inputVar][setName] = fuzzyValue;
        }
    }

    return fuzzyInputs;
};

FuzzySystem.prototype.applyRules = function(fuzzyInputs) {

    var fuzzyOutputs = {};
    for(var outputNum = 0; outputNum < this.outputSets.length; outputNum++) {
        fuzzyOutputs[this.outputSets[outputNum].variableName] = {};
        var sets = this.outputSets[outputNum].setValues;

        for (var setNum = 0; setNum < sets.length; setNum++) {
            var outputVar = this.outputSets[outputNum].variableName;
            var setName = this.outputSets[outputNum].setNames[setNum];
            fuzzyOutputs[outputVar][setName] = 0;
        }
    }

    for(var ruleNum = 0; ruleNum < this.rules.length; ruleNum++) {
        var operator = "IF";
        var rule = this.rules[ruleNum];
        var tokenNum = 0;
        var total = 0;

        while(operator !== "THEN") {
            var varName = rule[tokenNum];
            tokenNum++;
            var setName = rule[tokenNum];
            tokenNum++;

            var value = fuzzyInputs[varName][setName];

            if(operator === "IF") {
                total = value;
            }
            else if(operator === "AND") {
                total = Math.min(value, total);
            }
            else if(operator === "OR") {
                total = Math.max(value, total);
            }

            operator = rule[tokenNum];
            tokenNum++;
        }

        var outputVar = rule[tokenNum];
        tokenNum++;
        var outputSet = rule[tokenNum];
        tokenNum++;
        if(total > fuzzyOutputs[outputVar][outputSet]) {
            fuzzyOutputs[outputVar][outputSet] = total;
        }
    }

    return fuzzyOutputs;
}

FuzzySystem.prototype.defuzzify = function(fuzzyOutputs) {

    var crispOutputs = {};

    for(var outputNum = 0; outputNum < this.outputSets.length; outputNum++) {
        var keyPoints = []
        var outputName = this.outputSets[outputNum].variableName;
        var sets = this.outputSets[outputNum].setNames;

        for (var setNum = 0; setNum < sets.length; setNum++) {
            var setName = sets[setNum];
            var left = new Point(this.outputSets[outputNum].setValues[setNum][0], 0);
            var peak = new Point(this.outputSets[outputNum].setValues[setNum][1], 1);
            var right = new Point(this.outputSets[outputNum].setValues[setNum][2], 0);

            var membership = fuzzyOutputs[outputName][setName];

            if(membership > 0) {
                keyPoints.push(left);

                if(membership == 1) {
                    keyPoints.push(peak);
                }
                else {
                    //come back and look at this
                    var angle = Math.atan(1/(peak.x-left.x));
                    var leftPeakX = membership / Math.tan(angle);
                    keyPoints.push(new Point(leftPeakX, membership));

                    angle = Math.atan(1/(right.x-peak.x));
                    var rightPeakX = membership / Math.tan(angle);
                    keyPoints.push(new Point(rightPeakX, membership));
                }
                keyPoints.push(right);
            }
        }
        crispOutputs[outputName] = this.defuzzEstimate(keyPoints);
    }

    return crispOutputs;
}

FuzzySystem.prototype.defuzzEstimate = function(keyPoints) {

    var maxY = 0;
    var maxX = [];
    for (var i = 0; i<keyPoints.length; i++){
        if(keyPoints[i].y > maxY){
            maxY = keyPoints[i].y;
        }
    }

    for (var i = 0; i<keyPoints.length; i++){
        if(keyPoints[i].y == maxY){
            maxX.push(keyPoints[i].x);
        }
    }

    var sum = 0
    for (var i = 0; i<maxX.length; i++){
        sum += maxX[i];
    }
    var center = sum/maxX.length;
    var left = center-keyPoints[0].x;
    var right = keyPoints[keyPoints.length-1].x-center;

    return (center +(1/3)*(right-left));
}
