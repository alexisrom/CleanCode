import { Item } from "./item.js";
export class Cell extends Item {
  constructor(
    index,
    state = null,
    previous = null,
    generation = 0,
    lifeAround = 0
  ) {
    super(index);
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
