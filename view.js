function genHTML(rows = 10, cols = 11) {
  let newEl;
  let anotherEl;
  let targetEl = document.getElementById("gameTable");
  getStartingInfo();

  for (let i = 0; i < rows; i++) {
    newEl = document.createElement("tr");
    newEl.className = "tableRow";
    // newEl.appendChild(document.createTextNode(""));
    newEl.id = `row${i}`;
    for (let j = 0; j < cols; j++) {
      if (j == 0) {
        anotherEl = document.createElement("td");
        anotherEl.appendChild(document.createTextNode(i + 1));
      } else if (j > 0) {
        anotherEl = document.createElement("td");
        const content = getSquare1Value(i, j - 1, 1);
        anotherEl.id = `row${i + 1}col${j}`;

        if (content == 0) {
          anotherEl.className = "empty space";
          anotherEl.appendChild(document.createTextNode(" "));
        } else if (content == 1) {
          anotherEl.appendChild(document.createTextNode("Ship"));
          anotherEl.className = "ship space";
        } else if (content == 2) {
          anotherEl.appendChild(document.createTextNode("MISS"));
          anotherEl.className = "miss space";
        } else if (content == 3) {
          anotherEl.appendChild(document.createTextNode("HIT"));
          anotherEl.className = "hit space";
        }
        anotherEl.appendChild(document.createTextNode(" "));
      }
      targetEl.appendChild(anotherEl);
    }
    targetEl.appendChild(newEl);
  }
  displayActivePlayer();

  let newEl2;
  var anotherEl2;
  const targetEl2 = document.getElementById("gameTable2");

  for (let i = 0; i < rows; i++) {
    newEl2 = document.createElement("tr");
    newEl2.className = "tableRow";
    newEl2.id = `row${i}`;

    for (let j = 0; j < cols; j++) {
      if (j == 0) {
        anotherEl2 = document.createElement("td");
        anotherEl2.appendChild(document.createTextNode(i + 1));
      } else if (j > 0) {
        anotherEl2 = document.createElement("td");
        anotherEl2.id = `row${i + 1}col${j}`;
        addOnClick(anotherEl2, i + 1, j, targetEl2, 2);

        anotherEl2.className = "empty space";
        anotherEl2.appendChild(document.createTextNode(" "));

        anotherEl2.appendChild(document.createTextNode(" "));
      }
      targetEl2.appendChild(anotherEl2);
    }
    targetEl2.appendChild(newEl2);
  }
  // playAudio();
}

function addOnClick(element, row, col, targetEl, forGrid) {
  element.addEventListener("click", (event) => {
    let val = 0;
    if (forGrid === 1) {
      val = getSquare1Value(row - 1, col - 1);
    } else if (forGrid === 2) {
      val = getSquare2Value(row - 1, col - 1);
    }
    if (val === 0) {
      element.className = "miss space";
      element.innerHTML = "MISS";
      changeValue(row - 1, col - 1, 2);
    } else if (val === 1) {
      element.className = "hit space";
      element.innerHTML = "HIT";
      changeValue(row - 1, col - 1, 3);
      let isSunk = isShipSunk(row - 1, col - 1);
      if (isSunk) {
        alert("You have sunk a ship of the computer's!!");
      }
      let stop = checkIfGameOver();
      if (stop) {
        return;
      }
    }
    if (val === 0) {
      changePlayerTurn();
    }
  });
}

function displayMessage(message = "", row, col, targetEl) {
  const messageBox = document.createElement("h3");
  message.id = "messageBox";
  messageBox.appendChild(
    document.createTextNode(`Clicked Cell is Row: ${row}, Column: ${col}`)
  );
  targetEl.appendChild(messageBox);
}

function addName() {
  nameField = document.getElementById("nameInput").value;
  title = document.getElementById("pageTitle");
  title.innerHTML = `${nameField}'s Battle Ship Game`;
}

function colorPick(event) {
  const { value } = event.target;
  alert(
    `${
      value.charAt(0).toUpperCase() + value.slice(1)
    } has been selected as your color`
  );
  const table = document.getElementById("gameTable");
  const ships = table.getElementsByClassName("space");
  if (value == "green") {
    for (const ship of ships) {
      if (ship.className.includes("ship")) {
        ship.className = "shipGreen space";
      }
    }
  }
  if (value == "orange") {
    for (const ship of ships) {
      if (ship.className.includes("ship")) {
        ship.className = "shipOrange space";
      }
    }
  }
  if (value == "blue") {
    for (const ship of ships) {
      if (ship.className.includes("ship")) {
        ship.className = "shipBlue space";
      }
    }
  }
}

var botImg, msPerFrame, frameCount, moveDist, shipDivWidth;
var botLeft;
var margin = 10;

function startMove() {
  botImg = document.getElementById("shipImg");

  moveDist = 500;
  const eachMove = 20;

  var shipDiv = document.getElementById("shipDiv");
  setTimeout(() => moveBot(eachMove, moveDist), 500);
}

function moveBot(eachMove, moveLeft, position = 0) {
  setTimeout(() => {
    position += eachMove;
    moveLeft -= eachMove;
    botImg.style.right = position + "px";

    if (moveLeft > eachMove) {
      return moveBot(eachMove, moveLeft, position);
    }
  }, 250);
}

function loginFunc() {
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  usernameval = username.value;
  passwordval = password.value;
  let loginName = "testName";
  let timestamp = new Date();
  timestamp = String(timestamp);
  let LocalStorageObj = `${usernameval} ${timestamp}`;
  localStorage.setItem("cs2550timestamp", LocalStorageObj);
}

function postUsername() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  const usernameString = "userName=" + username;
  const passwordString = "password=" + password;
  const data = `${usernameString}&${passwordString}`;
  var localRequest = new XMLHttpRequest();

  localRequest.open(
    "POST",
    "http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php",
    false
  );
  localRequest.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  localRequest.send(data);

  if (localRequest.status == 200) {
    var responseJson = JSON.parse(localRequest.responseText);
    if (responseJson.result === "valid") {
      let { userName, timestamp } = responseJson;

      let saveStr = `${userName} ${timestamp}`;
      localStorage.setItem("cs2550timestamp", saveStr);

      window.location.assign("./grid.html");
    } else {
      errorDisp = document.getElementById("error");
      errorDisp.innerHTML = "Username or Password was incorrect";
    }
  }
}

function clearLocal() {
  localStorage.clear();
}
