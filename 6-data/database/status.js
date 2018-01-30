export class Status {
  constructor(former = null, current = null, generation = 0) {
    this.former = former;
    this.current = current;
    this.generation = generation;
  }
}