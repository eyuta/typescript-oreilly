# 【TypeScript】 this のトリセツ(2. 多様性の this の型)

## はじめに

JavaScript でおなじみの this ですが、ご存知の通り、様々な落とし穴があります。
(通常のの function と arrow function で挙動が違う、呼び出し元次第で値が変わる、strict モードか否かで挙動が違う、等々)

TypeScript では、this におけるこれらの落とし穴を避けるための 以下の仕組みがあります。

1. [this パラメーター](https://qiita.com/eyuta/items/34fe3183f75afcd7eb12)
1. [This に関する Utility Type](https://qiita.com/eyuta/items/e0bf41c2cf5d89b6eb48)
1. [多様性の this の型(Polymorphic this types)](https://qiita.com/eyuta/items/38854ef61d502d0c1717)

それぞれの仕様をまとめてみました。

この記事では 多様性の this の型(Polymorphic this types)について説明します。

## 環境

TypeScript: v4.1.3

## コード

例 1: [Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/BTCUAIF4D5wbwLAChzgMYBsCGBnH4BlAUwBd5lVUsATa4ANywwFciAucAO2YFsAjIgCdQHYmTgBfCuCkouRAO6FSYAHQ06ARlABucAHp9yksmmZc+ALLMSWPhiJjwRAB4kinavieI5qakQO7gxMrBzc-EIQktKyqIbgAAqCAPYADkIkAJ7gAOQBQUS54NQpRPicKWSuAJY4ZCmc4NkZeWK5qiQ4wABMAMx9AJyg0pyK4Na29o4qoOq0wNqqBaREi7rIEqBgOqZIIBAw5HLmeMbHlOAaISzsXLwCwhwkABZ18HEyo+NiatfaegSYj2qFOVhsdgcTlc7k83lIF0oK2CjFu4QeUQ+sWkCQAcilwABRQSpQTfJSTSEzEh-BZLZFrAGbba6IA)

例 2: [Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/ATCWDsBcFMCcDMCGBjawCCtaIJ4B4AVAPmAG8BYAKBBAHoAqeqmke4AEWhlgFsJoAzsADuACy7jYwRABsZwSOOA9oPAEZwhAe3jTw0rLmADEkUAPg4FSgQAdoyUPFDQAJgsGQAdMxZsAAraI2DzAtrBuoMimaOjA8ACu4MhmWvqKptLIqLaQQgm2ClrWEWjBAOYJKlACXsAEStAAbnBWKopa7tFyAr40bIpo4ZHRMPFJKaBp8VpS0CiiwNAyqtBQYOlKwdhWSWbyg2ERrlExwBGQCbDgQojATbIJ0H2sIqJRi+bAyFpwjmorIrWNAAIS0WhWiH0DxkT3isgE0AANMBZsA9qADo1wO4dMCDDsfNQ-MBAsFEKFFOZMOUMPotGoAFYOSBAsQffFUoQAa2gOGEsy6UPO0HgcA2+OGJ1GaESyVS4CJLGAbAAkrouTSwNo+JAYK4UUlXKL+O4vglEe5EEJDlz7o9oEq-LQXs1WngAMpLAAeMBxQmIAAoXiApacYAAuYCBmFPKMEFEQY3eqPgKoaWAo7a4eMAbQAugBKYAAXhIsbQXw9SJD1mpsHKAH4o1CcC9C1G7VWCwBuF4MJjE-rAD2zPJ6AlGCBhGQoR0htgNL7tUSdZQJSAxG1bQxWKHuC5XG7SEViiLJNCQYqHEwqSc4J3Dskhb5aHhBCIAMX0n4mCvRlpAsa3B8OAl5KIK4p4ocyyrDUdSqqyXzQN69gpG4QKHtcC4nmB5SmKALT2rCla6M4sACKyFRVGsSFCCsAjbsKiI-DiBiVNUkAogAXnAxROMCOAAOQREsACOCSyHoVphFoAigGYLQ4RWqKDLAwjmI6wDqqiur6iiMErJxtyiQIY4YdO1qoDiEDlCi6AegAwqqqrfKI5LoVIkGwI+rwAAYBXkOG5gAjCFSIAEyRVFIX5l4ZmwJAgaBogKJqMWZYngAtMA6U4QFfkLi6Q7GGOgY-O+wTQN+zbRog8ZpfGGUkGm6hwB2dYCH2xIAL6+KxlEeINJZ1buUaBpRsC2cAAA+wCtRmhYFs1ZAvANdEepAU3gLSI0xg6UaTdNc0Le1UYqV8R07aWRC1pAOD2HiKkli9wAAERXeUb3dS8AkpbuXhurAOCBuYm3beUhbFhQJUgNmOA9sAtC0Peh1bbZBYvD1SwyIiq2w-eiPI6j0afbN83pu1mMlX1vXdT1haBoWP2UMlK0wyAEDcEgqDaYQJAoX6rhCJgOz82QtMgOtJ4jaFKIRfm3VS2kg2gFGqp4KdsAkLL4XAArLNw-FZXM0jKNa9TnPG4lTNEyjGta7dlC+IgXjODI3BszdEum8TFv5r4oBu5intM97pAM3bFNtbA1MM7bVBAA)

## 多様性の this の型(Polymorphic this types)

TypeScript では、this を型として扱うことができます。
これはインターフェースやクラスの関数の返り値に使用されます。
返り値に this を指定すると、関数の呼び出し元と同様の型を返すことができます。

### 例 1 (Set)

JS の組み込みオブジェクトの[Set](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Set)を例に、説明します。

以下は Set を簡略化したものになります。

```ts
class Set {
  add(value: number): this {}
}
new Set().add(1); // Set
```

add の返り値を this にしているため、add メソッドの返り値は Set になります。
次に、この Set を拡張したクラスを作成し、delete メソッドを用意します。

```ts
class MutableSet extends Set {
  delete(value: number) {}
}
new MutableSet().add(1); // MutableSet

// No Error
new MutableSet().add(1).delete(1);
```

このとき、`new MutableSet().add(1)`の返り値の型は Set ではなく、呼び出し元の MutableSet となります。
もし返り値に this ではなく Set を指定した場合、サブクラス(MutableSet)側でスーパークラス(Set)側の呼び出しが困難になります。

```ts
class Set {
  add(value: number): Set {} // this -> Set
}
new Set().add(1); // Set

class MutableSet extends Set {
  delete(value: number) {}
}

new MutableSet().add(1); // Set !

// Property 'delete' does not exist on type 'Set'.ts(2339)
new MutableSet().add(1).delete(1);
```

```ts
class MutableSet extends Set {
  delete(value: number) {}
  add(value: number): MutableSet {} // 毎回オーバーライドするひつようが出てくる
}
new MutableSet().add(1); // MutableSet
```

参考: [プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)

おまけ: 実際の Set の型定義は以下のようになります。

```ts
interface Set<T> {
  add(value: T): this;
  clear(): void;
  delete(value: T): boolean;
  forEach(
    callbackfn: (value: T, value2: T, set: Set<T>) => void,
    thisArg?: any
  ): void;
  has(value: T): boolean;
  readonly size: number;
}
```

参照: [lib.es2015.collection](https://github.com/microsoft/TypeScript/blob/master/lib/lib.es2015.collection.d.ts#L58)

### 例 2 (Array)

もうひとつの例として、Array を紹介します。
Array では、[every メソッド](https://github.com/microsoft/TypeScript/blob/master/lib/lib.es5.d.ts#L1331)や [sort メソッド](https://github.com/microsoft/TypeScript/blob/master/lib/lib.es5.d.ts#L1290) の返り値で this を使用しています。

````ts
interface Array<T> {
  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every<S extends T>(
    predicate: (value: T, index: number, array: T[]) => value is S,
    thisArg?: any
  ): this is S[];
  /**
   * Sorts an array in place.
   * This method mutates the array and returns a reference to the same array.
   * @param compareFn Function used to determine the order of the elements. It is expected to return
   * a negative value if first argument is less than second argument, zero if they're equal and a positive
   * value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
   * ```ts
   * [11,2,22,1].sort((a, b) => a - b)
   * ```
   */
  sort(compareFn?: (a: T, b: T) => number): this;
}
````

特に、every では this を[User-Defined Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)と組み合わせて使用しています。
つまり、every の引数に`type predicate`を返す関数を指定することで、呼び出し元の Array の型を TypeScript に推論させることができます。

```ts
const isString = (value: string | number): value is string =>
  typeof value === "string";

if (array.every(isString)) {
  array; // array: string[]
} else {
  array; // array: (string | number)[]
}
```

こういう使い方もできるんですね。

## 終わりに

TypeScript ではあまり触れることのない返り値の this ですが、知っておくことで柔軟なクラス定義ができそうです。

## 参考文献

- [プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)
- [this パラメータ | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/functions#this_parameters)
  - [原文(this parameters)](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters)
- [多様性の this の型(Polymorphic this types) | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/advanced_types#polymorphic_this_types)
  - [原文(Polymorphic this types)](https://www.typescriptlang.org/docs/handbook/advanced-types.html#polymorphic-this-types)
- [ThisParameterType<Type> | Documentation - Utility Types - TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype)
- [TSConfig Reference - Docs on every TSConfig - TypeScript](https://www.typescriptlang.org/tsconfig#noImplicitThis)
- [User-Defined Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)
