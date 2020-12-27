(() => {
  // strictNullChecks: true, noImplicitAny: true
  // or strict: true
  let h = null; // any type
  const i = null; // null type
  let j = undefined; // any type
  const k = undefined; // undefined type

  const l = {
    m: null,
    n: undefined,
  };
  // const l = {
  //   m: null,
  //   n: undefined,
  // };

  const o = [null, undefined];
  // const o: (null | undefined)[]
})();
(() => {
  // strictNullChecks: true, noImplicitAny: false
  let h = null; // null type
  const i = null; // null type
  let j = undefined; // undefined type
  const k = undefined; // undefined type
  // object, arrayの挙動は上と同様
})();

(() => {
  // strictNullChecks: false
  let h = null; // any type
  const i = null; // any type
  let j = undefined; // any type
  const k = undefined; // any type

  const l = {
    m: null,
    n: undefined,
  };
  // const l = {
  //   m: any,
  //   n: any,
  // };

  const o = [null, undefined];
  // const o: any[]

  let p: null = null; // null type
  const q: undefined = undefined; // undefined type
})();

(() => {
  function x() {
    // function x(): null
    let a = null; // let a: any
    return a;
  }

  function y() {
    // function y(): string
    let a = null; // let a: any
    a = 3; // let a: any
    a = "b"; // let a: any
    return a;
  }
  let z = y(); // let z: string
})();

(() => {
  const h = 1; // 1 type (literal type)
  let i = 1; // number type (primitive type)

  // letの場合も同様
  const j = {
    k: "k",
    l: 0,
    m: true,
  };
  // const j: {
  //     k: string;
  //     l: number;
  //     m: boolean;
  // }

  const n = ["n", 0, false];
  // const n: (string | number | boolean)[]
})();
(() => {
  const o = 1; // `1`という式によってリテラル型を宣言 (= fresh literal type)
  const p: 1 = 1; // `: 1`という型によってリテラル型を宣言 (= literal type)
  const q = {
    o: o,
    p: p,
  };
  // オブジェクトのプロパティや配列は変更可能なので、
  // 式で宣言されたリテラル型はnumber型に拡大される
  // ただし、型で宣言されたリテラル型は拡大されない
  // const q: {
  //     o: number;
  //     p: 1;
  // }
  const r = [o]; // const r: number[]
  const s = [p]; // const r: 1[]

  // もちろん、letやvarで宣言した場合も、上記と同様に拡大される
  let t = o; // let t: number
  let u = p; // let u: 1
})();

(() => {
  enum A {
    B,
    C,
  }

  const b = A.B; // const b: A.B
  let c = A.C; // let c: A
  let d = b; // let d: A
})();
(() => {
  let a = 1; // let a: number
  let b = 1 as const; // let b: 1

  let c = { x: 1 }; // let c: { x: number; }
  let d: { x: 1 } = { x: 1 }; // let d: { x: 1; }
  let e = { x: 1 } as const; // let e: { readonly x: 1; }
})();
