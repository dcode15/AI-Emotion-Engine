/**
 * Created by Douglas on 2/18/2015.
 */

var brain = new Engine()
brain.addGoal("Survive",0.9);
brain.addGoal("Find Shelter", 0.3);
brain.addGoal("Find Water", 0.6);

var storm = new Event([["Survive", -0.5], ["Find Shelter", -0.8]],1,1);
brain.triggerEvent(storm);

