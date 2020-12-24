# `let h = null`について、TypeScript はどのような型を推論するか

## はじめに

<details>
<summary>Q. <code>let h = null</code>について、TypeScriptはどのような型を推論するでしょうか？
(▶ をクリックすると回答が表示されます)
</summary>
A. any 型 (`let h: any`) となる[^1]
[^1]: `tsconfig.json`において`strictNullChecks`が`true`かつ、`noImplicitAny`が`false`となっている場合は null 型になります。

![h=null.PNG](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/110860/f3c13863-673d-0e75-3eb0-60114554e7e6.png)

</details>
<br>
<br>

こちらの問いは、[プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)に記載されていた問いになります。

皆さんは正解しましたか？

(ちなみに、`const h = null`とした場合、`h`は null 型となります)

本記事では、なぜこのような結果になるのか解説したいと思います。

## 前提

- バージョン

  ```sh
  $ tsc -v
  Version 4.1.3
  ```

- `tsconfig.json`において`"strictNullChecks": true`かつ、`"noImplicitAny": true`[^2]

```tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true,
    // or
    "strict": true, // strictがtrueだと、上記のオプション含めた複数のオプションがtrueになります
  }
}
```

[^2]:
    `"strictNullChecks": false`の場合、`const`で定義した null も、any 型になります。
    また、`"strictNullChecks": true`かつ`"noImplicitAny": false`の場合、`let`で定義した null は`const`と同様に null 型になります。
    各オプションについては以下を参照:

    - [TypeScript Deep Dive 日本語版 | strictNullChecks](https://typescript-jp.gitbook.io/deep-dive/intro/strictnullchecks)
    - [TypeScript Deep Dive 日本語版 | noImplicitAny](https://typescript-jp.gitbook.io/deep-dive/intro/noimplicitany)

## 解説

### 結論

null 型、undefined 型を、 `let` や `var`といった後で変更可能な方法で宣言した場合、any 型に拡張されます。
これは`型の拡大（type widening）`と呼ばれます[^3]。
null や undefined で型の拡大を利用するパターンは稀ですが、リテラル型からプリミティブ型への拡張はよく利用されるかと思います。
例えば以下のように宣言した場合、リテラル型である`1`は`const`で宣言した場合はそのまま`1型`になり、`let`で宣言した場合はプリミティブ型である`number`型へ拡張されます。

> ```ts
> const one = 1; // 'one' has type: 1
> let num = 1; // 'num' has type: number
> ```

引用: [TypeScript-New-Handbook/Widening-and-Narrowing](https://github.com/microsoft/TypeScript-New-Handbook/blob/master/reference/Widening-and-Narrowing.md)

<br>

以下、詳しく説明します。

[^3]: [プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)の中で`type widening`を`型の拡大`と訳していたため、それに則っています。

### プリミティブ型とリテラル型

型の拡大に触れる前に、TypeScript で扱う型について整理しておきます。
(TypeScript で扱う型については[TypeScript の型入門](https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a)が詳しいです)

簡単に説明しますと、

- プリミティブ型は、`string`, `number`, `bigint`, `boolean`, `undefined`,`symbol`の 6 種類を指します[^4]
- リテラル型は、`string`, `number`, `boolean`型の値そのものを指す型であり、それ以外の値を受け入れることができません

```ts
const one = 1; // one は 1型 というリテラル型
let foo: "foo" = "foo";
foo = "bar"; // ERROR: Type '"bar"' is not assignable to type '"foo"'.ts(2322)
```

[^4]:
    参照: [MDN Web Docs 用語集: ウェブ関連用語の定義 | Primitive (プリミティブ)](https://developer.mozilla.org/ja/docs/Glossary/Primitive)
    ここでは null 型をプリミティブ型に含んでいませんが、記事によっては含んでいるものもあります。

### 型の拡大（type widening）

<!-- ![TypeScript’s type hierarchy](https://i.imgur.com/APrrI2V.png)
引用: [TypeScript - Everything I know](https://wiki.nikitavoloboev.xyz/programming-languages/typescript) -->

型の拡大により、変数を変更可能な方法で宣言したときに、以下のように型が変化します。

1. null 型、undefined 型を any 型として扱う
   - `strictNullChecks`の`true/false`によって挙動が異なる
2. リテラル型をプリミティブ型として扱う
3. Enum 型のメンバは、それを含む Enum 型として扱う

`変数を変更可能な方法`とは、`var`や`let`での変数宣言だけでなく、オブジェクトや配列の宣言も含みます(知っての通り、JavaScript のこれらは変更可能なので)。

#### 1. null 型、undefined 型を any 型として扱う

`strict: true`の場合、`let`や`var`で宣言した null 型や undefined 型は any に拡大されます。
しかし、オブジェクトや配列の要素として宣言した null 型は拡大されません。

```ts
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
```

`strictNullChecks: true`、`noImplicitAny: false`の場合、`let`や`var`で宣言した null 型や undefined 型も拡大されず、 null 型、undefined 型のままになります[^5]。

[^5]: どうしてこのような挙動の違いがあるのかまで、調べきれてません。ご存知の方いらっしゃいましたらご教示いただけますと幸いです。

```ts
// strictNullChecks: true, noImplicitAny: false
let h = null; // null type
const i = null; // null type
let j = undefined; // undefined type
const k = undefined; // undefined type
// object, arrayの挙動は上と同様
```

`strictNullChecks: false`の場合、null 型、undefined 型は**明示的に宣言しない限り** any 型へと拡大されます。

```ts
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
```

ただし、null 型、undefined 型で宣言された変数がそのスコープを離れると、明確な型が割り当てられます。

```ts
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
```

#### 2. リテラル型をプリミティブ型として扱う

変数を変更可能な方法で宣言したときに、以下のように拡大されます。

```ts
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
```

ただし、2 つの注意点があります。

1. リテラル型の拡大は、式によるリテラル型にのみ発生し、型によるリテラル型では発生しない
2. リテラル型の拡大は、宣言されたリテラル型が変更可能な場所に到達するたびに発生する

`式によって宣言されたリテラル型`は[TypeScript-New-Handbook/Widening-and-Narrowing](https://github.com/microsoft/TypeScript-New-Handbook/blob/master/reference/Widening-and-Narrowing.md)では、`fresh literal type`と呼ばれ、リテラル型とは区別されています。

```ts
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
```

#### 3. Enum 型のメンバは、それを含む Enum 型として扱う

```ts
enum A {
  B,
  C,
}

const b = A.B; // const b: A.B
let c = A.C; // let c: A
let d = b; // let d: A
```

### 型を拡大したくない場合

const アサーションを用いて、型アサーション[^6]を行うことで、型の拡大を抑えることが出来ます。
また、オブジェクトや配列に対して const アサーションを用いると、再帰的に[ReadOnly](https://typescript-jp.gitbook.io/deep-dive/type-system/readonly)に指定します。

```ts
let a = 1; // let a: number
let b = 1 as const; // let b: 1

let c = { x: 1 }; // let c: { x: number; }
let d: { x: 1 } = { x: 1 }; // let d: { x: 1; }
let e = { x: 1 } as const; // let e: { readonly x: 1; }
```

[^6]: [型アサーション](https://typescript-jp.gitbook.io/deep-dive/type-system/type-assertion)とは、TypeScript が推論した型に対して、型の上書きを行う方法です。

## 最後に

上の挙動は、TypeScript に触れていれば感覚で理解できていると思います。
しかし、挙動を明確に把握することで、予期せぬ型推論を防ぐことができると思います。
この記事が皆さんのお役に立てれば幸いです。

## 参考文献

- [プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)
- [TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/intro/strictnullchecks)
- [TypeScript の型推論詳説](https://qiita.com/uhyo/items/6acb7f4ee73287d5dac0)
- [TypeScript の型入門](https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a)
