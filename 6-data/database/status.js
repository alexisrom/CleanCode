export class Status {
  constructor(current = null, next = null, generation = 0) {
    this.current = current;
    this.next = next;
    this.former = current;
    this.generation = generation;
  }
}
