/**
 * Created by Douglas on 2/18/2015.
 */

function brain(name, gender){

    this.name = name;
    this.gender = gender;
}

brain.prototype.speak = function(){
    alert("Howdy, my name is" + this.name);
};
