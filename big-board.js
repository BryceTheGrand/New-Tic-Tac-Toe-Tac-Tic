class BigBoard extends Board {
  constructor(boards) {
    super();
    if (boards === undefined) {
      this.boards = [
        [new Board(), new Board(), new Board()],
        [new Board(), new Board(), new Board()],
        [new Board(), new Board(), new Board()],
      ];
    } else {
      this.boards = boards;
    }
  }

  show(context, xOffset, yOffset, width, height, radius, padding) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.boards[i][j].show(
          context,
          xOffset + (i * width) / 3 + (i * padding) / 2,
          yOffset + (j * height) / 3 + (j * padding) / 2,
          width / 3 - padding,
          height / 3 - padding,
          radius,
          20
        );

        // draw big X's and O's
        context.strokeStyle = "rgb(250, 245, 240)";
        context.lineWidth = 8;
        if (this.boards[i][j].winner == 1) {
          // draw X
          context.beginPath();
          context.moveTo(
            xOffset + 35 + i * width / 3 + 0.5 * i * padding,
            yOffset + 35 + j * height / 3 + 0.5 * j * padding
          );
          context.lineTo(
            xOffset + (1 + i) * width / 3 - padding - 35 + 0.5 * i * padding,
            yOffset + (1 + j) * height / 3 - padding - 35 + 0.5 * j * padding
          );
          context.stroke();

          context.beginPath();
          context.moveTo(
            xOffset + (1 + i) * width / 3 - padding - 35 + 0.5 * i * padding,
            yOffset + 35 + j * height / 3 + 0.5 * j * padding
          );
          context.lineTo(
            xOffset + 35 + i * width / 3 + 0.5 * i * padding,
            yOffset + (1 + j) * height / 3 - padding - 35 + 0.5 * j * padding
          );
          context.stroke();
        } else if (this.boards[i][j].winner == -1) {
          context.beginPath();
          context.arc(
            xOffset + ((1 + 2 * i) * width) / 6 - 0.5 * padding * (1 - i),
            yOffset + ((1 + 2 * j) * height) / 6 - 0.5 * padding * (1 - j),
            (width - 15 * padding) / 6,
            0,
            2 * Math.PI
          );
          context.stroke();
        }
      }
    }
  }
}
