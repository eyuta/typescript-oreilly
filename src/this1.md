# 【TypeScript】 this のトリセツ(1.this パラメーター)

## はじめに

JavaScript でおなじみの this ですが、ご存知の通り、様々な落とし穴があります。
(通常のの function と arrow function で挙動が違う、呼び出し元次第で値が変わる、strict モードか否かで挙動が違う、等々)

TypeScript では、this におけるこれらの落とし穴を避けるための 以下の仕組みがあります。

1. this パラメーター
2. 多様性の this の型
3. This に関する Utility Type

それぞれの仕様をまとめてみました。

まず最初に、 this パラメーターについて説明します。

## 環境

TypeScript: v4.1.3

## コード

[Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/BTCUAIF4D5wbwLAChzgGYFcB2BjALgJYD2W6WweAFgQM4Bc4AbkQQCYSIqrgD0P4Aciq0B4AgFsADgBsCOAnmkBPcJQCGNcHiWSApoLVYlogEa6cajDX0LwrIrs1YieVWsb61WnZ6zO8aoQkAHR4NMAATABsABwAzKDI3OA4JDRE0rrB0kQA5hTUNKAA3EngAL5laOQlvPzYrLpoBFi6rMhlqVg0rkQmAFZQ8GQANOCSagBOauIMAIwVpVx9-cHVYMV1wwBEE9Pi2-MVyOWgGx1IIBAw8J1pvQNDnMlYM7oM22hERNsjZajrDj-bhddKZbJ5Aq0YKvcS6ErA8p-LjlJaoFZrGqbPjgT7fbZ3bquapDDHVNFkDZbAAqPgAopNJkRJgwAMKGfzgSa6NSscZMvSTbSCWG6URENDgBpNFptC6oUEPfoRJ5kBhk0iosorCKYqk46XNVrtJCnc5IZBXKCwZ4pe7gFZPYGij5fH7I5LrYT0YYu8A9SYtXIVIFcZKgjJZHL5b0wt4IsMVD2LbUDPW1HF4n6EnpkUlp8llHHUyj6ISFURdPC6AAevUl2j0gmYbFEtHAnI0NAIuVeJkyWiI4DhVCIrAEmnLIgdDZ8gjgHbeDADQc25QEoXC0RiABZElxAUsc0qVZBhtV1QXNRTi6XBN7KyRq3WZ94mwIFxfwFCfQu-SusFyNdrlgFtWDXNsnBccAux7PsBzwIcR0oMcJ3vCtX0bMs-yXf08EDQCIOCIt+AABQFXQhRUARRUg4daG7QCxFILD5zVb9vQYHC4WXfDVxDa0mBYcCKlMDBXG5ABHDACG5PkWjfbDFx4vCCKA0TN0iWI91TZV0yPLhFQdAY4idRM-W2Ewpl+YFeVYbkaB9T4MFyNQbMTL8NWTLULWWEz9K2SzrJOM4E0tMBBNtHBpC7cBWWkTRbVQUUhizbYKQBchOLihLQ2SBU0kjCEY0KOM4QTZJKhRY8UgSoZWgAdxy8IKtqmgApxN15TtIk8zPaL2sLA8sRpO8pxoR8sGfetFObYS6M7Ry4LUft9EQ4ddFHcdJwfTC5wEeKJs07cdNNUKDKtG4ovtR0zyS5T3lxN13M9LLCi4h7eLUpMYNyR6sAwcQzEmPL8ojcFox-Mr4QykFCohyE1D+1rUCRMofJqlYdzMl5cKCyYXu4OyHKczBXMJzLL1WapvIpLG9TmAAGDN+Hx35wCZkLzXCkDbkM+0STPYALGkaQrJwABrBgIpuMDeZFsW1El80FRixzmr53G4VS57Ya9d7mtB8N4ajSFY1FFHjmq-neoG+rdCaw6VcpAbMRZ8BaT0BkmRZOKOWg7leX5IhBWFGi3nFSVDVlE0zTCy4ZZtGrBe-BXxaljiDblwTs5uNOlYl53otiw7Ne4FKzzSvW3toNlcrL43uiKyHzfjWGqtRmq7bPRrmudnEAEFJlyQHdCmvb3x-Ouihz+axCg1xYN7FaEKHPY3mrSYJ7LKehLYXmwI3EjUBLMtdqwzQJXAHkcEof1lrwDBuRg5+WlSKRAgIVbiK4HET-2w+88OzQSXvBNaQ5WIHQShuMIkQ4g7gAKz7kysLBKbslhxwuonMuRkU7CzUKLdO0sD7CXlgQxWytWrF3VqXe6Fcnr4mrhFOAHciaMiIE1IWvN7oFSbgjEq0ILbtwpKwoy3cOwOz7q1dYrtqgJkwUAA)

