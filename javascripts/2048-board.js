// Board constructor function
var Board = function(boardArray) {
  this.board = boardArray;
  this.boardLength = 4; // board is a square, so this is the same going both ways
};

// Board.prototype.emptyTile = function(row, column) {
//   return new Tile([row, column], empty);
// }


// this function sets up the initial div elements for the board display
Board.prototype.setup = function() {
  var gameboard = $("#gameboard");
  var that = this;
  this.board.forEach(function(row) {
    row.forEach(function(tile) {
      if (tile.oldValue != Tile.empty)
        that.addTile(tile, gameboard);
    });
  });
}

Board.prototype.addTile = function(tile, gameboard) {
  var div = $('<div></div>');
  div.addClass('tile');
  div.attr("data-row", "r" + tile.oldRow);
  div.attr("data-col", "c" + tile.oldCol);
  div.attr("data-val", tile.oldValue);
  div.text(tile.oldValue);

  gameboard.append(div);
}


Board.prototype.display = function() {
  var gameboard = $("#gameboard");
  // mark all the tiles as old, so we know which ones need to be removed later

  var tileNewValues = function(tile) {
    return tile.newValue;
  }

  var tileOldValues = function(tile) {
    return tile.oldValue;
  }

  var bd = this.board // we can delete this before the final PR, but in the mean
  // time it's nice to be able to open the console and see the current
  // iteration of the board!
  console.log("here are the old values:")
  console.log(bd[0].map(tileOldValues));
  console.log(bd[1].map(tileOldValues));
  console.log(bd[2].map(tileOldValues));
  console.log(bd[3].map(tileOldValues));

  console.log("here are the new values:")
  console.log(bd[0].map(tileNewValues));
  console.log(bd[1].map(tileNewValues));
  console.log(bd[2].map(tileNewValues));
  console.log(bd[3].map(tileNewValues));
}

// board.move("left")
// this is the movement controlling function that calls each step until a move is complete
Board.prototype.move = function(direction) {
  // make this, which is the board object .move is being called on, available to inner scopes
  var that = this;

  // 1. reorient function => array of arrays in columns or rows
  this.reorient(direction);

  // this.board.forEach(function(row) {
  //
  // });

  var resolvedBoard = this.board.map(function(currentRow) {
    // 2. each row/column condense function
    var condensedRow = that.condense(currentRow, direction);
    // 3. each row/column => compare function
    that.compareAndResolve(condensedRow, direction);
  });

  // 4. add empty tiles until row is full again
  this.uncondense(direction);

  // 5. reorient board back to original orientation
  this.reorient(direction);

  // 4. build new board from results (takes in array of condensed arrays, returns array of uncondensed arrays)
  // this.build(resolvedBoard, direction);
  this.updateTilePositions();

  // 5. display board
  this.display();
}

// board.reorient("down")
// reorients the board into arrays based on direction
Board.prototype.reorient = function(direction) {
  if (direction == "up" || direction == "down") {
    return this.verticalReorient();
  }
};

// board.verticalReorient()
// this function returns the board twisted 90 degrees, so we can traverse up/down along individual arrays
Board.prototype.verticalReorient = function() {
  var reorientedBoard = [];

  for (var oldCol = 0; oldCol < this.boardLength; oldCol++) {
    var newRow = [];

    for (var oldRow = 0; oldRow < this.boardLength; oldRow++) {
      newRow.push(this.board[oldRow][oldCol]);
    };

    reorientedBoard.push(newRow);
  };

  this.board = reorientedBoard;
};

// this method swaps the values of both tiles and updates the positions accordingly
Board.prototype.swap = function(firstIndex, secondIndex) {
  var tempFirst = row[firstIndex];
  var tempSecond = row[secondIndex];
  row[firstIndex] = row[secondIndex];
  row[firstIndex].newRow = tempFirst.oldRow;
  row[firstIndex].newCol = tempFirst.oldCol;
  row[secondIndex] = tempFirst;
  row[secondIndex].newRow = tempSecond.oldRow;
  row[secondIndex].newCol = tempSecond.oldCol;
}

