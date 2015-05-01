/**
 * Created by Douglas on 2/21/2015.
 */


//Combines multiple lists into a list of lists
//Ex.: [1,2,3], [a,b,c] -> [[1,a],[2,b],[3,c]]
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


//Constructor for Point class
//x is a numerical value
//y is a numerical value
function Point(x, y) {
    this.x = x;
    this.y = y;
}


//Adds one list to the end of another list
//Ex.: pushArray([1,2,3],[4,5,6]) = [1,2,3,4,5,6]
function pushArray(arr1, arr2) {
    for (var i = 0; i < arr2.length; ++i) {
        arr1.push(arr2[i]);
    }

    return arr1;
};