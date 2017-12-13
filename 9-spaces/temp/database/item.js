export class Item {
  constructor(index) {
    this._index = index;
  }
  clone() {
    return new Item(
      this._index
    );
  }
}