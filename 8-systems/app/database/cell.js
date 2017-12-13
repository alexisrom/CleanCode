import { Index } from "./index.js";
export class Cell {
  constructor(index, state, previous, generation, lifeAround) {
    this._index = index ? index : new Index();
    this._state = state;
    this._previous = previous;
    this._generation = generation;
    this._lifeAround = lifeAround;
  }

  get state() {
    return this._state;
  }
  set state(value) {
    this._generation++;
    this._previous = this._state;
    this._state = value;
  }

  get previous() {
    return this._previous;
  }
  set previous(value) {
    this._previous = value;
  }

  get index() {
    return this._index;
  }
  set index(value) {
    this._index = value;
  }

  get lifeAround() {
    return this._lifeAround;
  }
  set lifeAround(value) {
    this._lifeAround = value;
  }

  clone() {
    return new Cell(
      this._index,
      this._state,
      this._previous,
      this._generation,
      this._lifeAround
    );
  }
}
