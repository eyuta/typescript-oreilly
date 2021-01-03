// オーバーロードの型定義は実装を考慮しない
// 型定義と実装内容が異なる
(() => {
  function fn(val: number): string;
  function fn(val: string): number;
  function fn(val: number | string) {
    return val;
  }

  // const num: string !?
  const num = fn(1);
  // const str: number !?
  const str = fn("1");
})();

// コールバックの引数の数だけが異なるオーバーロードは定義する必要がない
// 通常の関数
(() => {
  interface T {
    (arg1: string): void;
    (arg1: string, arg2: string, arg3: string): void;
  }
  const fn: T = (arg1: string, arg2?: string, arg3?: string) => {};

  const one = fn("");
  const three = fn("", "", "");
})();

// typescript/lib/lib.es5.d.ts
(() => {
  interface ReadonlyArray<T> {
    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
     */
    forEach(
      callbackfn: (value: T, index: number, array: readonly T[]) => void,
      thisArg?: any
    ): void;
  }
})();

// Wrong Pattern
(() => {
  interface ReadonlyArray<T> {
    forEach(callbackfn: (value: T) => void, thisArg?: any): void;
    forEach(callbackfn: (value: T, index: number) => void, thisArg?: any): void;
    forEach(
      callbackfn: (value: T, index: number, array: readonly T[]) => void,
      thisArg?: any
    ): void;
  }
})();

// コールバック関数で受け取る引数の数は、任意に決められる
(() => {
  [1, 2, 3].forEach(() => {});
  [1, 2, 3].forEach((val) => {});
  [1, 2, 3].forEach((val, index) => {});
  [1, 2, 3].forEach((val, index, array) => {});
})();

// より一般的なオーバーロードより、より具体的なオーバーロードを先に定義する
(() => {
  function fn(val: any): any;
  function fn(val: number): number;
  function fn(val: string): string;
  function fn(val: number | string) {
    return val;
  }
  // const one: any
  const one = fn(1);

  // const str: string
  const str = fn("1");
})();

(() => {
  function fn(val: number): number;
  function fn(val: string): string;
  function fn(val: any): any;
  function fn(val: number | string) {
    return val;
  }
  // const one: number
  const one = fn(1);
  // const str: string
  const str = fn("1");
})();

// 末尾の引数のみが異なるオーバーロードを定義したい場合は、任意引数を使用する
(() => {
  // 誤
  interface T {
    (one: string): void;
    (one: string, two: string): void;
  }
  // 正
  interface T {
    (one: string, two?: string): void;
  }
})();

// コールバック関数の型定義は、引数が少なくとも問題ない
(() => {
  const fn = (f: (a: string, b: number) => void) => {};

  // fnのコールバック関数の型にマッチしない(引数の数が少ない)
  const callback = (one: string) => {};
  // fnのコールバック関数の型にマッチする
  const callback2 = (one: string, two: number) => {};

  fn(callback); // No Error
  fn(callback2); // No Error
})();

(() => {
  const fn = (f: (a: string, b: number) => void) => {};

  interface T {
    (one: string): void;
    // 上と異なり、twoの型をstringに変更 == fnの引数の型を満たさない
    (one: string, two: string): void;
  }

  const callback3: T = (one: string, two?: string) => {};
  // 最初のオーバーロード `(one: string): void;` が引数の型を満たすため、2番目の型は無視される
  // そのため、エラーにならない
  fn(callback3); // No Error
})();

(() => {
  const fn = (f: (a: string, b: number) => void) => {};

  interface T {
    (one: string, two?: string): void;
  }

  const callback3: T = (one: string, two?: string) => {};

  // Argument of type 'T' is not assignable to parameter of type '(a: string, b: number) => void'.
  // Types of parameters 'two' and 'b' are incompatible.
  //   Type 'number' is not assignable to type 'string | undefined'.
  fn(callback3); // Error
})();

// オーバーロードの引数の型のみが異なる場合、オーバーロードではなく union type を使用した方が良い
(() => {
  interface T {
    (): string;
    (val: number): void;
    (val: string): void;
  }

  const fn: T = (val?: number | string): any => {};

  fn(1); // No Error
  fn(""); // No Error

  const _ = (x: number | string) => {
    // No overload matches this call.
    // Overload 1 of 3, '(val: number): void', gave the following error.
    //   Argument of type 'string | number' is not assignable to parameter of type 'number'.
    //     Type 'string' is not assignable to type 'number'.
    // Overload 2 of 3, '(val: string): void', gave the following error.
    //   Argument of type 'string | number' is not assignable to parameter of type 'string'.
    //     Type 'number' is not assignable to type 'string'.
    fn(x);
  };
})();

(() => {
  interface T {
    (): string;
    (val: number | string): void;
  }

  const fn: T = (val?: number | string): any => {};

  fn(1); // No Error
  fn(""); // No Error

  const _ = (x: number | string) => {
    fn(x); // No Error
  };
})();
