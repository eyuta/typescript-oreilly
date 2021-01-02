# 【TypeScript】返り値の異なるオーバーロードを定義する場合、返り値の型を`any`にする必要がある

## はじめに

昨日、[TypeScript のオーバーロードの様々な書き方](https://qiita.com/eyuta/items/73b9b3af5f9820f74ae7)についてまとめてみました。
本日は、オーバーロードの挙動確認中に遭遇した不思議な仕様について紹介します。

## 環境

TypeScript: v4.1.3

## コード

[Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/PTAEiqGQfhkBYZMW4ZKEmGQVgyHUGAsAKABTYJSgC8AfKAN5aigDGA9gHYDOALqAGb1GjYBuAhgBsAXKHoBXALYAjAKYAnUAB9QLOQEt6AcwIlQ-AQG4slUCBoMWoySNUbNSq9Pkm6TVuIlcO2AIx4jmFRmrpaqNszqWg4esnIuFqyqXvTYAEQ+qf5YAL54+AFYZlCwCIiAQgyAUQxYuDqkFIGgzACeAA4yoAAqXPVUVLyCIjHyeIOSsQG93PrhkdozdhOg2QUNZgCicnK0catgHa3tAOT9wo6xDrZatSoRdtFj8oegaoyitKx8jIxqmvR8UgJ2sxaI0DqBDh1DgA6ExmKj7Nrgy72ZRDORPF5vD5fH5-AFAkHNRGHNHQ2FgSYIo7IjGvejvUCfb6-f6AxqEsEkh7oqHMRjYABMAGYBQK8PE3Ox6CIuoQpgMzvILrcrqMnAplMiiKR9CsgmAQu5rIqdlRDY5kr4srtzJKwjdZhLQhFLelMgFcvljJgQIAV+IqgBIFQCQmoAXs2q+G15BMRPasqjDT60xNIxNi0TCuRKeRi2W3v1oAAciCNltTaYDQkpTKuCc1edNSq5oz6E1I7qnawONW5bWTcrZtd9IzXnwW3ry7bLB4684GuaPJa-ItgpX7ciOw7XRlrZ7rYVgP6A6BADIMoAAZOHrj1QYi49f06c0Sm0Wn5adM-MtDnx2Yi6AS9sG5dp0NZJmi-Z2M+3Lng6dy6EOnyiDIPDyD+FaStOJobgucreEu5KTokESfpoG5JLhKRujueR7j6YBsGI9DUMwagMIABgyABYMgBeboA+K6oMggAiDJekbXgxTEsQwUq9k+M5yIsYnMaxnDeEmH6wV+JgKRJykpGB0ENgO8aTHIMjMGIcicO2DTZHmE7zsaaLYZIi7Wvm5pro2ZEuhRaTbh6NEBEAA)

## 結論

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

## 詳細

※こちらは[呼び出し可能オブジェクト(Callable)](https://basarat.gitbook.io/typescript/type-system/callable)を用いてオーバーロードを定義する場合に限ります。

具体例を見てみましょう。
以下で定義されている`T`は、引数に`string | number`を受け取り、受け取った引数をそのまま返す関数になります。
当然、返り値の型は`string | number`となります。

```ts
// const fn: (val: number | string) => string | number
const fn = (val: number | string) => val;

// const num: string | number
const num = fn(1);
// const str: string | number
const str = fn("1");
```

この関数にオーバーロードを使用して、以下のような型を返すようにします。

- 引数の型が`string`であれば、返り値の型は`string`
- 引数の型が`number`であれば、返り値の型は`number`

そうすると以下のようになります。
しかし、このように定義した場合、以下に記述したようなエラーが表示されます。

```ts
type T = {
  (val: number): number;
  (val: string): string;
};

// Error
// Type '(val: number | string) => string | number' is not assignable to type 'T'.
//   Type 'string | number' is not assignable to type 'number'.
//     Type 'string' is not assignable to type 'number'.ts(2322)
const fn: T = (val: number | string) => val;

// const num: number
const num = fn(1);
// const str: string
const str = fn("1");
```

これを解消するには、返り値の型を`any`にする必要があります。

```ts
type T = {
  (val: number): number;
  (val: string): string;
};

// No Error
const fn: T = (val: number | string): any => val;
// or const fn: T = (val: number | string) => val as any;

// const num: number
const num = fn(1);
// const str: string
const str = fn("1");
```

TypeScript のオーバーロードの仕様上、オーバーロードを使用している関数 (この場合は`fn`)は、それぞれの型を同時に満たす必要があります。

```ts
const num: number = fn(1);
const str: string = fn("1");
```

つまり、引数の型は`number | string` である必要があり、返り値の型は`number & string`である必要があるようです。
参考: [Overloading arrow function return type should allow union type](https://github.com/microsoft/TypeScript/issues/33482#issuecomment-533058120)

実際、以下のように`fn`を定義すると、エラーが消えます。

```ts
const fn: T = (val: number | string): number & string => val as never;
```

また、この挙動は[呼び出し可能オブジェクト(Callable)](https://basarat.gitbook.io/typescript/type-system/callable)を用いてオーバーロードを定義した場合のみ発生し、`function`を用いてオーバーロードした場合は発生しません。

```ts
function fn(val: number): number;
function fn(val: string): string;
function fn(val: number | string) {
  return val;
}

// const num: number
const num = fn(1);
// const str: string
const str = fn("1");
```

## 参考

- [Overloading arrow function return type should allow union type](https://github.com/microsoft/TypeScript/issues/33482)
- [関数の型 - TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/type-system/functions#brdo)
  - [原本](https://basarat.gitbook.io/typescript/type-system/functions#overloading)
- [呼び出し可能オブジェクト - TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/type-system/callable)
  - [原本](https://basarat.gitbook.io/typescript/type-system/callable)
