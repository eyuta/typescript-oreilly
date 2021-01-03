# 【TypeScript】オーバーロードを使用する上での注意点

## はじめに

昨日、[TypeScript のオーバーロードの様々な書き方](https://qiita.com/eyuta/items/73b9b3af5f9820f74ae7)についてまとめてみました。
本日は、オーバーロードにおける注意点・ハマりどころについて、まとめてみたいと思います。

※主に、[TypeScript-Handbook = Do's and Don'ts.md](https://github.com/microsoft/TypeScript-Handbook/blob/master/pages/declaration%20files/Do's%20and%20Don'ts.md)を私なりに噛み砕いたものになります。

## 環境

TypeScript: v4.1.3

## コード

[Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/PTAEiqGQfhkBYZMW4ZKEmGQdgyGj1QWdqEr-Q9gyHztQoxGBJDIMABgdoaDqDIFYMgIgwCwAUCKBpoBYMBgoYqCd2oDIMgDq6VA0QwMAFCICUoALwA+UAG8GoUADMArgDsAxgBcAlgHsNqjSIBuAQwA2ALlAa1AWwBGAUwBO4uwGcd7vRoA5gDcSqqauobGKqaWtqC+-kFe9k5u7qH0yura+kYm5tZ2Di4eoAA+CX4BgZKKWcqg7q46au7GcZnKAL4MYUxaRr6pjj7VQaAAhAD8YYMawyXSBQCM4l2gA0M6Ve7FaWUzc9u7yzEiAEQrF+sM3eISmQxMgM0MkIDXDNCAwwyA9QzIgKj6gAdTZCAwAGDIBFBn4QigsAQiGwWEAmgyCQCj+oBAyJ4NGeYEAWAmADj1kIAi1MBogk0jk9WUAR0HhUFi0rlAABUFGFlCILO5AisxklanYzAY9AATDbsznc3k1AA0oAlACYpUFZRKAMxK-mgQUija9BrzYYxOwsqSgDlcnm7GVyrny6YalVc1X2q3JckKbpPfUnIyM03nC43DYGnY6AAWzT9BUDspjoEDt3o90efUYYB0AE8AA6ubxafxZnTAKx6ZzF0sAOlzAFYK8KKzpvKTJLJWQ1qbT6YyAEquCzCoxWDMAQXc7gsGYAPEyKWzNgAqedz0Dz0AABVpBncjm8oHDjO8Oa0ehUelcwrlkXyKi3oD7WjDd6srkcrg0OwCcuMnPHGYry9XAABLNOQsRxQC0awrGcekAGsYmUYdwlyKI9zDCwdnpBlC13NQsz3Aw0MjG1AicN9GwrVQtwAUXpR9IKsKxd33CCoJgrR4OiCI8mMX09z0V8qPcO86KfF9yNAT8WJ-Cd-waRogJA8dwPDPRvFHQJEN45wACtXF0AjQAAdzDPQHzQxlVN3WDXAzIytwvSDjGaFQyiksNGQY6C4IQnIrw0SiAEkVDQtSNMk3cDEcPQdBpYVZU0YVXFPDRzwi0A1G8NKLGYjzQt3OI1FcOTGmUedgDnG93Foh8RGXVjGPYzi7EKKwiuNWUAiSgAPfZSncR1fzsZp+0HDNmQAbQAXRbORtXi+qrI0l0LA0DM5xSebdTuB5E2xUAAHV3CMTS1wwml2mbd1KUk99OwZUBe1GjQh1HX9p1neShJqsMRC8pqjTNQrXGNWatSFeL8uWuxVozTaIbFb66L+tifI0FrgY626er69Iwfm2Ulq5Fa1vhnVKpo5H6v+tGMesdrmU6jQcZGdJBonYa+wHF7xqZab8Yh6VFtM9TiZhtaNoFBGwj1ZM9rTUA3k+X5iUAcwZAHXlcFADXlQQgRBbBAEAGQBvuUAeENAGsGQAvG0AQIZAEiGQAYhmEegxDBm6JpWWV5VlVUporKqfud677g2N2Pa9n2-eR1qXaDsIQ9AT3QG933Kdq1qmZ66PE2UOOE6TiPU7idPXG69m4cDxM5a9JhAAiGQAohkAADlABogwAQt0oGF4CQOuDbrwB3RUAZXlW-buFCEACUUzaRR2A9bG6-J4go4nFuHF42WfUPOBfWY8FISnSFfuLX2IildTVEhqPeUOvQ-4h3spKlPt0buUZpWnaLVrG2hotgWHZfUX45v9AHxf0pg1hemUF-YYiQNT-0gX4M4pgrhBh2imegV1p5hFXpfVquMt44IyBg-eWCN73xPuMEIBCL7RCvovFIsNz7+XnkfG+wk75kLqHOZ+bQOjvxlv0MAIZAGpTwTAn+qV4EiFAXwiCJwoHHxEacYBlxrgV12lXMAgBqc0AHw6AJgSAH8GKEggh5IEIFgcggB9BmoIAFg1AAQKobU2QJCCAH95QAFK7IjQZ9cBYBAAlUWEDs7g6QPRZI-M0v9j5k1FHOEQoSSGE3shqcJH9PGgEAMbWvi7r+K7MyNspUolCOPrEgwLoSEJN4UmVRqZXgfG+D8YkaAsCGyBDwQAiDqUEAPIMrBABBDIAeVVAAyGViJ2ZJ0HegAQhU0IgVAtQsA6UAzg8ECxFNHMBmwwAxGQEraptTUBm0AHsMXxACDDFQagIg9aAmaTQcQ8iaYcWWLkkGYTA4bCYKs9ZKtgRbN2XstxwzhhXNgvKG50SyEFLmQ81M2RTC-PWMs0AAA5Qi1ExxbgwRC1GHF5RQqYHC0ACLjruGQfLKeHjpEjOMGMiZZopn5JmSC1s81FlgtuhdAJjIgmRMBXyEpX0mCACg5VgAha4Gx0PZNAhASFm0AJCagAXs2kMAnRIrAABdmYwAqgz9Jyey60QqDDxKluTBoepLmotguqLJYz1XKj3PZIpbDQWfzAIAAHNAC4SsgIxiBQAAANbnavBjqN1oAeB61QIQRViIzFWwNvKQAVq6ADu3NA2BACEjoANMilUOykYAXQZkChoNoACoZACXDJAM2lAbaqoKL81UGKwBYpxUispKD3HZOJYaUlZpyUcmmbMzenh3R0ptWkplmTWVfU9VSzVVqOU6oiXqhlAjS3GgBXkmJFrCnxJ7ba0AGkyLvkASFTMOZQAAHImR7vShoAwmFvDeD0IEDQFhnDPkMkpMCLQygGG3dmRke7W1Uvbcw+Zwo90lWhUyN9kUQoPtfBdXce7NVHtWhePdzgYPNFuoMRwIF9C3uKlI5QQHd17uYUetS9hT1ynPZe69GHDI7vfSQioGVmbJQCOef9yKUaNTgmW4I0Kq14prfLJgLq5WoGQPogQggbEGxdarbAbS6OoSo6AJxzjzGAE7THggB7ILoAMl2vb7osvreyFIJDEbYI7ZynJxC2Hjo-vIwGJogbWBdMw2jxTF4rvBRI8tsL4WIp4+5hMnHMXedxVOk4AB9G5vUO3OetUM0qgXAFmA8FYAw-ZQCOAwg+XM+UGpWAA0kgA8ol9wyXUsrC3YnWUH6N4-vHXu2UgQLCJYslRRiBgjI1DvD5vL0LEJcg3T-V9uGaOVHw8e4jOUL1XpvXenQhEwNPuEi+vcb7934e60wUqOHqNkII7uE9Z7JvkZm4ReTeGDjuGY1ysAhWkspYvP8pbqpKsmZc96v99XGuWTyjeVr7WJgeFxetsAvXSKvk3Ut07w2O27aIwdsj03LJzdAuB59g3tt8ku3F4HjQturfOzD-bJHDsI8oytvdJDMeNHON1LOoBPT4q9IS+tfjmVZOCRIDUxnqvnei2Ot71nvk7FszcuIjmeesL57DNzqxPOVp8yx-z0K5fBdQYL0A4WxmRacxLmo2mvrU9l0F6tPRMiVwYEAA)

## 注意点・ハマりどころ

### オーバーロードの型定義は実装を考慮しない

オーバーロードのために定義された型は、あくまで関数の引数と返り値の組み合わせを定義しただけです。
また、オーバーロードされた関数は、定義された型をすべて満たしていればエラーになりません。

以下に簡単な例を示します。
型定義上は`number`の引数を受け取ったら`string`の値を返し、`string`の引数を受け取ったら`number`の値を返すようになっています。
しかし、実装上は受け取った値をそのまま返却する関数です。

```ts
function fn(val: number): string;
function fn(val: string): number;
function fn(val: number | string) {
  return val;
}

// const num: string !?
const num = fn(1);
// const str: number !?
const str = fn("1");
```

残念ながら、これはエラーになりません。
というのも、関数`fn`の型定義は`fn(val: number | string): string | number`となるため、オーバーロードの 2 つの型定義を全て満たしている扱いになるからです。

そのため、返り値の異なるオーバーロードを実装する際は、型推論を過信しないことが大事です。
そして、可能であればオーバーロードを使わずに関数を分けることが望ましいです。

### コールバックの引数の数だけが異なるオーバーロードは定義する必要がない

通常の関数で、引数の数が異なる同名の関数を定義したい場合は、オーバーロードする必要があります。

```ts
interface T {
  (arg1: string): void;
  (arg1: string, arg2: string, arg3: string): void;
}
const fn: T = (arg1: string, arg2?: string, arg3?: string) => {};
```

しかし、コールバック関数においては、引数の数だけが異なる場合はオーバーロードする必要がありません。
コールバック関数に渡される引数を、コールバック関数側で無視することは、JavaScript においては問題ないからです。

`Array.prototype.forEach`の型を例にとって解説します。
[Array | typescript - v3.7.5](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.array.html#foreach)に示されるように、`foreach`ではコールバック関数に、`value`, `index`, `array`の 3 つの引数を渡すように実装されています。

```ts
interface ReadonlyArray<T> {
  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEach(
    callbackfn: (value: T, index: number, array: readonly T[]) => void, // <- here
    thisArg?: any
  ): void;
}
```

上の型定義の通り、`foreach`の引数のコールバック関数はオーバーロードされていません。
しかし、以下のようにコールバック関数は任意の引数を受け取ることができます。

```ts
[1, 2, 3].forEach(() => {});
[1, 2, 3].forEach((val) => {});
[1, 2, 3].forEach((val, index) => {});
[1, 2, 3].forEach((val, index, array) => {});
```

参考: [Overloads and Callbacks](https://github.com/microsoft/TypeScript-Handbook/blob/master/pages/declaration%20files/Do's%20and%20Don'ts.md#overloads-and-callbacks)

### より一般的なオーバーロードより、より具体的なオーバーロードを先に定義する

関数呼び出し時に、引数が複数のオーバーロードにマッチする場合、TypeScript は最初にマッチするオーバーロードを採用します。
そのため、より一般的なオーバーロードを先に定義してしまうと、後に定義したオーバーロードが呼び出されなくなります。

```ts
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
```

```ts
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
```

参考: [Ordering](https://github.com/microsoft/TypeScript-Handbook/blob/master/pages/declaration%20files/Do's%20and%20Don'ts.md#ordering)

### 末尾の引数のみが異なるオーバーロードを定義したい場合は、任意引数を使用する

以下のように、末尾の引数のみが異なるオーバーロードの場合、オーバーロードを使用するのではなく任意引数を使用した方がよいです。

```ts
// 誤
interface T {
  (one: string): void;
  (one: string, two: string): void;
}

// 正
interface T {
  (one: string, two?: string): void;
}
```

本件の本題に入る前に、先程触れたコールバック関数の型定義について、以下の点を抑えておきます。
`コールバック関数に渡される引数を、コールバック関数側で無視することは、JavaScript においては問題無く、TypeScriptでも型エラーが発生しない`
つまり、以下のような挙動になります。

```ts
const fn = (f: (a: string, b: number) => void) => {};

// fnのコールバック関数の型にマッチしない(引数の数が少ない)
const callback = (one: string) => {};
// fnのコールバック関数の型にマッチする
const callback2 = (one: string, two: number) => {};

// どちらもエラーにならない
fn(callback); // No Error
fn(callback2); // No Error
```

上記の挙動とオーバーロードの挙動が組み合わさることで、以下のようなバグを埋め込まれる可能性があります。
以下の場合、2 番目のオーバーロードがコールバック関数の型定義を満たしていません。
しかし、1 番目のオーバーロードが満たしているため、エラーが表示されません。

```ts
const fn = (f: (a: string, b: number) => void) => {};

interface T {
  (one: string): void;
  // 上と異なり、twoの型をstringに変更 == fnの引数の型を満たさない
  (one: string, two: string): void;
}

const callback3: T = (one: string, two?: string) => {
  // two は `string | undefined` を期待する
  //しかし、関数fnのコールバック関数として定義された場合は `number` となってしまう
};
// 最初のオーバーロード `(one: string): void;` が引数の型を満たす
// そのため、2番目以降の型が不正であっても無視される
fn(callback3); // No Error
```

これを回避するには、オーバーロードではなく任意引数を使用する必要があります。
任意引数を使用した場合、以下のようにエラーが発生してくれます。

```ts
const fn = (f: (a: string, b: number) => void) => {};

interface T {
  (one: string, two?: string): void;
}

const callback3: T = (one: string, two?: string) => {};

// Argument of type 'T' is not assignable to parameter of type '(a: string, b: number) => void'.
// Types of parameters 'two' and 'b' are incompatible.
//   Type 'number' is not assignable to type 'string | undefined'.
fn(callback3); // Error
```

参考: [Use Optional Parameters](https://github.com/microsoft/TypeScript-Handbook/blob/master/pages/declaration%20files/Do's%20and%20Don'ts.md#use-optional-parameters)

### オーバーロードの引数の型のみが異なる場合、オーバーロードではなく union type を使用した方が良い

以下のようにオーバーロードを定義した場合、引数に`string`, `number`を渡すことはできるが、
`string | number`を渡すことはできません。

```ts
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
```

これが union type であれば、`string | number`でも引数に渡すことができます。

```ts
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
```

参考: [Use Union Types](https://github.com/microsoft/TypeScript-Handbook/blob/master/pages/declaration%20files/Do's%20and%20Don'ts.md#use-union-types)

### 返り値の異なるオーバーロードを定義する場合、返り値の型を`any`にする必要がある

以下のように返り値の異なるオーバーロードを定義する場合、実装関数の返り値の型が union type (`number | string`)だと、`Type 'string' is not assignable to type 'number'`というエラーが表示されます。

```ts
type T = {
  (val: number): number;
  (val: string): string;
};

// Type 'string' is not assignable to type 'number'
const fn: T = (val: number | string) => val;
```

そのため、実装関数の返り値の型を any にする必要があります。

```ts
// No Error
const fn: T = (val: number | string): any => val;

// const num: number
const num = fn(1);
// const str: string
const str = fn("1");
```

詳細は、以下の記事を参照していただけると嬉しいです。

[【TypeScript】返り値の異なるオーバーロードを定義する場合、返り値の型を`any`にする必要がある](https://qiita.com/eyuta/items/e6c992422c33a2f28a9f)

## 所感

元々オーバーロードの存在しない JavaScript に対して TypeScript がオーバーロードを実装したせいか、挙動が不安定に感じます。
よほど処理が似通ってない限り、素直にメソッドを分割するのが良いと思います。

## 参考

- [Overloading arrow function return type should allow union type](https://github.com/microsoft/TypeScript/issues/33482)
- [TypeScript: オーバーロードメソッドを定義する方法](https://qiita.com/suin/items/7d6837a0342b36891099)
- [関数の型 - TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/type-system/functions#brdo)
  - [原本](https://basarat.gitbook.io/typescript/type-system/functions#overloading)
- [呼び出し可能オブジェクト - TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/type-system/callable)
  - [原本](https://basarat.gitbook.io/typescript/type-system/callable)
- [べき・べからず集 | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/declaration_files/dos_and_donts#function_overloads)
  - [原本](https://github.com/microsoft/TypeScript-Handbook/blob/master/pages/declaration%20files/Do's%20and%20Don'ts.md)
