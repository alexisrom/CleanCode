import { Status } from './status.js';
export class Cell {
  constructor(index, status = new Status()) {
    this.index = index;
    this.status = status;
  }
}