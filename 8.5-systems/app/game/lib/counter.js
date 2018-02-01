import { Index } from "../database/index.js";
export class Counter {
  constructor(judge) {
    this._judge = judge;
  }

  countLifeAround(item, index, board) {
    item.lifeAround = 0;
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        const neighborIndex = new Index(
          index.column + x,
          index.row + y
        );
        item.lifeAround += this._countIfNeighborIsAlive(
          neighborIndex,
          board
        );
      }
    }
    if (this._judge.isAlive(item)) {
      item.lifeAround--;
    }
  }
  _countIfNeighborIsAlive(neighborIndex, board) {
    if (board.isOnBoard(neighborIndex)) {
      const neighbor = board.getItem(neighborIndex);
      if (this._judge.isAlive(neighbor)) {
        return 1;
      }
    }
    return 0;
  }
}
