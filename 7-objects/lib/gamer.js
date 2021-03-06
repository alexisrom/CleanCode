import { GAME } from "../config/game.js";
import { Board } from "../database/board.js";
import { Index } from "../database/index.js";
export class Gamer {
  constructor() {
    this.board = new Board(GAME.BOARD_COLUMNS, GAME.BOARD_ROWS);
  }
  initializeBoard() {
    this.board.forEach(this.initializeCell.bind(this));
  }
  initializeCell(cell) {
    if (this.canBorn()) {
      this.setCellAlive(cell);
    } else {
      this.setCellDead(cell);
    }
    this.updateStatus(cell);
  }
  canBorn() {
    const randomLifeProbability = Math.random();
    return randomLifeProbability > GAME.LIFE_PROBABILITY;
  }
  updateStatus(cell) {
    cell.status.former = cell.status.current;
    cell.status.current = cell.status.next;
    cell.status.generation++;
  }
  updateIteration() {
    this.board.forEach(this.generateNextCellState.bind(this));
    this.board.forEach(this.updateStatus.bind(this));
  }
  generateNextCellState(cell, index, board) {
    this.countLifeAround(cell, index, board);
    if (this.isCellDead(cell)) {
      this.generateFromDeadCell(cell);
    } else {
      this.generateFromLivingCell(cell);
    }
  }
  countLifeAround(cell, index, board) {
    const previous = -1;
    const next = 2;
    cell.lifeAround = 0;
    for (let xStep = previous; xStep < next; xStep++) {
      for (let yStep = previous; yStep < next; yStep++) {
        const neighborIndex = new Index(
          index.column + xStep,
          index.row + yStep
        );
        cell.lifeAround += this.countIfNeighborIsAlive(
          neighborIndex,
          board
        );
      }
    }
    if (this.isCellAlive(cell)) {
      this.deductItself(cell);
    }
  }
  deductItself(cell) {
    cell.lifeAround--;
  }
  countIfNeighborIsAlive(neighborIndex, board) {
    if (board.isOnBoard(neighborIndex)) {
      const neighbor = board.getItem(neighborIndex);
      if (this.isCellAlive(neighbor)) {
        return 1;
      }
    }
    return 0;
  }
  generateFromDeadCell(cell) {
    if (this.mustBorn(cell)) {
      this.setCellAlive(cell);
    } else {
      this.setCellDead(cell);
    }
  }
  generateFromLivingCell(cell) {
    if (this.mustDie(cell)) {
      this.setCellDead(cell);
    } else {
      this.setCellAlive(cell);
    }
  }
  mustBorn(cell) {
    return cell.lifeAround == GAME.REPRODUCTION_POPULATION;
  }
  mustDie(cell) {
    return (
      cell.lifeAround < GAME.UNDER_POPULATION ||
      cell.lifeAround > GAME.OVER_POPULATION
    );
  }
  isCellAlive(cell) {
    return cell.status.current === GAME.IS_ALIVE;
  }
  isCellDead(cell) {
    return cell.status.current === GAME.IS_DEAD;
  }
  setCellAlive(cell) {
    cell.status.next = GAME.IS_ALIVE;
  }
  setCellDead(cell) {
    cell.status.next = GAME.IS_DEAD;
  }
}
