/**
 * Created by Douglas on 2/21/2015.
 */


//Courtesy of ninjagecko at http://stackoverflow.com/questions/4856717/javascript-equivalent-of-pythons-zip-function
function zip() {
    var args = [].slice.call(arguments);
    var shortest = args.length==0 ? [] : args.reduce(function(a,b){
        return a.length<b.length ? a : b
    });

    return shortest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function pushArray(arr1, arr2) {
    for (var i = 0; i < arr2.length; ++i) {
        arr1.push(arr2[i]);
    }

    return arr1;
};