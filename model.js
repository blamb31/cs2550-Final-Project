//0 = empty
//1 = ship
//2 = miss
//3 = hit
let defaultGrid;
let playerTurn;
let gameOver;
let player;
let player2;
let hit = {
  row: null,
  col: null,
  initial: {
    row: null,
    col: null,
  },
  tried: {
    n: null,
    s: null,
    e: null,
    w: null,
  },
};
function drawStar(ctx) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(108, 0.0);
  ctx.lineTo(141, 70);
  ctx.lineTo(218, 78.3);
  ctx.lineTo(162, 131);
  ctx.lineTo(175, 205);
  ctx.lineTo(108, 170);
  ctx.lineTo(41.2, 205);
  ctx.lineTo(55, 131);
  ctx.lineTo(1, 78);
  ctx.lineTo(75, 68);
  ctx.lineTo(108, 0);
  ctx.closePath();
  ctx.fill();
}
function playAudio() {
  tigerAud = document.getElementById("tigerAudio");
  console.log(tigerAud);
  console.log(tigerAud.play);
  tigerAud.play();

  explosionVid = document.getElementById("explosionVid");
  console.log(explosionVid);
  explosionVid.play();
  var canvas = document.getElementById("canvas1");
  var c1 = canvas.getContext("2d");
  drawStar(c1);
  var canvas = document.getElementById("canvas2");
  var c2 = canvas.getContext("2d");
  drawStar(c2);
}
const body = document.getElementsByTagName("body");
console.log(body);
document.addEventListener("click", function () {
  console.log("The window loaded");
  playAudio();
});
function newGame() {
  const confirmNewGame = confirm(
    "You are about to start a new game with new boards. Are you sure you want to do this?"
  );
  if (confirmNewGame) {
    location.reload(true);
  }
}
function getSquare1Value(row, col) {
  if ((row || col) < 0 || (row || col) > 9) {
    return null;
  } else {
    return player.grid[row][col];
  }
}
function getSquare2Value(row, col) {
  return player2.grid[row][col];
}

function changeValue(row, col, value) {
  if (player.active) {
    player2.grid[row][col] = value;
  } else {
    player.grid[row][col] = value;
  }
  // let over = isGameOver(playerTurn);
  // if (over === true) {
  //   gameOver = true;
  // }
}

function changePlayerTurn() {
  let stop = checkIfGameOver();
  if (stop) {
    return;
  }
  if (player.active) {
    player.active = false;
    player2.active = true;
  } else {
    player.active = true;
    player2.active = false;
  }
  displayActivePlayer();

  if (player2.active) {
    aiMakeGuess();
  }
}

function checkIfGameOver() {
  let gO1 = false;
  let gO2 = false;
  gameOver = true;
  for (let row in player.grid) {
    for (let sq of player.grid[row]) {
      if (sq === 1) {
        gameOver = false;
      }
    }
  }
  if (gameOver) {
    gO1 = true;
  } else {
    gameOver = true;

    for (let row in player2.grid) {
      for (let sq of player2.grid[row]) {
        if (sq === 1) {
          gameOver = false;
        }
      }
    }
    if (gameOver) {
      gO2 = true;
    }
  }
  if (gameOver) {
    let el = document.getElementById("gameOver");
    if (gO1) {
      alert("GAME OVER - Computer has won. :(");
      el.innerHTML = "The Game is Over. Winner: Computer";
      return gameOver;
    }
    if (gO2) {
      alert("GAME OVER - Congratulations Player!! ");
      el.innerHTML = "The Game is Over. Winner: Player";
      return gameOver;
    }
  } else {
    return gameOver;
  }
}

