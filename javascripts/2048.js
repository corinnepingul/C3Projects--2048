$(document).ready(function() {
  // declare a mystical global board
  // exist, board!
  var board = new Board([
    [
      new Tile([0,0]),
      new Tile([0,1], 4),
      new Tile([0,2], Tile.empty),
      new Tile([0,3])
    ],
    [
      new Tile([1,0], 4),
      new Tile([1,1], 8),
      new Tile([1,2], 16),
      new Tile([1,3], 8)
    ],
    [
      new Tile([2,0], 32),
      new Tile([2, 1]),
      new Tile([2,2], 128),
      new Tile([2,3], 512)
    ],
    [
      new Tile([3,0], 16),
      new Tile([3,1], Tile.empty),
      new Tile([3,2], Tile.empty),
      new Tile([3,3], Tile.empty)
    ]
  ]);

  // now exist on the screen, board!
  board.setup();
  console.log('ready, should be displayed!');

  $('body').keydown(function(event){
    var arrow_keys = [37, 38, 39, 40];
    if(arrow_keys.indexOf(event.which) > -1) {
      moveTile(event.which, board);
      event.preventDefault();
    }
  })
})

// question: why is this ouside of document.ready & does it need to be?
// why asking: mystical global board could be mystical slightly less global board inside document.ready
// current workaround: mystical global board is passed into moveTile function
function moveTile(direction, board) {
  switch(direction) {
    case 38: // up
      board.move("up");
      break;
    case 40: // down
      board.move("down");
      break;
    case 37: // left
      board.move("left");
      break;
    case 39: // right
      board.move("right");
      break;
  }
}
