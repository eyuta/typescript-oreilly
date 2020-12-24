function* createNumber() {
  let n = 0;
  while (1) {
    yield n++;
    yield "test";
  }
}

let numbers = {
  *[Symbol.iterator]() {
    for (let n = 0; n <= 10; n++) {
      yield n;
    }
  },
  *test() {
    for (let n = 0; n <= 10; n++) {
      yield n;
    }
  },
};
numbers[Symbol.iterator]().next()
