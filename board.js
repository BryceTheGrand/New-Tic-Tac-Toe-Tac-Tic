class Board {
  constructor() {
    this.boardState = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    this.winner = 0;
  }

  show(context, xOffset, yOffset, width, height, radius, padding) {
    if (padding === undefined) padding = 20;
    if (radius === undefined) radius = 10;

    // background
    context.beginPath();
    context.moveTo(xOffset + radius, yOffset);
    context.lineTo(xOffset + width - radius, yOffset);
    context.arc(
      xOffset + width - radius,
      yOffset + radius,
      radius,
      1.5 * Math.PI,
      2 * Math.PI
    );
    context.lineTo(xOffset + width, yOffset + height - radius);
    context.arc(
      xOffset + width - radius,
      yOffset + height - radius,
      radius,
      0,
      0.5 * Math.PI
    );
    context.lineTo(xOffset + radius, yOffset + height);
    context.arc(
      xOffset + radius,
      yOffset + height - radius,
      radius,
      0.5 * Math.PI,
      Math.PI
    );
    context.lineTo(xOffset, yOffset + radius);
    context.arc(
      xOffset + radius,
      yOffset + radius,
      radius,
      Math.PI,
      1.5 * Math.PI
    );
    context.fill();

    // draw lines
    context.strokeStyle = "rgba(250, 245, 240, 0.6)";
    context.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      context.beginPath();
      context.moveTo(
        xOffset + padding,
        yOffset + padding + ((i + 1) * (height - 2 * padding)) / 3
      );
      context.lineTo(
        xOffset + width - padding,
        yOffset + padding + ((i + 1) * (height - 2 * padding)) / 3
      );
      context.stroke();

      context.beginPath();
      context.moveTo(
        xOffset + padding + ((i + 1) * (width - 2 * padding)) / 3,
        yOffset + padding
      );
      context.lineTo(
        xOffset + padding + ((i + 1) * (width - 2 * padding)) / 3,
        yOffset + height - padding
      );
      context.stroke();
    }

    // draw X's and O's
    context.strokeStyle = "rgb(250, 245, 240)";
    let oRadius = (width - 2 * padding) / 6;
    let innerPadding = 10;
    context.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.boardState[i][j] == 1) {
          // draw X
          context.beginPath();
          context.moveTo(
            xOffset + padding + 2 * i * oRadius + innerPadding,
            yOffset + padding + 2 * j * oRadius + innerPadding
          );
          context.lineTo(
            xOffset + padding + (1 + i) * 2 * oRadius - innerPadding,
            yOffset + padding + (1 + j) * 2 * oRadius - innerPadding
          );
          context.stroke();

          context.beginPath();
          context.moveTo(
            xOffset + padding + (1 + i) * 2 * oRadius - innerPadding,
            yOffset + padding + 2 * j * oRadius + innerPadding
          );
          context.lineTo(
            xOffset + padding + 2 * i * oRadius + innerPadding,
            yOffset + padding + (1 + j) * 2 * oRadius - innerPadding
          );
          context.stroke();
        } else if (this.boardState[i][j] == -1) {
          // draw O
          context.beginPath();
          context.arc(
            xOffset + padding + (2 * i + 1) * oRadius,
            yOffset + padding + (2 * j + 1) * oRadius,
            oRadius - innerPadding,
            0,
            2 * Math.PI
          );
          context.stroke();
        }
      }
    }
  }

  makeMove(player, row, col) {
    this.boardState[row][col] = player;
    return this.checkWin();
  }

  reset() {
    this.boardState = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    this.winner = 0;
  }

  checkWin() {
    // check if the board is full
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.boardState[i][j] == 0) {
          break;
        }
      }
    }

    // check the rows
    for (let i = 0; i < 3; i++) {
      let rowSum =
        this.boardState[i][0] + this.boardState[i][1] + this.boardState[i][2];
      if (rowSum == -3) {
        this.winner = -1;
        return this.winner;
      } else if (rowSum == 3) {
        this.winner = 1;
        return this.winner;
      }
    }

    // check the columns
    for (let j = 0; j < 3; j++) {
      let colSum =
        this.boardState[0][j] + this.boardState[1][j] + this.boardState[2][j];
      if (colSum == -3) {
        this.winner = -1;
        return this.winner;
      } else if (colSum == 3) {
        this.winner = 1;
        return this.winner;
      }
    }

    // check the diagonals
    let diag1 =
      this.boardState[0][0] + this.boardState[1][1] + this.boardState[2][2];
    let diag2 =
      this.boardState[2][0] + this.boardState[1][1] + this.boardState[0][2];
    if (diag1 == -3 || diag2 == -3) {
      this.winner = -1;
      return this.winner;
    } else if (diag1 == 3 || diag2 == 3) {
      this.winner = 1;
      return this.winner;
    } else {
      this.winner = 0;
      return this.winner;
    }
  }
}
