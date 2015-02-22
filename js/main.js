/**
 * Created by Douglas on 2/18/2015.
 */
var input1 = new fuzzyVar("Temp", ["Cold", "Warm", "Hot"], [[0,0.2,0.4], [0.3,0.5,0.7], [0.6,0.8,1]]);
var input2 = new fuzzyVar("Humidity", ["Low", "Med", "High", "Very High"], [[0,0.2,0.4], [0.3,0.5,0.7], [0.6,0.75,0.9],[0.8,1.0,1.2]]);
var output1 = new fuzzyVar("Comfort", ["Uncomfortable", "Neutral", "Comfortable"], [[0,0.2,0.4], [0.3,0.5,0.7], [0.6,0.8,1]]);
var rules = [["Temp", "Hot", "AND", "Humidity", "High", "THEN", "Comfort", "Uncomfortable"]];
var fuzzy = new fuzzySystem([input1, input2],[output1], rules);
fuzzy.processValue([0.90,0.85]);

