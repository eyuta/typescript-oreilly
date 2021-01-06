// はじめに
(() => {
  type T1 = <T>(val: T) => T; //
  type T2<T> = (val: T) => T;
})();

// スコープの違い
(() => {
  type T1 = <T>(val: T) => T;
  type T2<T> = (val: T) => T;

  // T1 === T3
  type T3 = {
    <T>(val: T): T;
    (val: T): T; // Cannot find name 'T'.ts(2304)
  };

  // T2 === T4
  type T4<T> = {
    (val: T): T;
    (val: T): T; // No  Error
  };
})();

// バインドのタイミングの違い
(() => {
  type T1 = <T>(val: T) => T;
  type T2<T> = (val: T) => T;

  // T1 === T3
  type T3 = {
    <T>(val: T): T;
  };

  // T2 === T4
  type T4<T> = {
    (val: T): T;
  };

  const fn1: T1 = (val) => val; // (parameter) val: T
  const fn2: T2<number> = (val) => val; // (parameter) val: number
  const fn3: T3 = (val) => val; // (parameter) val: T
  const fn4: T4<number> = (val) => val; // (parameter) val: number

  const num1 = fn1(1); // const v1: 1
  const num2 = fn2(2); // const v2: number
  const num3 = fn3(3 as number); // const v3: number
  const num4 = fn4(4); // const num4: number

  const str1 = fn1(""); // const str: ""
  const str2 = fn2(""); // Argument of type 'string' is not assignable to parameter of type 'number'.

  const bind = fn1<string>(""); // const bind: string
})();

// 使い分け
(() => {
  interface Array<T> {
    forEach(
      callbackfn: (value: T, index: number, array: readonly T[]) => void,
      thisArg?: any
    ): void;

    map<U>(
      callbackfn: (value: T, index: number, array: T[]) => U,
      thisArg?: any
    ): U[];
  }

  // この時点で、ジェネリクス`T`がnumber型にバインドされる
  const array: Array<number> = [];

  // foreach関数内では、シグネチャ全体に宣言されたジェネリクス`T`が使用可能
  // ジェネリクス`T`がnumber型にバインとされているため、callbackfnの第一引数もnumber型
  array.forEach((value) => {}); // (parameter) value: number

  // map関数を実行したタイミングで、callbackfnの返り値( == string)をジェネリクス`U`にバインドする
  // map関数の返り値は U[] === string[]
  // もちろんこの`U`はmap関数外では使えない
  const strArray = array.map((value) => String(value)); // const strArray: string[]
})();