// board.condense([2, 0, 0, 0], direction) // => [2]
// this function condenses empty tiles out of a row
Board.prototype.condense = function(colOrRow, direction) {
  var row = colOrRow.slice();

  var swap = function(firstIndex, secondIndex) {
    // this method swaps both the values and updates the positions of the tiles
    var tempFirst = row[firstIndex];
    var tempSecond = row[secondIndex];
    row[firstIndex] = row[secondIndex];
    row[firstIndex].newRow = tempFirst.oldRow;
    row[firstIndex].newCol = tempFirst.oldCol;
    row[secondIndex] = tempFirst;
    row[secondIndex].newRow = tempSecond.oldRow;
    row[secondIndex].newCol = tempSecond.oldCol;
  }

  if (direction == "left" || direction == "up") {
    // go backwards
    for (var i = (row.length - 1); i > 0; i--) {
      if (row[i].oldValue != Tile.empty && row[i - 1].oldValue == Tile.empty) {
        swap(i, i - 1);
      }
    }
  } else { // right or down
    // go forwards
    for (var j = 0; j < (row.length - 1); j++) {
      if (row[j].oldValue != Tile.empty && row[j + 1].oldValue == Tile.empty) {
        swap(j, j + 1);
      }
    }
  }

  return row;
}

// board.compareAndResolve([2, 2, 4], "left") // => board.moveForward([2, 2, 4])
// this function determines whether a row needs to be traversed forward or
// backward and sends the row along to the function that will do the traversal.
Board.prototype.compareAndResolve = function(condensedColOrRow, direction) {
  if (direction == "up" || direction == "left") {
    // should start at the beginning of the array & move forward
    return this.moveForward(condensedColOrRow, direction);
  } else { // down & right
    // should start at the end of the array & move backward
    // or we can reverse, use moveForward, & reverse again :)
    condensedColOrRow.reverse();// [2, 4, 4, 4].reverse() => [4, 4, 4, 2]
    this.moveForward(condensedColOrRow, direction); // board.moveForward([4, 4, 4, 2]) // => [8, 4, 2]
    condensedColOrRow.reverse(); // [2, 4, 8]
    return;
  }
}

// board.moveForward([2, 4, 4, 4]) // => [2, 8, 4]
// this function traverses through a row, collapsing same-number pairs along the way
Board.prototype.moveForward = function(condensedColOrRow, direction) {
  for (i = 0; i < condensedColOrRow.length; i++) {
    var currentTile = condensedColOrRow[i];
    var nextTile = condensedColOrRow[i + 1];

    if (currentTile.oldValue == Tile.empty) {
      break; // there are no more tiles with values left
    }

    if (currentTile.oldValue == nextTile.oldValue) {
      // slide the nextTile into the current Tile's location
      // then delete the nexttile
      // add a new tile (or update the first) -- this will pop into existence
      if (i + 2 < this.boardLength) {
        var firstTile = condensedColOrRow[i + 2];

        if (i + 3 < this.boardLength) {
          // we have two tiles to adjust
          var secondTile = condensedColOrRow[i + 3];

          secondTile.newRow = firstTile.newRow;
          secondTile.newCol = firstTile.newCol;
        }

        firstTile.newRow = nextTile.newRow;
        firstTile.newCol = nextTile.newCol;
      }

      nextTile.newRow = currentTile.newRow;
      nextTile.newCol = currentTile.newCol;

      nextTile.collide();

      currentTile.newValue = currentTile.oldValue * 2;
      currentTile.pop();

      this.updateScore(newTile);

      // this removes nextTile from the array
      condensedColOrRow.splice(i + 1, 1);
    } else {
      currentTile.slide();
    }
  }
}

