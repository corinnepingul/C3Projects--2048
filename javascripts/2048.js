$(document).ready(function() {
  // declare a mystical global board
  // exist, board!
  var board = new Board([
    [new Tile ([0,0], empty), new Tile ([0,1], empty), new Tile ([0,2], empty), new Tile([0,3])],
    [new Tile ([1,0], empty), new Tile ([1,1], empty), new Tile ([1,2], empty), new Tile ([1,3], empty)],
    [new Tile ([2,0], empty), new Tile([2, 1]), new Tile ([2,2], empty), new Tile ([2,3], empty)],
    [new Tile ([3,0], empty), new Tile ([3,1], empty), new Tile ([3,2], empty), new Tile ([3,3], empty)]
  ]);

  // now exist on the screen, board!
  board.setup();
  console.log('ready, should be displayed!');

  $('body').keydown(function(event){
    var arrow_keys = [37, 38, 39, 40];
    if(arrow_keys.indexOf(event.which) > -1) {
      var tile = $('.tile');
      moveTile(tile, event.which);
      event.preventDefault();
    }
  })
})

// question: why is this ouside of document.ready & does it need to be?
// why asking: mystical global board could be mystical slightly less global board inside document.ready
// current workaround: mystical global board is passed into moveTile function
function moveTile(tile, direction, board) {
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
