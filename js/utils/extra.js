/*
 *
 * This file contains code that isn't currently used in the program, 
 * but may come in handy at a later time.
 *
 */

//Add axes for guide
var axes = new THREE.AxisHelper(5);
scene.add(axes);
        
//Lighting for 2D look        
var 2DLight = new THREE.DirectionalLight(0xffffff, 0.5);
2DLight.position.set(0, 1, 0);
scene.add(2DLight);