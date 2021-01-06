# 【TypeScript】ジェネリクスのスコープを理解する

## はじめに

皆さんご存知の通り、TypeScript には[ジェネリクス](http://js.studio-kingdom.com/typescript/handbook/generics)という機能が存在します。

…さて　問題です。

<details>
<summary>以下の2つの型は、見ての通りジェネリクスの宣言場所が異なりますが、何が異なるでしょうか。
`type T1 = <T>(val: T) => T;`
`type T2<T> = (val: T) => T;`
(▶ をクリックすると回答が表示されます)
<s>え？ タイトルに書いてあるって？ かたい事言うなよ　たかがクイズじゃねーか</s>
</summary>
正解は、タイトルにある通り、ジェネリクスのスコープが異なります。
具体的には、`T1`のジェネリクスのスコープは、そのジェネリクスが宣言されたシグネチャ`<T>(val: T) => T`に留まります。
一方、`T2`のジェネリクスのスコープは、宣言されたシグネチャ全体`type T2<T> = (val: T) => T;`になります。
</details>
<br>
<br>

以下、詳しく解説します。

## 環境

TypeScript: v4.1.3

## コード

[Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/PTAEnsGQNBkQIZGsGBYAUACmQSlAXgHygN5KigAuAngA4CmoAKgIxagA8N2yAbgIYA2AXLRhy0A3KBCESFajQBMLXJlAce-GoNw1hSAL5p0WxEhChAnQyBmhkA-DIHWGQHYMgVQTAIgxJU6-BLJVaDRfOV8BWBoGRB7ScqyMfqqumkgSxvRYmIo0AMzuUrSpjASIRES+XP5qqsH5UQKlYmAAwpwAdvUA9sSgAGYAlvUAJqD1nAC21ADkNMMAdMQAzsgyqQAMACxoEtoG8WCySSmLGZ40i-I5EkQVJSInSkXRVcYAck1EAKIATi9NL6sGuvpxiMaABYZACUMgGeGQCTDDZAP0MQMA+wwgwANDPYnCh0IE3HlJPtvMxWGcYmVQrRwgorioAkJYoYMQlvMksntpNlFLl8ji2NdKhcMWs-kQEjJtrRdhjCQcjszLnjSl9eaAAMZNepTVptep0VTYvyuIqiYzIcicF6DSjESgvDAcmgSBVKlX1GSqOT1ACuAwARmaSVq0TrqkoDUahqbzaAOS73WbrYrle16qlVEzSdxtTxdWB9YbjcGLWSrRibTHVYtVIdwx6Xl6iinuGn-Zmg2ac-4y5GqUQC61w9jVXRkHQ0LWO6H1aA6FHbX1XQLFKqZLMB36h+wHZOI5989HO67E6rUshspwpqvywvjEv48fW+3N6vFowi8hloOb+Hi5f1+OY8qXt21cgAET-qeYBDt+-CAZ+rTftOsZzoBwGgAAgi8ADmrqUPUrRNG0mIjN+XQocMoAdEezStIeUwdCh-Rutw1DEI8AZZmaoDYbhoDDC2LwTLKQ5ul0vQzmqTD4fUKFsPBz4TvxPT8KJKE6HoA5-MYgD+8g4gBgSoAigzOKiQgssRmFmm0nBytQyFGqQRwGUQbQfE8pkABbIJc7Y8NwbqmQA1qq-B+M6lCqAANIZ3SUAAHvwXEhYaln8C8lCcN0ircKQtAANoALrak0HTdEFrkkI5JHIShAD8-ANKQlxoPw7C5d06wYkQAycOQTAAKpsIVcruZ5co+fUflFAFwWhRFUWuuWMVvJwpCqFlrgdQVzX5MQxVTKVFWgFVNX8B1WVlNosrGIAygw2IAQmaAJ0OgDmDIAgAyAB0MgDlDIAswyAFcMgD1DCYAAGNDfYAMgxcYA0eqwMC4KAKoMgAxDIA0QyQTts3zUhCNMFxJKHSdYB2QlTmAEWpgAOpoAoYo3eAd2AO0M8IvYAgwyAMcMgAWioAyvKwIAxdqAABRUOAPoMz3vV9v0A6pgAUroA98qAL8BGygFzn0-X9gNTWaINg4AFgxQ4AZgwOND7PQHdvXcB53mqjYgA03oAAHKAKj6eOAEEMwMSLFc3jFjDlys5-mUK4eC6LWGaBiajahjwo3vhjoCteQ+OAEkMgD52oAMhGAOoM7PQnC8L3drusDfrgAr8YAUQyACQKyBJKA8loKHEs8x132g6CYKAJoMsPUmAwf4zYmdZ+AoAHZlgryVlYvm4AhgyALEMgDJDOd32l+A9d44AaJrE6pgASDIAVgzIteE7fhZc2MDbpDjMHqAjS7aIAMrEC8BHO2gCGgUfq+I53mWKb8iBAA)

## 解説

### 2 種類の関数シグネチャの宣言方法

本題に入る前に、関数シグネチャの宣言方法について触れておきます。
ご存知の型は読み飛ばしてください。

関数シグネチャの宣言方法には、以下の 2 種類があります。これらが示す方は全く同一です。
普段使用するのは`ShortHand`かと思いますが、これは`LongHand`の書き方を省略したものとなります。

```ts
type LongHand = {
  (a: number): number;
};

type ShortHand = (a: number) => number;
```

参考: [関数の宣言](https://typescript-jp.gitbook.io/deep-dive/type-system/functions#no)

本記事では、スコープが分かりやすい`LongHand`を主に使用します。

### スコープの違い

実際に、先程省略記法で記述されたシグネチャを、元の形に戻してみます。
こうしてみると、スコープの違いが認識しやすくなると思います。

```ts
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
```

さらに、T3、T4 に全く同じ型(T3 はジェネリクスなし)を[オーバーロード](https://typescript-jp.gitbook.io/deep-dive/type-system/functions#brdo)すると、違いが明白です。
T3 では、`T`は 個々に宣言されたシグネチャでしか有効でないため、2 番目のシグネチャで使おうとするとエラーになります。
しかし、T4 の`T`は T4 全体で有効なため、2 番目のシグネチャでも有効です。

```ts
type T3 = {
  <T>(val: T): T;
  (val: T): T; // Cannot find name 'T'.ts(2304)
};

type T4<T> = {
  (val: T): T;
  (val: T): T; // No  Error
};
```

### バインドのタイミングの違い

また、この 2 つの宣言方法はジェネリクスがバインドされるタイミングも異なります。

- T1, T3(個々に宣言された方)
  - T1,T3 型の関数が実行されるタイミングでバインドされる
- T2, T4(全体に宣言された方)
  - T2,T3 型を使用するタイミングでバインドされる

具体的に見てみましょう。

```ts
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
```

T2, T4 はシグネチャを使用するタイミングでジェネリクスをバインドする必要があります。
以下のようにバインドをしない場合、エラーになります。

```ts
// Generic type 'T2' requires 1 type argument(s).
const t2: T2 = (val) => val;
```

T2,T4 にジェネリクスをバインドしたことにより、ジェネリクス`T`の型が number 型にバインドされます。
それにより、引数`val`の型も変わっていることも分かります。

次に、実際に宣言した関数を実行してみます。

```ts
const fn1: T1 = (val) => val;
const fn2: T2<number> = (val) => val;
const fn3: T3 = (val) => val;
const fn4: T4<number> = (val) => val;

const num1 = fn1(1); // const v1: 1
const num2 = fn2(2); // const v2: number
const num3 = fn3(3 as number); // const v3: number
const num4 = fn4(4); // const num4: number

const str1 = fn1(""); // const str: ""
const str2 = fn2(""); // Argument of type 'string' is not assignable to parameter of type 'number'.

const bind = fn1<string>(""); // const bind: string
```

この通り、先にジェネリクスに number 型をバインドした T2, T4 は、返り値も同じ number 型となります。
一方、T1,T3 は関数が実行されるタイミングでジェネリクスがバインドされているのが分かります。
(引数の型から TypeScript が型を推論し、推論結果をジェネリクス`T`にバインドしています。)

- num1: 引数の型が`1`なので、返り値の型も 1
- num3: 引数の型がアサーションにより number 型なので、返り値も number 型
- str1: 引数の型が`""`なので、返り値の型も`""`
- bind: 明示的に型を指定したため、返り値の型もそれに習って string 型となる

### 使い分け

実際に、よく使われる組み込み関数の[Array.prototype.map()](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.array.html#map)、[Array.prototype.foreach()](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.array.html#foreach)を例に、使い分けをしてみます。

それぞれの型は以下のようになっています。

```ts
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
```

実際に関数を実行してみることで、どう使い分けられているかイメージできるかと思います。

```ts
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
```

## 最後に

今回は foreach と map でしたが、他の array の関数もジェネリクスを理解する上でとても参考になるため、色々見てみるのもおすすめです！！

## 参考文献

- [プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)
- [ジェネリクス | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/generics)
- [Interface Array<T>](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.array.html#foreach)
