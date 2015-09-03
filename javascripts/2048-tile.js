var empty = "0";

// we will create a new tile when it enters the board
var Tile = function(tilePosition, tileValue) {
  this.oldRow = tilePosition[0];
  this.oldCol = tilePosition[1];
  this.newRow = this.oldRow;
  this.newCol = this.oldCol;
  this.oldValue = tileValue || 2; // NOTE this might be where we use the 2 v. 4 functionality
  this.newValue = this.oldValue;
}

Tile.prototype.findElement = function() {
  var tile = $("[data-row='r" + this.oldRow + "'][data-col='c" + this.oldCol + "']"); // grabs old tile element

  return tile;
}

// this method gets called by board.display()
Tile.prototype.slide = function() {
  // grab tile off page based on old position
  // change its attributes based on new position
  // update its old position to be its new position
  // we will prolly need to tag one of the collision tiles to know which one to keep

  var tile = this.findElement(); // grabs old tile element
  // add the attributes necessary for the tile to display in the right spot on the board
  if (tile.newValue != empty) {
    tile.attr("data-row", "r" + this.newRow);
    tile.attr("data-col", "c" + this.newCol);
    tile.attr("data-val", this.newValue);
    tile.text(this.newValue);
  }
}

Tile.prototype.remove = function() {
  var tile = this.findElement(); // grabs old tile element

  tile.remove();
}

Tile.prototype.collide = function() {
  this.slide().on("animationend", function() {
    this.remove();
  });
}

Tile.prototype.pop = function() {
  var tile = this.findElement();
  tile.addClass("pop").on("animationend", function() {
    tile.removeClass("pop");
  });
}
