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
} // bye, proofOfConcept


// proofOfConcept(oldBoardLeft, newBoardLeft, "left");
// proofOfConcept(oldBoardRight, newBoardRight, "right");
proofOfConcept(oldBoardUp, newBoardUp, "up");
proofOfConcept(oldBoardDown, newBoardDown, "down");
