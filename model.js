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

function getSquare1Value(row, col) {
  console.log({ row, col });
  if ((row || col) < 0 || (row || col) > 9) {
    return null;
  } else {
    return player.grid[row][col];
  }
  // console.log({ retVal, row, col });
}
function getSquare2Value(row, col) {
  return player2.grid[row][col];
  // console.log({ retVal, row, col });
}

function changeValue(row, col, value) {
  // console.log("inchangeval", row, col, value);
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
  console.log("player2 is active: ", player2.active);
  displayActivePlayer();

  if (player2.active) {
    aiMakeGuess();
  }
}

function checkIfGameOver() {
  let gO1 = false;
  let gO2 = false;
  gameOver = true;
  // console.log("p1");
  for (let row in player.grid) {
    // console.log({ row });
    for (let sq of player.grid[row]) {
      // console.log({ sq });

      if (sq === 1) {
        // console.log("THE GAME IS NOT OVER YET", gameOver);

        gameOver = false;
      }
    }
  }
  if (gameOver) {
    gO1 = true;
  } else {
    // console.log("ACTUALLY IT MIGHT BE OVER", gameOver);

    gameOver = true;
    // console.log("p2");

    for (let row in player2.grid) {
      // console.log({ row });

      for (let sq of player2.grid[row]) {
        // console.log({ sq });

        if (sq === 1) {
          // console.log("THE GAME IS NOT OVER YET", gameOver);
          gameOver = false;
        }
      }
    }
    // console.log("IS IT OVER???? ", gameOver);
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
    console.log("Making A guess");
    let guessCol, guessRow;
    //if there is a prev hit, then load that
    if (hit.row !== null && hit.row >= 0 && hit.col !== null && hit.col >= 0) {
      console.log("there is a prev hit", hit);
      // if (hit.tried.w === true) {
      //   console.log("going w");
      //   hit.row = hit.initial.row;
      //   hit.col = hit.initial.col - 1;
      // }

      guessCol = hit.col;
      guessRow = hit.row;
    } else {
      //else get two random numbers
      guessRow = -1;
      guessCol = -1;
      while (guessRow < 0 || guessRow > 9) {
        guessRow = Math.round(Math.random() * 10);
      }
      console.log({ guessRow });
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

    console.log({ val });
    let element = document.getElementById(
      `row${guessRow + 1}col${guessCol + 1}`
    );
    console.log({ element });
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
                  console.log("wfirst 1");
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
                console.log("wfirst 2");
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
                console.log("hit s");
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
                  console.log("wfirst 3");
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
              console.log("wfirst 4");
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
            console.log("wfirst 5");
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
        console.log("stating s");
        // setTimeout(function () {
        //   console.log(player);
        // }, 30000);
        if (hit.row < hit.initial.row) {
          hit.row = hit.initial.row + 1;
          hit.col = hit.initial.col;
        }
        let val = getSquare1Value(hit.row, hit.col);
        console.log("before while val = ", val, { row: hit.row, col: hit.col });
        if (val === 1 || val === 3) {
          hit.row++;
          return aiMakeGuess();
        }
        alert("Ship has been sunk");
        resetHit();
        return aiMakeGuess();
      } else if (hit.tried.e === null || hit.tried.e === true) {
        console.log("starting e");

        // hit.row = hit.initial.row;
        // hit.col = hit.initial.col + 1;
        let val = getSquare1Value(hit.row, hit.col);
        console.log("CHECKING VALUE ", { val });
        if (val === 3) {
          hit.col++;
          if (getSquare1Value(hit.row, hit.col) === 2) {
            console.log("THE VALUE IS 2");

            hit.tried.e = false;
            hit.tried.w = true;
            hit.tried.wfirst = true;
            console.log("wfirst 6");
            hit.col = hit.initial.col - 1;
          }
          if (getSquare1Value(hit.row, hit.col) === 0) {
            console.log("THE VALUE IS 0");
            hit.tried.e = false;
            hit.tried.w = true;
            hit.tried.wfirst = true;
            aiMakeGuess();
            hit.row = hit.initial.row;
            hit.col = hit.initial.col - 1;
            console.log("wfirst 7");
            return;
          }
          return aiMakeGuess();
        } else {
          hit.col = hit.initial.col - 1;
          hit.tried.e = false;
          hit.tried.w = true;
          hit.tried.wfirst = true;
          console.log("wfirst 8");
          return aiMakeGuess();
        }
      } else if (hit.tried.w === null || hit.tried.w === true) {
        console.log("starting w");
        // hit.row = hit.initial.row;
        // hit.col = hit.initial.col - 1;
        let val = getSquare1Value(hit.row, hit.col - 1);
        console.log("checking west", hit.row, hit.col - 1, val);
        if (val === 1 || val === 3) {
          hit.col--;
          return aiMakeGuess();
        }
        alert("Ship has been Sunk");
        resetHit();
        //   if (hit.initial.col - 1 >= 0) {
        //     hit.col--;
        //     if (
        //       getSquare1Value(hit.row, hit.col) !== 1 ||
        //       getSquare1Value(hit.row, hit.col)
        //     ) {
        //       resetHit();
        //       alert("A ship has been sunk");
        //       return aiMakeGuess();
        //     } else {
        //       return aiMakeGuess();
        //     }
        //   }
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
  }, 500);
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

// function aiMakeGuess(dir = null) {
//   setTimeout(function () {
//     console.log("Making A guess");
//     let guessCol, guessRow;
//     if (hit.row !== null && hit.row >= 0 && hit.col !== null && hit.col >= 0) {
//       console.log("there is a prev hit", hit);

//       guessCol = hit.col;
//       guessRow = hit.row;
//     } else {
//       guessRow = -1;
//       guessCol = -1;
//       while (guessRow < 0 || guessRow > 9) {
//         guessRow = Math.round(Math.random() * 10);
//       }
//       console.log({ guessRow });
//       while (guessCol < 0 || guessCol > 9) {
//         guessCol = Math.round(Math.random() * 10);
//       }
//       console.log({ guessRow, guessCol });
//       // if (
//       //   !(
//       //     getSquare1Value(guessRow, guessCol) === 0 ||
//       //     getSquare1Value(guessRow, guessCol) === 1
//       //   )
//       // ) {
//       //   guessRow = -1;
//       //   guessCol = -1;
//       // }
//     }
//     // else {
//     //   console.log("else hit");
//     //   guessRow = row;
//     //   guessCol = col;
//     // }

//     let val = getSquare1Value(guessRow, guessCol);
//     console.log({ val });
//     let element = document.getElementById(
//       `row${guessRow + 1}col${guessCol + 1}`
//     );
//     console.log({ element });
//     if (val === 0) {
//       element.className = "miss space";
//       element.innerHTML = "MISS";
//       changeValue(guessRow, guessCol, 2);
//     } else if (val === 1) {
//       element.className = "hit space";
//       element.innerHTML = "HIT";
//       changeValue(guessRow, guessCol, 3);
//     } else if (val == 2) {
//       // return aiMakeGuess();
//       return;
//     }

//     if (dir !== null && val !== 1) {
//       hit.tried[dir].tried = true;
//       hit.tried[dir].successful = false;
//     } else if (dir !== null && val === 1) {
//       hit.tried[dir].tried = true;
//       hit.tried[dir].successful = true;
//     }

//     if (val !== 1) {
//       changePlayerTurn();
//     } else {
//       console.log("again");
//       if (hit.initial.row === null && hit.initial.col === null) {
//         hit.initial.row = guessRow;
//         hit.initial.col = guessCol;
//         if (
//           guessRow - 1 >= 0 &&
//           (getSquare1Value(guessRow - 1, guessCol) === 0 ||
//             getSquare1Value(guessRow - 1, guessCol) === 1)
//         ) {
//           hit.row = guessRow - 1;
//           hit.col = guessCol;
//           if (getSquare1Value(hit.row, hit.col) === 1) {
//             hit.tried.n = true;
//           } else {
//             hit.tried.s = true;
//             hit.missed = true;
//           }
//         } else if (
//           guessRow + 1 <= 9 &&
//           (getSquare1Value(guessRow + 1, guessCol) === 0 ||
//             getSquare1Value(guessRow + 1, guessCol) === 1)
//         ) {
//           hit.row = guessRow + 1;
//           hit.col = guessCol;
//           if (getSquare1Value(hit.row, hit.col) === 1) {
//             hit.tried.s = true;
//           }
//         } else if (
//           guessCol + 1 <= 9 &&
//           (getSquare1Value(guessRow, guessCol + 1) === 0 ||
//             getSquare1Value(guessRow, guessCol + 1) === 1)
//         ) {
//           hit.row = guessRow;
//           hit.col = guessCol + 1;
//           if (getSquare1Value(hit.row, hit.col) === 1) {
//             hit.tried.e = true;
//           }
//         } else if (
//           guessCol - 1 >= 0 &&
//           (getSquare1Value(guessRow, guessCol - 1) === 0 ||
//             getSquare1Value(guessRow, guessCol - 1) === 1)
//         ) {
//           hit.row = guessRow;
//           hit.col = guessCol - 1;
//           if (getSquare1Value(hit.row, hit.col) === 1) {
//             hit.tried.w = true;
hit.tried.wfirst = true;
console.log("wfirst 1");
//           }
//         }
//       } else if (hit.tried.n) {
//         console.log("hihihi", { guessRow });
//         if (hit.missed) {
//           for (dir in hit.tried) {
//             if (hit.tried[dir]) {
//               if (dir === "n" && hit.initial.row + 1 <= 9) {
//                 guessCol = hit.initial.col;
//                 guessRow = hit.initial.row + 1;
//               }
//             }
//           }
//         } else if (
//           !hit.missed &&
//           guessRow - 1 >= 0 &&
//           (getSquare1Value(guessRow - 1, guessCol) === 0 ||
//             getSquare1Value(guessRow - 1, guessCol) === 1)
//         ) {
//           hit.row = guessRow - 1;
//           hit.col = guessCol;
//           if (getSquare1Value(hit.row, hit.col) === 0) {
//             hit.missed = true;
//           }
//         } else if (
//           getSquare1Value(hit.initial.row + 1, hit.initial.col) === 0 ||
//           getSquare1Value(hit.initial.row + 1, hit.initial.col) === 1
//         ) {
//           hit.row = hit.initial.row + 1;
//           hit.tried.n = false;
//           hit.tried.s = true;
//         }
//       } else if (hit.tried.s) {
//         console.log("hit s");
//         if (
//           guessRow + 1 <= 9 &&
//           (getSquare1Value(guessRow + 1, guessCol) === 0 ||
//             getSquare1Value(guessRow + 1, guessCol) === 1)
//         ) {
//           hit.row = guessRow + 1;
//           hit.col = guessCol;
//           if (getSquare1Value(guessRow + 1, guessCol) === 0) {
//             hit.col = null;
//             hit.row = null;
//             hit.initial.col = null;
//             hit.initial.row = null;
//             hit.tried.s = false;
//           }
//         } else {
//           while (guessRow < 0 || guessRow > 9) {
//             guessRow = Math.round(Math.random() * 10);
//           }
//           console.log({ guessRow });
//           while (guessCol < 0 || guessCol > 9) {
//             guessCol = Math.round(Math.random() * 10);
//           }
//         }
//       }

//       aiMakeGuess();
//     }
//   }, 1000);
// }

// function aiMakeGuessHit() {
//   let { row, col } = hit;

//   if (
//     (hit.tried.n.tried === false && row - 1 >= 0) ||
//     hit.tried.n.successful == true
//   ) {
//     console.log("n");
//     hit.row = row - 1;

//     aiMakeGuess("n");
//   } else if (
//     (hit.tried.s.tried === false && row + 1 <= 9) ||
//     hit.tried.s.successful == true
//   ) {
//     console.log("s");
//     hit.row = row + 1;

//     aiMakeGuess("s");
//   } else if (
//     (hit.tried.e.tried === false && col + 1 <= 9) ||
//     hit.tried.e.successful == true
//   ) {
//     console.log("e");
//     hit.col = col + 1;

//     aiMakeGuess("e");
//   } else if (
//     (hit.tried.w.tried === false && col - 1 >= 0) ||
//     hit.tried.w.successful == true
//   ) {
//     console.log("w");
//     hit.col = col - 1;

//     aiMakeGuess("w");
//   }
// }

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

  // THE FOLLOWING CHECK CAN BE COMMENTED OUT WHEN USED
  // WITH A LOCAL FILE (DEPENDING ON YOUR BROWSER).  SAFARI ON A
  // MAC RETURNS A STATUS OF ZERO WHEN USING XMLHttpRequest WITH
  // A LOCAL FILE.

  if (request.status != 200) {
    alert("Request failed " + request.status + ": " + request.statusText);
    return;
  }

  let startObjJSON = request.response;
  let startObj = JSON.parse(startObjJSON);
  let randomNum1 = -1;
  let randomNum2 = -1;
  console.log("hithit", startObj);
  while (randomNum1 < 0 || randomNum1 > 5) {
    randomNum1 = Math.round(Math.random() * 10);
  }
  while (randomNum2 < 0 || randomNum2 > 5) {
    randomNum2 = Math.round(Math.random() * 10);
    console.log(randomNum1, randomNum2);
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

  // THE FOLLOWING CODE USES THE SAME XML STRUCTURE (AND A FEW OF THE
  // SAME VARIABLE NAMES) AS Example 21-7 IN JavaScript: The Definitive Guide
  // BY DAVID FLANAGAN, BUT THIS EXAMPLE IS A LOT SIMPLER.

  // var xmlrows = xmldoc.getElementsByTagName("contact");

  // for (var r = 0; r < xmlrows.length; r++) {
  //   var xmlrow = xmlrows[r];
  //   html += "Name: " + xmlrow.getAttribute("name");

  //   // NOTE THAT getElementsByTagName RETURNS A LIST
  //   var xemail = xmlrow.getElementsByTagName("email")[0];
  //   html += " Email: " + xemail.firstChild.data;

  //   html += "<br>";
  // }

  // addressDiv.innerHTML = html;
}
