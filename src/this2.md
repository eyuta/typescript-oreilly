# 【TypeScript】 this のトリセツ(2. This に関する Utility Type)

## はじめに

JavaScript でおなじみの this ですが、ご存知の通り、様々な落とし穴があります。
(通常のの function と arrow function で挙動が違う、呼び出し元次第で値が変わる、strict モードか否かで挙動が違う、等々)

TypeScript では、this におけるこれらの落とし穴を避けるための 以下の仕組みがあります。

1. [this パラメーター](https://qiita.com/eyuta/items/34fe3183f75afcd7eb12)
1. This に関する Utility Type
1. 多様性の this の型

それぞれの仕様をまとめてみました。

この記事では、This に関する Utility Type について説明します。

## 環境

TypeScript: v4.1.3

## コード

[Playground Link](https://www.typescriptlang.org/play?ts=4.1.3#code/ATBmFcDsGMBcEsD2kyQBSwBbwM4C5gBvYSAQwFsBTAnWAJ3kgHNgBfAGmFKepPHIBGlOgEoa9Ri0IBYAFAgQdSrHB0UWXADoyVANxyQrA8AD0J4LACeAB0rAAYigC8wDNnxFjZhSB29aDMz68qbmHFw8BJD8QqLATgB8wAGSxla2Ds4WNpSIoKjBXubpdgAKpHQU8cAA2ty80YLCALppOcDlleTVnRTKwjgAPI4JhSHeJZkAKu69VLDCU+0uMuPmvn3igUzBIN5GIZOOM7hz-XRLGS4nOGcLFznDkKNyRdkZjgDy5PCwN3fCapoepRGLCETxJIpZhtD6Qb6-f4VPr3aoIv6zZHzYRPF6yYzQZC0YCIAQAKwIN0ulCeSK652pSRWxhAoHQENWPhAGhw2j6ulCwE+AGkWQoeZp6gLvKU6IhbHQrMAAOT1ZXAAAmiEoOBIiFgwEoAA9cAbkO87MriH4tpIBaxlZpYDg0AAmADM7oAnCIxRxjKxdEA)

## 前提

本記事は以下の前提で書いています。

```
モード: Strict モード
tsconfig: `noImplicitThis`が有効
```

## This に関する Utility Type

### ThisParameterType\<Type>

通常、引数の型を取得する`Parameters`型では、this の型は取得できません。
そこで、`ThisParameterType`を使うことで、this パラメーターの型を取得することができます。

```ts
function fn(this: { name: string }, age: number): string {
  return this.name;
}
// type Fn = (this: {
//     name: string;
// }, age: number) => string
type Fn = typeof fn;

// type Param = [age: number]
type Param = Parameters<Fn>;

// type FnThisParameterType = {
//   name: string;
// }
type FnThisParameterType = ThisParameterType<Fn>;
```

### OmitThisParameter\<Type>

関数の型から、this パラメーターの型を除いたものを取得します。

```ts
function fn(this: { name: string }, age: number): string {
  return this.name;
}
type Fn = typeof fn;

// type FnOmitThisParameter = (age: number) => string
type FnOmitThisParameter = OmitThisParameter<Fn>;
```

これは、`ThisParameterType`と合わせて関数の[bind メソッドの型](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_es5_d_.callablefunction.html#bind)で使われています。
bind メソッドの型は以下のように定義されます。

```ts
interface CallableFunction extends Function {
  // ThisParameterTypeを使用しているオーバーロードのみ表示
  bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
}
```

これは、

- 引数`thisArg`に、レシーバの関数`T`の this パラメーターを要求
- 返り値は、レシーバの関数`T`から this パラメーターを取り除いたものを返却

という意味合いになります。

実際に上で宣言した fn 関数の bind を呼び出すと以下のようになります。

```ts
function fn(this: { name: string }, age: number): string {
  return this.name;
}

// const bound: (age: number) => string
const bound = fn.bind({ name: "foo" });
bound(2); //コンテキストは this:void だが、エラーにならない

// Argument of type '{ age: number; }' is not assignable to parameter of type '{ name: string; }'.
fn.bind({ age: 1 });
```

`ThisParameterType<T>`は`{name: string}`となるため、bind メソッドに`{age: 1}`を渡した場合、型エラーとなります。

また、`OmitThisParameter<T>`は`(age: number) => string`となります。
これにより、bind メソッドの返り値の関数に対して、`fn`で定義した this とコンテキストの異なる状態で実行してもエラーになりません。

### ThisType\<Type>

\<Type>に与えられたオブジェクトのコンテキストにおける this の型を定義します。
以下の例では、obj の型に`ThisType<FnThisParameterType>`を指定しています。
つまり、この obj 内で使用できる this の型が`FnThisParameterType`となります。
`FnThisParameterType`は name property だけを持つ Interface です。
そのため、`obj.fn`では`this.name`は参照できますが、`this.age`は参照できません。

```ts
function fn(this: { name: string }, age: number): string {
  return this.name;
}
type Fn = typeof fn;
type FnThisParameterType = ThisParameterType<Fn>;
const obj: ThisType<FnThisParameterType> = {
  fn() {
    this.name; // OK
    this.age; // Property 'age' does not exist on type '{ name: string; }'.ts(2339)
  },
};
```

使い所が無さそうに見えるのですが、私の身近なところでは[`Vue.extends`](https://jp.vuejs.org/v2/api/index.html#Vue-extend)に使われていました。
Vue では、props や data で宣言した値を、computed や methods 内の this から参照することができます。
さらに、`Vue.extends`を使うと this について型推論することもできます。

```ts
var Profile = Vue.extend({
  template: "<p>{{firstName}} {{lastName}} aka {{alias}}</p>",
  data: function () {
    return {
      firstName: "Walter",
      lastName: "White",
      alias: "Heisenberg",
    };
  },
  methods: {
    getName() {
      // firstName, lastName, aliasが型推論される
      return this.firstName + this.lastName;
    },
  },
});
```

この実装に、ThisType が使われていました。
どうやら、data や prop, computed 等々をまとめたものを ThisType に渡し、その結果を Vue.extends の引数の options に指定しているようです。

```ts
export type ThisTypedComponentOptionsWithArrayProps<
  V extends Vue,
  Data,
  Methods,
  Computed,
  PropNames extends string
> = object &
  ComponentOptions<
    V,
    DataDef<Data, Record<PropNames, any>, V>,
    Methods,
    Computed,
    PropNames[],
    Record<PropNames, any>
  > &
  ThisType<
    // here
    CombinedVueInstance<
      V,
      Data,
      Methods,
      Computed,
      Readonly<Record<PropNames, any>>
    >
  >;
```

```ts
export interface VueConstructor<V extends Vue = Vue> {
  new <
    Data = object,
    Methods = object,
    Computed = object,
    PropNames extends string = never
  >(
    options?: ThisTypedComponentOptionsWithArrayProps<
      V,
      Data,
      Methods,
      Computed,
      PropNames
    >
  ): CombinedVueInstance<V, Data, Methods, Computed, Record<PropNames, any>>;
  // ...
}
```

引用:

- [vue/types/options.d.ts](https://github.com/vuejs/vue/blob/dev/types/options.d.ts#L50)
- [vue/types/vue.d.ts](https://github.com/vuejs/vue/blob/dev/types/vue.d.ts#L81)

## 最後に

個人的には一番最後の`ThisType`に感動しました。
Vue options api のあの不思議な型推論は、これを使って実装されていたんですね……。

## 参考文献

- [プログラミング TypeScript ――スケールする JavaScript アプリケーション開発](https://www.oreilly.co.jp/books/9784873119045/)
- [this パラメータ | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/functions#this_parameters)
  - [原文(this parameters)](https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters)
- [多様性の this の型(Polymorphic this types) | TypeScript 日本語ハンドブック | js STUDIO](http://js.studio-kingdom.com/typescript/handbook/functions#this_parameters)
  - [原文(Polymorphic this types)](https://www.typescriptlang.org/docs/handbook/advanced-types.html#polymorphic-this-types)
- [ThisParameterType<Type> | Documentation - Utility Types - TypeScript](https://www.typescriptlang.org/docs/handbook/utility-types.html#thisparametertypetype)
- [TSConfig Reference - Docs on every TSConfig - TypeScript](https://www.typescriptlang.org/tsconfig#noImplicitThis)
