let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let restart = document.getElementById("restart");
restart.addEventListener("click", restartGame);
let undoButton = document.getElementById("undo");
undoButton.addEventListener("click", () => {
  console.log("Last move unndone...");
  undoMove();
});
let turnDisplay = document.getElementById("turn-display");
let gameBoard = new BigBoard();
let turn = 1;
let activeBoard = -1;
let gameOver = false;
let moves = [];

const MARGINS = canvas.width / 30;
const BOARD_RADIUS = 0.025 * canvas.width;
const BOARD_SPACING = 0.015 * canvas.width;

let canvasPosition;

function setup() {
  window.requestAnimationFrame(loop);
  canvasPosition = canvas.getBoundingClientRect();
  canvas.addEventListener("click", onClick);
  window.addEventListener("resize", () => {
    canvasPosition = canvas.getBoundingClientRect();
  });
  turnDisplay.innerHTML = "Turn: " + (turn == 1 ? "X" : "O");
}

function undoMove() {
  let lastMove = moves[moves.length - 1];
  gameBoard.makeMove(0, lastMove.boardX, lastMove.boardY);
  gameBoard.boards[lastMove.boardX][lastMove.boardY].makeMove(
    0,
    lastMove.innerX,
    lastMove.innerY
  );
  turn = lastMove.turn;
  activeBoard = lastMove.activeBoard;
  turnDisplay.innerHTML = "Turn: " + (turn == 1 ? "X" : "O");
  moves.pop();
}

function restartGame() {
  gameBoard = new BigBoard();
  turn = 1;
  turnDisplay.innerHTML = "Turn: " + (turn == 1 ? "X" : "O");
  activeBoard = -1;
  gameOver = false;
}

function onClick(e) {
  if (!gameOver) {
    let domPos = {
      x: (e.pageX - canvasPosition.left) / canvasPosition.width,
      y: (e.pageY - canvasPosition.top) / canvasPosition.height,
    };

    let gameSize = {
      width: canvas.width - 2 * MARGINS,
      height: canvas.height - 2 * MARGINS,
    };
    let pos = {
      x: (domPos.x * canvas.width - MARGINS) / gameSize.width,
      y: (domPos.y * canvas.height - MARGINS) / gameSize.height,
    };

    let miniPos = {};
    if (pos.x < 1 / 3) {
      miniPos.x =
        (pos.x * gameSize.width - 20) /
        (gameSize.width / 3 - 40 - BOARD_SPACING);
    } else if (pos.x < 2 / 3) {
      miniPos.x =
        ((pos.x - 1 / 3) * gameSize.width - 20 - BOARD_SPACING * 0.5) /
        (gameSize.width / 3 - 40 - BOARD_SPACING);
    } else {
      miniPos.x =
        ((pos.x - 2 / 3) * gameSize.width - 20 - BOARD_SPACING) /
        (gameSize.width / 3 - 40 - BOARD_SPACING);
    }
    if (pos.y < 1 / 3) {
      miniPos.y =
        (pos.y * gameSize.height) /
        (gameSize.height / 3 - 40 - BOARD_SPACING);
    } else if (pos.y < 2 / 3) {
      miniPos.y =
        ((pos.y - 1 / 3) * gameSize.height - BOARD_SPACING * 0.5) /
        (gameSize.height / 3 - 40 - BOARD_SPACING);
    } else {
      miniPos.y =
        ((pos.y - 2 / 3) * gameSize.height - BOARD_SPACING) /
        (gameSize.height / 3 - 40 - BOARD_SPACING);
    }

    let bCoord = {
      i: Math.floor(pos.x * 3),
      j: Math.floor(pos.y * 3),
    };
    let coord = {
      i: Math.floor(miniPos.x * 3),
      j: Math.floor(miniPos.y * 3),
    };
    let boardSelected = gameBoard.boards[bCoord.i][bCoord.j];
    if (
      boardSelected.winner == 0 &&
      boardSelected.boardState[coord.i][coord.j] == 0 &&
      (activeBoard == bCoord.i + bCoord.j * 3 || activeBoard == -1)
    ) {
      console.log(
        (turn == 1 ? "X" : "O") +
          " placed at position " +
          coord.i +
          ", " +
          coord.j +
          " on board " +
          bCoord.i +
          ", " +
          bCoord.j
      );
      moves.push({
        turn: turn,
        boardX: bCoord.i,
        boardY: bCoord.j,
        innerX: coord.i,
        innerY: coord.j,
        activeBoard: activeBoard,
      });
      let boardWinner = boardSelected.makeMove(turn, coord.i, coord.j);
      if (boardWinner !== null && boardWinner !== 0) {
        let winner = gameBoard.makeMove(boardWinner, bCoord.i, bCoord.j);
        if (winner !== null && winner !== 0) {
          gameOver = true;
          activeBoard = -1;
          console.log((winner == 1 ? "X" : "O") + " wins!");
        }
      }

      turn = turn == 1 ? -1 : 1;
      turnDisplay.innerHTML = "Turn: " + (turn == 1 ? "X" : "O");
      if (
        gameBoard.boards[coord.i][coord.j].winner == 0 &&
        gameBoard.winner == 0
      )
        activeBoard = coord.i + coord.j * 3;
      else activeBoard = -1;
    }
  }
}

