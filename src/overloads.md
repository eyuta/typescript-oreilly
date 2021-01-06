# 【TypeScript】オーバーロードの様々な書き方

## はじめに

TypeScript のオーバーロードには、大きく分けて以下の 2 つの書き方があります。

- [`function` を利用する](https://typescript-jp.gitbook.io/deep-dive/type-system/functions#brdo)
- `interface` や `type` に[呼び出し可能オブジェクト(Callable)](https://basarat.gitbook.io/typescript/type-system/callable)を定義する

それぞれの使い方についてまとめてみました。

## 環境

TypeScript: v4.1.3

## オーバーロードについて

最初に、TypeScript におけるオーバーロードについて軽く触れておきます。
既にご存知の方は読み飛ばしてください。

TypeScript は JavaScript のスーパーセットですが、元々の Javascript にはオーバーロードと呼ばれる機能はありません。
以下のように、関数の中で`typeof`を用いて引数の場合分けを行い、擬似的なオーバーロードを実装することは可能です。
しかし、他言語のように引数の異なる同名のメソッドを定義することはできません。

```js
// 第一引数がstring型の場合は NaN という文字列を返す
// 第二引数が指定されている場合は、第一引数と合算した結果を返す
// 第一引数のみが指定されている場合は、インクリメントした結果を返す
function increment(val, added) {
  if (typeof val === "string") {
    return "NaN";
  } else if (typeof val === "number") {
    if (typeof added !== "undefined") {
      return val + added;
    }
    return ++val;
  }
}
```

これを TypeScript で書き直すと以下のようになります。

```ts
// increment(
//    val: string | number,
//    added?: number | undefined
// ) : number | "NaN" | undefined
function increment(val: string | number, added?: number) {
  if (typeof val === "string") {
    return "NaN";
  } else if (typeof val === "number") {
    if (typeof added !== "undefined") {
      return val + added;
    }
    return ++val;
  }
}
// const result1: string | number
const result1 = increment("1"); // NaN

// const result2: string | number
const result2 = increment(1); // 2

// const result3: string | number
const result3 = increment(1, 2); // 3
```

この状態でも動作はします。
しかしこれでは、オーバーロードのメリットである`入力する型によって出力する型を切り替える`ことができません。
(引数がなんであれ、返り値の型は`string | number`となります)
`入力する型によって出力する型を切り替える`ために、以下のように実行する関数の前にオーバーロードで使用する型情報を記述してあげます。

```ts
function increment(str: string): string;
function increment(num: number): number;
function increment(num: number, added: number): number;
function increment(val: string | number, added?: number): string | number {
  if (typeof val === "string") {
    return "NaN";
  } else if (typeof val === "number") {
    if (typeof added !== "undefined") {
      return val + added;
    }
    return ++val;
  }
  return val;
}
// const result1: string
const result1 = increment("1"); // NaN

// const result2: number
const result2 = increment(1); // 2

// const result3: number
const result3 = increment(1, 2); // 3
```

[Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/GYVwdgxgLglg9mABDSAnApgW3WKAKAZylQC5EjUUBzASjIuoG4BYAKFElgWTSx3zAhMZQZgBG6VHUSiJqFu3DR4SFBAzZceUSKFyANIgCGAExPoTu8ZOmzJCjsu5qN-PADcjAG3rFqiAB8ZPUlDU3MTAH4rOWkGMCpA4OtURABvNkRkYEQ8KABPAAd0OBzPL0QAXmrEACJ4qlqadMysxAwoEFQkWoA5I17ahSyAX0R0LwJ0bNyC4tLEcqqa2rtUJpbWNpm8opKc8ItEAEIV8HNgFAsNjK3t9vRO7sXvRABqYzMLYbaR1qz-g8nkg3m9yj8-ncOl0kOC2JCAPQIxAQBBEB4EEBeKAARl8lASbFRYHRGEx2JxVR46j4WlqOKajEQSMQ-V6RLRcC86AAdF44FQ8GSsbiaGwWcTSehyVAAEwxSQcklQDEi2VUly0-A4mhMlmypUELm8-mC4XY2Vi1ji5GSlXmqAAZgVqEN9ulIsdGt4mm1hkteuRjsNxr5AqFHuxjqtQA)

こうすることで、他言語と同じように`入力する型によって出力する型を切り替える`ことができます。

## 使い方

### `function` を利用する

基本の書き方は上で記述した通りになります。
具体的には、

1. 実行する関数の前に、`function ${実行関数と同名} (${引数のシグネチャ}): ${返り値のシグネチャ}` を定義する
2. 実行する関数として、1.で定義したシグネチャをすべて受け取ることが可能な関数を定義する。この例の場合、
   - 第一引数は`string`と`number`の可能性があるため`string | number`とする
   - 第一引数は`number`と`undefined`(定義無し)の可能性があるため、オプショナル(`?`)とする
   - 返り値は`string`と`number`の可能性があるため`string | number`とする

もし、クラスメソッドとしてオーバーロードメソッドを定義する場合は、以下のようになります。

```ts
class Sample {
  increment(str: string): string;
  increment(num: number): number;
  increment(num: number, added: number): number;
  increment(val: string | number, added?: number): string | number {
    if (typeof val === "string") {
      return "NaN";
    } else if (typeof val === "number") {
      if (typeof added !== "undefined") {
        return val + added;
      }
      return ++val;
    }
    return val;
  }
}
const sample = new Sample();

// const result1: string
const result1 = sample.increment("1"); // NaN

// const result2: number
const result2 = sample.increment(1); // 2

// const result3: number
const result3 = sample.increment(1, 2); // 3
```

ちなみに、この記述方法はアロー関数では使用できません。

### `interface` や `type` に呼び出し可能オブジェクトを定義する

[呼び出し可能オブジェクト](https://typescript-jp.gitbook.io/deep-dive/type-system/callable)とは、上でも使用した`(${引数の型}): ${返り値の型}`で表記されるシグネチャのことです。
これを、`interface` や `type`の中で定義することで、オーバーロードを使用することができます。

```ts
type Increment = {
  (str: string): string;
  (num: number): number;
  (num: number, added: number): number;
};

const increment: Increment = (val: string | number, added?: number): any => {
  if (typeof val === "string") {
    return "NaN";
  } else if (typeof val === "number") {
    if (typeof added !== "undefined") {
      return val + added;
    }
    return ++val;
  }
  return val;
};

// const result1: string
const result1 = increment("1"); // NaN

// const result2: number
const result2 = increment(1); // 2

// const result3: number
const result3 = increment(1, 2); // 3
```

ちなみに、関数の宣言方法には 2 種類があります。
普段使用するのは`ShortHand`かと思いますが、これは`LongHand`の書き方を省略したものとなります。
上記で使用したように`LongHand`はオーバーロードで使用できますが、`ShortHand`ではできません。

```ts
type LongHand = {
  (a: number): number;
};

type ShortHand = (a: number) => number;
```

  参考: [関数の宣言](https://typescript-jp.gitbook.io/deep-dive/type-system/functions#no)

## 最後に

長くなってきたので、これらの違いについては、また別途記事を書きたいと思います。
呼び出し可能オブジェクトで any を使っている理由も、その時に一緒に書きます。

## 参考

- [Overloading arrow function return type should allow union type](https://github.com/microsoft/TypeScript/issues/33482)
- [TypeScript: オーバーロードメソッドを定義する方法](https://qiita.com/suin/items/7d6837a0342b36891099)
- [関数の型 - TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/type-system/functions#brdo)
  - [原本](https://basarat.gitbook.io/typescript/type-system/functions#overloading)
- [呼び出し可能オブジェクト - TypeScript Deep Dive 日本語版](https://typescript-jp.gitbook.io/deep-dive/type-system/callable)
  - [原本](https://basarat.gitbook.io/typescript/type-system/callable)
- [べき・べからず集 | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/declaration_files/dos_and_donts#function_overloads)
  - [原本](https://github.com/microsoft/TypeScript-Handbook/blob/master/pages/declaration%20files/Do's%20and%20Don'ts.md)


