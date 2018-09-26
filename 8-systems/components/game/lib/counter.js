import { Index } from "../database/index.js";
export class Counter {
  constructor(judge) {
    this._judge = judge;
  }

  countLifeAround(item, index, board) {
    const previous = -1;
    const next = 2;
    item.lifeAround = 0;
    for (let xStep = previous; xStep < next; xStep++) {
      for (let yStep = previous; yStep < next; yStep++) {
        const neighborIndex = new Index(
          index.column + xStep,
          index.row + yStep
        );
        item.lifeAround += this._countIfNeighborIsAlive(
          neighborIndex,
          board
        );
      }
    }
    if (this._judge.isAlive(item)) {
      this._deductItself(item);
    }
  }
  _deductItself(item) {
    item.lifeAround--;
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