function loop() {
  // draw background
  ctx.beginPath();
  ctx.fillStyle = "rgb(25, 20, 20)";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fill();

  ctx.fillStyle = "rgb(40, 35, 35)";
  gameBoard.show(
    ctx,
    MARGINS,
    MARGINS,
    canvas.height - 2 * MARGINS,
    canvas.height - 2 * MARGINS,
    BOARD_RADIUS,
    BOARD_SPACING
  );

  if (gameBoard.winner == 1) {
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.moveTo(3 * MARGINS, 3 * MARGINS);
    ctx.lineTo(canvas.width - 3 * MARGINS, canvas.height - 3 * MARGINS);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(3 * MARGINS, canvas.height - 3 * MARGINS);
    ctx.lineTo(canvas.width - 3 * MARGINS, 3 * MARGINS);
    ctx.stroke();
  } else if (gameBoard.winner == -1) {
    ctx.lineWidth = 30;
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2 - 3 * MARGINS,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }

  if (activeBoard >= 0 && activeBoard <= 8) {
    ctx.beginPath();
    ctx.strokeStyle = "rgb(250, 100, 80)";
    ctx.lineWidth = 2;
    let origin = {
      x:
        MARGINS -
        10 +
        ((activeBoard % 3) * 20) / 3 +
        ((activeBoard % 3) * (canvas.width - 2 * MARGINS)) / 3,
      y:
        MARGINS -
        10 +
        (Math.floor(activeBoard / 3) * 20) / 3 +
        (Math.floor(activeBoard / 3) * (canvas.height - 2 * MARGINS)) / 3,
    };
    ctx.moveTo(origin.x + 20, origin.y);
    ctx.lineTo(origin.x + (canvas.width - MARGINS * 2 + 20) / 3 - 20, origin.y);
    ctx.arc(
      origin.x + (canvas.width - MARGINS * 2 + 20) / 3 - 20,
      origin.y + 20,
      20,
      1.5 * Math.PI,
      2 * Math.PI
    );
    ctx.lineTo(
      origin.x + (canvas.width - MARGINS * 2 + 20) / 3,
      origin.y + (canvas.height - MARGINS * 2 + 20) / 3 - 20
    );
    ctx.arc(
      origin.x + (canvas.width - MARGINS * 2 + 20) / 3 - 20,
      origin.y + (canvas.height - MARGINS * 2 + 20) / 3 - 20,
      20,
      0,
      0.5 * Math.PI
    );
    ctx.lineTo(
      origin.x + 20,
      origin.y + (canvas.height - MARGINS * 2 + 20) / 3
    );
    ctx.arc(
      origin.x + 20,
      origin.y + (canvas.height - MARGINS * 2 + 20) / 3 - 20,
      20,
      0.5 * Math.PI,
      Math.PI
    );
    ctx.lineTo(origin.x, origin.y + 20);
    ctx.arc(origin.x + 20, origin.y + 20, 20, Math.PI, 1.5 * Math.PI);
    ctx.stroke();
  }

  window.requestAnimationFrame(loop);
}

setup();