## 前提

本記事は以下の前提で書いています。

```
モード: Strict モード
tsconfig: `noImplicitThis`が有効
```

これらの設定について、以下に簡単にまとめました。

本題からそれるので、不要な方は読み飛ばしてください。

### JavaScript における this

最初に、JavaScript における this の扱いについて軽く整理します。

[this - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/this)の内容を簡単にまとめます。

> ほとんどの場合、this の値はどのように関数が呼ばれたかによって決定されます（実行時結合）。これは実行時に割り当てできず、関数が呼び出されるたびに異なる可能性があります。

具体的には、

1. グローバル実行コンテキスト (すべての関数の外側)
   - 厳格モード(Strict モード)であるかどうかにかかわらず、this はグローバルオブジェクト
2. 関数コンテキスト
   - 厳格モード: undefined
   - 通常 :グローバルオブジェクト
3. アロー関数
   - [レキシカル（静的）コンテキスト](https://developer.mozilla.org/ja/docs/Web/JavaScript/Closures#lexical_scoping)の this を参照
   - call, bind, apply で渡された this を無視する
4. クラスコンテキスト
   - static メソッド以外をプロトタイプに持つオブジェクト
5. オブジェクトのメソッド
   - メソッドが呼び出されたオブジェクト(レシーバ)を参照

仕様について詳しく知りたい方は、以下の記事が参考になるかと思います。

- [this - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/this)
- [アロー関数 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Arrow_functions#no_separate_this)
- [Understanding JavaScript Function Invocation and "this"](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)

また、挙動については、[JavaScript の this を理解する多分一番分かりやすい説明](https://qiita.com/takkyun/items/c6e2f2cf25327299cf03)が非常に分かりやすかったです。

### Strict モード

[Strict モード](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Strict_mode)は JavaScript の機能で、これを指定することで JavaScript の挙動の一部を変化させます。

this に限ると、上で触れたように関数内でグローバルオブジェクトを参照できなくなります (undefined となります)。

```js
function fun() {
  console.log(this); // ブラウザだと Window オブジェクト
  return this;
}
console.log(fun() === this); // true
```

```js
"use strict";
function fun() {
  console.log(this); // undefined
  return this;
}
console.log(fun() === undefined); // true
```

TypeScript では、`strict` or `alwaysStrict` オプションを使用している場合は、常に Strict モード扱いとなります[^1]。
[^1]: [tsc CLI Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

以後、Strict モードである前提で話を進めます。

### noImplicitThis

> Raise error on ‘this’ expressions with an implied ‘any’ type.

`this`の型が暗黙的に`any`になる場合、エラーが出るようになります。
参考: [TSConfig Reference - Docs on every TSConfig - TypeScript](https://www.typescriptlang.org/tsconfig#noImplicitThis)

以下のような関数の場合、this は実行されるコンテキストによって値が異なります。
こういった場合に、`noImplicitThis`を有効にしていると、エラーが出力されます。

```ts
function fn() {
  // 'this' implicitly has type 'any' because it does not have a type annotation.ts(2683)
  console.log(this);
}
fn(); // undefined

const obj = { fn, param: 1 };
obj.fn(); // { "param": 1 }
```

詳細な挙動については、[こちらの記事](https://qiita.com/ryokkkke/items/390647a7c26933940470#noimplicitthis)が参考になります。

さて、本題です。

## this parameter

以下のような関数の場合、`obj.fn()`とした場合は正しく name が表示されます。
しかし、呼び出し元が変わると正しく表示されなくなります。

```ts
const obj = {
  name: "foo",
  fn() {
    console.log(this.name);
  },
};
obj.fn(); // "foo"
const fn = obj.fn;

fn(); // TypeError: Cannot read property 'name' of undefined

const obj2 = { fn: obj.fn };
obj2.fn(); // undefined
```

これを避けるために、関数の第一引数に this の型を指定することができます。
this の型を指定することで、実行時のコンテキストの this が指定した型と異なる場合、エラーが出力されるようになります。

```ts
const obj = {
  name: "foo",
  fn(this: { name: string }) {
    console.log(this.name);
  },
};
obj.fn(); // "foo"
const fn = obj.fn;
// The 'this' context of type 'void' is not assignable to method's 'this' of type '{ name: string; }'.ts(2684)
fn();

const obj2 = { fn: obj.fn };
// The 'this' context of type '{ fn: (this: { name: string; }) => void; }' is not assignable to method's 'this' of type '{ name: string; }'.
// Property 'name' is missing in type '{ fn: (this: { name: string; }) => void; }' but required in type '{ name: string; }'.ts(2684)
obj2.fn();

const obj3 = {
  name: "bar",
  address: "fuga", // 余分なプロパティがあってもOK
  fn: obj.fn,
};

// obj3にはname プロパティが存在するため、OK
obj3.fn(); // "bar"
```

```ts
class Cls {
  name = "foo";
  fn(this: Cls) {
    console.log(this.name);
  }
}
const cls = new Cls();
cls.fn(); // foo

const fn = cls.fn;
fn(); // The 'this' context of type 'void' is not assignable to method's 'this' of type 'Cls'.ts(2684)
```

尚、この第一引数の this は js にトランスパイル後は表示されません。

```js
// js
"use strict";
const obj = {
  name: "foo",
  fn() {
    console.log(this.name);
  },
};
```

そのため、引数を指定したい場合は、第二引数以降に指定します。

```ts
const obj = {
  name: "foo",
  fn(this: { name: string }, age: number) {
    console.log(this.name);
    console.log(age);
  },
};

const obj4 = {
  name: "bar",
  fn: obj.fn,
};
// 呼び出す側で第一引数に指定したものが、fnの第二引数に渡される
obj4.fn(10); // "bar", 10
```

### コールバック内の this パラメーター

コールバック内で this を呼び出すと、呼び出し元が異なるために実行時にエラーが発生しやすいです。

```ts
const fn = (callback: () => void) => callback();
class Cls {
  name = "foo";
  fn(this: Cls) {
    console.log(this.name);
  }
}
const cls = new Cls();
fn(cls.fn); // TypeError: Cannot read property 'name' of undefined
```

対策として、コールバックに`{this: void}`を指定する方法があります。
こうすると、`fn`の求める this(`void`)と、コールバックに渡した関数`cls.fn`の this(`Cls`)が異なるため、型エラーになります。

```ts
const fn = (callback: (this: void) => void) => callback();
class Cls {
  name = "foo";
  fn(this: Cls) {
    console.log(this.name);
  }
}
const cls = new Cls();
// Argument of type '(this: Cls) => void' is not assignable to parameter of type '(this: void) => void'.
//  The 'this' types of each signature are incompatible.
//   Type 'void' is not assignable to type 'Cls'.ts(2345)
fn(cls.fn);
```

もし、コールバック内で this を使いたい場合、アロー関数を使う必要があります。

```ts
const fn = (callback: () => void) => callback();
class Cls {
  name = "foo";
  fn() {}
  arrow = () => {
    console.log(this.name);
  };
}
const cls = new Cls();
fn(cls.arrow); // "foo"
```

しかし、アロー関数はプロパティと同様に prototype に割り当てられることに留意する必要があります。
一方メソッドは一度だけ作成され、 Cls オブジェクト全体で共有されます。

```js
// js
class Cls {
  constructor() {
    this.name = "foo";
    this.arrow = () => {
      console.log(this.name);
    };
  }
  fn() {}
}
```

参考: [this パラメーター | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/functions#this_parameters)

## 参考文献

- [プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)
- [this パラメータ | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/functions#this_parameters)
  - [原文(this parameters)](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters)
- [多様性の this の型(Polymorphic this types) | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/functions#this_parameters)
  - [原文(Polymorphic this types)](https://www.typescriptlang.org/docs/handbook/advanced-types.html#polymorphic-this-types)
- [ThisParameterType<Type> | Documentation - Utility Types - TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype)
- [TSConfig Reference - Docs on every TSConfig - TypeScript](https://www.typescriptlang.org/tsconfig#noImplicitThis)