function aiMakeGuess(dir = null) {
  setTimeout(function () {
    let guessCol, guessRow;
    //if there is a prev hit, then load that
    if (hit.row !== null && hit.row >= 0 && hit.col !== null && hit.col >= 0) {
      guessCol = hit.col;
      guessRow = hit.row;
    } else {
      //else get two random numbers
      guessRow = -1;
      guessCol = -1;
      while (guessRow < 0 || guessRow > 9) {
        guessRow = Math.round(Math.random() * 10);
      }
      while (guessCol < 0 || guessCol > 9) {
        guessCol = Math.round(Math.random() * 10);
      }
      let val = getSquare1Value(guessRow, guessCol);
      //if the random numbers are a hit, save them
      if (val === 1) {
        hit.row = guessRow;
        hit.col = guessCol;
        hit.initial.row = guessRow;
        hit.initial.col = guessCol;
      }
    }
    let val = getSquare1Value(guessRow, guessCol);

    let element = document.getElementById(
      `row${guessRow + 1}col${guessCol + 1}`
    );
    if (val === 0) {
      element.className = "miss space";
      element.innerHTML = "MISS";
      changeValue(guessRow, guessCol, 2);
    } else if (val === 1) {
      element.className = "hit space";
      element.innerHTML = "HIT";
      changeValue(guessRow, guessCol, 3);
      if (hit.tried.n === null || hit.tried.n === true) {
        //if n hasn't been tried (null), or is true and is in range and 1 north is not a hit or miss, move 1 n
        if (
          (hit.row - 1 >= 0 && getSquare1Value(hit.row - 1, hit.col) === 0) ||
          getSquare1Value(hit.row - 1, hit.col) === 1
        ) {
          hit.tried.n = true;
          hit.row--;
          if (getSquare1Value(hit.row, hit.col) === 0) {
            hit.tried.n = false;
            if (hit.initial.row + 1 <= 9) {
              hit.row = hit.initial.row + 1;
              hit.col = hit.initial.col;
              if (getSquare1Value(hit.row, hit.col) === 1) {
                hit.tried.s = true;
              } else {
                if (
                  getSquare1Value(hit.initial.row, hit.initial.col + 1) === 1
                ) {
                  hit.tried.s = false;
                  hit.tried.e = true;
                  hit.row = hit.initial.row;
                  hit.col = hit.initial.col + 1;
                } else {
                  hit.tried.s = false;
                  hit.tried.e = false;
                  hit.tried.w = true;
                  hit.tried.wfirst = true;
                  hit.row = hit.initial.row;
                  hit.col = hit.initial.col - 1;
                }
              }
            } else {
              if (
                hit.initial.col + 1 <= 9 &&
                getSquare1Value(hit.initial.row, hit.initial.col + 1) === 1
              ) {
                hit.col = hit.initial.col + 1;
                hit.row = hit.initial.row;
                hit.tried.s = false;
                hit.tried.e = true;
              } else {
                hit.col = hit.initial.col - 1;
                hit.row = hit.initial.row;
                hit.tried.s = false;
                hit.tried.e = false;
                hit.tried.w = true;
                hit.tried.wfirst = true;
              }
            }
          }
          return aiMakeGuess();
        } else {
          hit.tried.n = false;
          if (hit.initial.row + 1 <= 9) {
            if (
              getSquare1Value(hit.initial.row + 1, hit.initial.col) === 0 ||
              getSquare1Value(hit.initial.row + 1, hit.initial.col) === 1
            ) {
              if (getSquare1Value(hit.initial.row + 1, hit.initial.col) === 1) {
                hit.tried.s = true;
              } else {
                if (
                  getSquare1Value(hit.initial.row, hit.initial.col + 1) === 1
                ) {
                  hit.tried.s = false;
                  hit.tried.e = true;
                } else {
                  hit.tried.s = false;
                  hit.tried.e = false;
                  hit.tried.w = true;
                  hit.tried.wfirst = true;
                  hit.col = hit.initial.col - 1;
                }
              }
              hit.row = hit.initial.row + 1;
              return aiMakeGuess();
            }
          } else if (
            (hit.col + 1 <= 9 &&
              getSquare1Value(hit.initial.row, hit.initial.col + 1) === 0) ||
            getSquare1Value(hit.initial.row, hit.initial.col + 1) === 1
          ) {
            hit.col = hit.initial.col + 1;
            hit.row = hit.initial.row;
            if (
              getSquare1Value(hit.row, hit.col) === 0 ||
              getSquare1Value(hit.row, hit.col) === 0
            ) {
              hit.tried.s = false;
              hit.tried.e = false;
              hit.tried.w = true;
              hit.tried.wfirst = true;
            } else {
              hit.tried.s = false;
              hit.tried.e = true;
            }
            return aiMakeGuess();
          } else if (
            getSquare1Value(hit.initial.row, hit.initial.col - 1) === 0 ||
            getSquare1Value(hit.initial.row, hit.initial.col - 1) === 1
          ) {
            hit.tried.s = false;
            hit.tried.e = false;
            hit.tried.w = true;
            hit.tried.wfirst = true;
            hit.col = hit.initial.col - 1;
            return aiMakeGuess();
          } else {
            alert("a ship has been sunk");
            resetHit();
            return aiMakeGuess();
          }
        }

        // else if (dir ==='s')
      } else if (hit.tried.s === null || hit.tried.s === true) {
        if (hit.row < hit.initial.row) {
          hit.row = hit.initial.row + 1;
          hit.col = hit.initial.col;
        }
        let val = getSquare1Value(hit.row, hit.col);
        if (val === 1 || val === 3) {
          hit.row++;
          return aiMakeGuess();
        }
        alert("Ship has been sunk");
        resetHit();
        return aiMakeGuess();
      } else if (hit.tried.e === null || hit.tried.e === true) {
        // hit.row = hit.initial.row;
        // hit.col = hit.initial.col + 1;
        let val = getSquare1Value(hit.row, hit.col);
        if (val === 3) {
          hit.col++;
          if (getSquare1Value(hit.row, hit.col) === 2) {
            hit.tried.e = false;
            hit.tried.w = true;
            hit.tried.wfirst = true;
            hit.col = hit.initial.col - 1;
          }
          if (getSquare1Value(hit.row, hit.col) === 0) {
            hit.tried.e = false;
            hit.tried.w = true;
            hit.tried.wfirst = true;
            aiMakeGuess();
            hit.row = hit.initial.row;
            hit.col = hit.initial.col - 1;
            return;
          }
          return aiMakeGuess();
        } else {
          hit.col = hit.initial.col - 1;
          hit.tried.e = false;
          hit.tried.w = true;
          hit.tried.wfirst = true;
          return aiMakeGuess();
        }
      } else if (hit.tried.w === null || hit.tried.w === true) {
        // hit.row = hit.initial.row;
        // hit.col = hit.initial.col - 1;
        let val = getSquare1Value(hit.row, hit.col - 1);
        if (val === 1 || val === 3) {
          hit.col--;
          return aiMakeGuess();
        }
        alert("Ship has been Sunk");
        resetHit();
      }
    } else {
      // return aiMakeGuess();
      if (hit.row) {
        alert("Your ship has been sunk");
      }
      resetHit();
      return aiMakeGuess();
    }
    changePlayerTurn();
  }, 250);
}
function resetHit() {
  hit.tried.n = null;
  hit.tried.s = null;
  hit.tried.e = null;
  hit.tried.w = null;
  hit.col = null;
  hit.row = null;
  hit.initial.row = null;
  hit.initial.col = null;
}

