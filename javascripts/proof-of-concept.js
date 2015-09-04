// right
var oldBoardLeft = [
  [0,    2, 0,  2],
  [2,    4, 4,  4],
  [4,    2, 8, 16],
  [16, 128, 4,  0]
];

var oldBoardRight = [
  [0,    2, 0,  2],
  [2,    4, 4,  4],
  [4,    2, 8, 16],
  [16, 128, 4,  0]
];

var newBoardLeft = [
  [4, 0, 0, 0], // collision one
  [2, 8, 4, 0], // collision two
  [4, 2, 8, 16],
  [16, 128, 4, 0]
];

var newBoardRight = [
  [0,  0,   0,  4], // collision one
  [0,  2,   4,  8], // collision two
  [4,  2,   8, 16],
  [0, 16, 128,  4]
];

// => 0 4 128 16 vs 4 128 16 0


var oldBoardUp = [
  [0, 0, 4, 2], // collisions one & two
  [0, 8, 4, 2], // collision three
  [2, 8, 4, 4],
  [4, 4, 2, 2]
]; // 0 0 2 4, 0 8 8 4, 4 4 4 2, 2 2 4 2

var newBoardUp = [
  [2, 16, 8, 4],
  [4, 4,  4, 4],
  [0, 0,  2, 2],
  [0, 0,  0, 0]
]; // 2 4 0 0, 16 4 0 0, 8 4 2 0, 4 4 2 0

var oldBoardDown = [
  [0, 0, 4, 2], // collisions one & two
  [0, 8, 4, 2], // collision three
  [2, 8, 4, 4],
  [4, 4, 2, 2]
]; // 0 0 2 4, 0 8 8 4, 4 4 4 2, 2 2 4 2

var newBoardDown = [
  [0,  0, 0, 0],
  [0,  0, 4, 4],
  [2, 16, 8, 4],
  [4,  4, 2, 2]
]; // 0 0 2 4, 0 0 16 4, 0 4 8 2, 0 4 4 2

function proofOfConcept(oldBoard, newBoard, direction) {

  // we need to twist the board so we have arrays to move through for vertical row operations
  function reorientIfNecessary(arrayOfArrays) {
    if (direction == "up" || direction == "down") {
      console.log("direction is up or down. OK, turning board 90 degrees.");
      var reorientedBoard = [];
      for (var oldCol = 0; oldCol < 4; oldCol++) {
        var newRow = [];
        for (var oldRow = 0; oldRow < 4; oldRow++) {
          newRow.push(arrayOfArrays[oldRow][oldCol]);
        } // bye, for oldRow loop
        reorientedBoard.push(newRow);
      } // bye, for oldCol loop
      console.log(arrayOfArrays);

      reorientedBoard.forEach(function(reorientedRow, index) {
        arrayOfArrays[index] = reorientedRow;
        console.log("updated your row!");
        console.log(arrayOfArrays);
      });

      // arrayOfArrays = reorientedBoard;
      console.log(arrayOfArrays);
    }; // bye, if direction
  } // bye, reorientIfNecessary

  // we need to traverse down & right backwards
  function reverseIfNecessary(array) {
    if (direction == "right" || direction == "down") {
      console.log("direction is right or down. OK, reversing row for ease of calculation.")
      console.log(array);
      array.reverse();
      console.log(array);
    }
  } // bye, reverseIfNecessary

  function moveZerosToEnd(array) {
    for (var i = 0; i < array.length; i++) {
      while (array[i] == 0) {
        array.splice(i, 1);
      }
    }

    while (array.length < 4) {
      array.push(0);
    }

    console.log("maybe I moved some zeros for you!");
    console.log("updated array: " + array);
  } // bye, moveZerosToEnd

  reorientIfNecessary(oldBoard);
  reorientIfNecessary(newBoard);

  var collisions = 0;
  for (var row = 0; row < 4; row++) {
    var collision = false;
    var location;
    console.log("----- starting row: OLD--" + oldBoard[row] + " NEW--" + newBoard[row]);

    reverseIfNecessary(oldBoard[row]);
    reverseIfNecessary(newBoard[row]);
    moveZerosToEnd(oldBoard[row]);

    function noCollisionTest(col) { // something off about this
      if (oldBoard[row][col] != 0 && oldBoard[row][col] != newBoard[row][col]) {
        collision = true;
        console.log("found a collision at location (" + row + ", " + col + ")");
        console.log("proofs: old(" + oldBoard[row][col] + "), new(" + newBoard[row][col] + ")");
        collisions += 1;
        console.log("incrementing collisions counter");
        location = col;
        console.log("saving the location");
      };
    }

    for (var col = 0; col < 4; col++) {
      if (!collision) {
        noCollisionTest(col);
      } else { // we have a collision
        if (oldBoard[row][col] != 0) { // we can only resolve it once we find the other tile!
          collision = false;
          console.log("grabbing the location of the second tile from the page");
          console.log("giving it the collide / delete me soon class");
          // we might need to swap row & location here for up/down operations, because of the twisty twist
          console.log("updating its attributes to have location (" + row + ", " + location + ")");
          console.log("waiting for the animation to conclude...");
          console.log("deleting the tile after animation is over");
          console.log(col);
          var removed = oldBoard[row].splice(col, 1);
          console.log("removing that index :" + removed);
          oldBoard[row].splice(20, 0, 0);
          console.log(oldBoard[row]);
          console.log("grabbing the location of the first tile from the page");
          console.log("updating it to have the new value");
          oldBoard[row][location] = oldBoard[row][location] * 2;
          console.log("adding the pop style");
          // now that the current collision is resolved, there might be something else in this spot
          // so let's call noCollisionTest()
          noCollisionTest(col);
        }; // bye if loc != 0
      }; // bye if !collision else
    } // bye, for col loop

    reverseIfNecessary(oldBoard[row]);
    reverseIfNecessary(newBoard[row]);

    console.log("this row is finished!");
    console.log(oldBoard[row]);
    console.log(newBoard[row]);
    console.log("\n\n\n\n");
  } // bye, for row loop
} // bye, proofOfConcept


// proofOfConcept(oldBoardLeft, newBoardLeft, "left");
// proofOfConcept(oldBoardRight, newBoardRight, "right");
proofOfConcept(oldBoardUp, newBoardUp, "up");
proofOfConcept(oldBoardDown, newBoardDown, "down");