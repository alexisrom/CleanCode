import { Index } from "./index.js";
export class Item {
  constructor(index) {
    this._index = index ? index : new Index();
  }
  get index() {
    return this._index;
  }
  set index(value) {
    this._index = value;
  }

  clone() {
    return new Item(this._index);
  }
}
