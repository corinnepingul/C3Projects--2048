var ob = [
  [0,    2, 0,  2],
  [2,    4, 4,  4],
  [4,    2, 8, 16],
  [16, 128, 4,  0]
]

var nb = [
  [0,  0,   0,  4], // one collision
  [0,  2,   4,  8], // two collision
  [4,  2,   8, 16],
  [0, 16, 128,  4]
]

var direction = "right";

function reverseIfNecessary(array) {
  if (direction == "right" || direction == "down")
    array.reverse();
}

var collisions = 0;
for (var row = 0; row < 4; row++) {
  var collision = false;
  var location;
  console.log("----- starting row: " + ob[row]);


  reverseIfNecessary(ob[row]);
  reverseIfNecessary(nb[row]);

  function noCollisionTest(col) {
    if (ob[row][col] != 0 && ob[row][col] != nb[row][col]) {
      collision = true;
      console.log("found a collision at location (" + row + ", " + col + ")");
      console.log("proofs: old(" + ob[row][col] + "), new(" + nb[row][col] + ")");
      collisions += 1;
      console.log("incrementing collisions counter");
      location = col;
      console.log("saving the location");
    };
  }

  for (var col = 0; col < 4; col++) {
    if (ob[row][col] == 0) {
      var removed = ob[row].splice(col, 1);
      console.log("moved a zero to the end.");
      ob[row].splice(20, 0, 0);
    }
    if (!collision) {
      noCollisionTest(col);
    } else { // we have a collision
      if (ob[row][col] != 0) { // we can only resolve it once we find the other tile!
        collision = false;
        console.log("grabbing the location of the second tile from the page");
        console.log("giving it the collide / delete me soon class");
        console.log("updating its attributes to have location (" + row + ", " + location + ")");
        console.log("waiting for the animation to conclude...");
        console.log("deleting the tile after animation is over");
        console.log(col);
        var removed = ob[row].splice(col, 1);
        console.log("removing that index :" + removed);
        ob[row].splice(20, 0, 0);
        console.log(ob[row]);
        console.log("grabbing the location of the first tile from the page");
        console.log("updating it to have the new value");
        ob[row][location] = ob[row][location] * 2;
        console.log("adding the pop style");
        // now that the current collision is resolved, there might be something else in this spot
        // so let's call noCollisionTest()
        noCollisionTest(col);
      }; // bye if loc != 0
    }; // bye if !collision else
  } // bye, for col loop

  reverseIfNecessary(ob[row]);
  reverseIfNecessary(nb[row]);

  console.log("this row is finished!");
  console.log(ob[row]);
  console.log(nb[row]);
  console.log("\n\n\n\n");
} // bye, for row loop