// board.moveForward([2, 4, 4, 4]) // => [2, 8, 4]
// this function traverses through a row, collapsing same-number pairs along the way
Board.prototype.moveForward = function(condensedColOrRow, direction) {
  for (i = 0; i < condensedColOrRow.length; i++) {
    var currentTile = condensedColOrRow[i];
    var nextTile = condensedColOrRow[i + 1];

    if (currentTile.oldValue == Tile.empty) {
      break; // there are no more tiles with values left
    }

    if (currentTile.oldValue == nextTile.oldValue) {
      // slide the nextTile into the current Tile's location
      // then delete the nexttile
      // add a new tile (or update the first) -- this will pop into existence
      if (i + 2 < this.boardLength) {
        var firstTile = condensedColOrRow[i + 2];

        if (i + 3 < this.boardLength) {
          // we have two tiles to adjust
          var secondTile = condensedColOrRow[i + 3];

          secondTile.newRow = firstTile.newRow;
          secondTile.newCol = firstTile.newCol;
        }

        firstTile.newRow = nextTile.newRow;
        firstTile.newCol = nextTile.newCol;
      }

      nextTile.newRow = currentTile.newRow;
      nextTile.newCol = currentTile.newCol;

      nextTile.collide();

      currentTile.newValue = currentTile.oldValue * 2;
      currentTile.pop();

      this.updateScore(newTile);

      // this removes nextTile from the array
      condensedColOrRow.splice(i + 1, 1);
    } else {
      currentTile.slide();
    }
  }
}

Board.prototype.updateScore = function(points) {
  // this will somehow update the total score the player has going
}

Board.prototype.uncondense = function(direction) {
  for (var row = 0; row < this.boardLength; row++) {
    for (var column = 0; column < this.boardLength; column++) {
      if (!this.board[row][column]) {
        var tile;

        if (direction == "left" || direction == "right") {
          tile = this.emptyTile(row, column, Tile.empty());
        } else { // direction == "up" || "down"
          tile = this.emptyTile(column, row, Tile.empty());
        };

        if (direction == "left" || direction == "up") {
          this.board[row].push(tile);
        } else { // direction == "right" || direction == "down"
          this.board[row].unshift(tile);
        };

        this.addTile(tile);
      }
    }
  }
}

Board.prototype.build = function(condensedArrays, direction, oldBoard) {
  // all this emptySpots stuff is setup for the new tile event function
  var emptySpots = []; // this will eventually be a set of [row, column] positions for all the 0s / empty spots
  var boardLength = this.boardLength;
  var emptyTile = Tile.empty;

  var rebuild = function(array, currentRow) { // currentRow is for emptySpots positions
    while (array.length < boardLength) {
      if (direction == "left" || direction == "up") {
        // [2, 4] & we're about to push in Tile.empty at index 2
        currentColumn = array.length; // currentColumn is for emptySpots positions
        array.push(emptyTile);
      } else { // "right" || "down"
        // [2, 4] & we're about to unshift in Tile.empty at eventual index 1 (4 - 2 - 1 == 1)
        currentColumn = boardLength - array.length - 1; // currentColumn is for emptySpots positions
        array.unshift(emptyTile);
      }; // see ya, if

      emptySpots.push([currentRow, currentColumn]); // tell emptySpots where we just filled in an empty tile
    } // see ya, while
    return array;
  } // see ya, rebuild()

  extendedArrays = [];
  for (var currentRow = 0; currentRow < boardLength; currentRow++) {
    var extendedRow = rebuild(condensedArrays[currentRow], currentRow); // this reminds me of ruby's .each_with_index...
    extendedArrays.push(extendedRow);
  } // see ya, for

  this.board = extendedArrays; // NOTE this is mutating the original board

  // call new tile event here
  // NOTE this needs to happen BEFORE the board is reoriented, because the
  // positions created above are based on the current orientation
  if (oldBoard.toString() != this.board.toString()) {
    this.newTile(emptySpots);
  };

  // twisting the board back to its original orientation
  this.board = this.reorient(direction); // NOTE this is mutating the original board
}

Board.prototype.newTile = function(emptySpots) {
  // pick a location to insert the new tile at
  var randomIndex = Math.floor(Math.random() * (emptySpots.length));
  newTileLocation = emptySpots[randomIndex];
  newTileRow = newTileLocation[0];
  newTileColumn = newTileLocation[1];

  // pick what new tile to insert
  var chanceOfFour = 0.15; // 15% chance of four
  var diceRoll = Math.random();
  var newTileValue = (diceRoll > chanceOfFour) ? 2 : 4;

  this.board[newTileRow][newTileColumn] = newTileValue;
}

Board.prototype.updateTilePositions = function() {
  this.board.forEach(function(row) {
    row.forEach(function(tile) {
      tile.oldRow = tile.newRow;
      tile.oldColumn = tile.newColumn;
    })
  });
}