hit.tried.wfirst = true;

function displayActivePlayer() {
  if (player.active) {
    const playerTurnDisp = document.getElementById("playerTurn");
    playerTurnDisp.innerHTML = ` Turn: Player`;
  } else {
    const playerTurnDisp = document.getElementById("playerTurn");
    playerTurnDisp.innerHTML = ` Turn: Computer`;
  }
}

function isGameOver(player) {
  let playerGrid;
  if (player === 1) {
    playerGrid = player.grid;
  } else {
    playerGrid = player2.grid;
  }
  for (let line in playerGrid) {
    for (let val in line) {
      if (val === 1) {
        return false;
      }
    }
  }
  return true;
}

function getPlayerTurn() {
  return playerTurn;
}

function getStartingInfo() {
  var request = new XMLHttpRequest();
  request.open("GET", "data.json", false);
  request.send(null);

  if (request.status != 200) {
    alert("Request failed " + request.status + ": " + request.statusText);
    return;
  }

  let startObjJSON = request.response;
  let startObj = JSON.parse(startObjJSON);
  let randomNum1 = -1;
  let randomNum2 = -1;
  while (randomNum1 < 0 || randomNum1 > 5) {
    randomNum1 = Math.round(Math.random() * 10);
  }
  while (randomNum2 < 0 || randomNum2 > 5) {
    randomNum2 = Math.round(Math.random() * 10);
    if (randomNum1 === randomNum2) {
      randomNum2 = -1;
    }
  }

  player = startObj.player;
  player.grid = startObj.grids[randomNum1];
  player2 = startObj.player2;
  player2.grid = startObj.grids[randomNum2];

  playerTurn = startObj.playerTurn;
  gameOver = startObj.gameOver;
}
