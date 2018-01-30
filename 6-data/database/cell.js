import { Status } from './status.js';
export class Cell {
  constructor(index, status = new Status(), lifeAround = 0) {
    this.index = index;
    this.status = status;
    this.lifeAround = lifeAround;
  }
}