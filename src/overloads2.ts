
type Overloaded = {
  (a: number): number;
  (a: string): string;
};

(() => {
  class PlusOne {
    plusOne(num: number): number;
    plusOne(str: string): string;
    plusOne(val: string | number) {
      if (typeof val === "string") {
        return val + "1";
      }
      return val + 1;
    }
  }
  const num = new PlusOne().plusOne(1);
  const str = new PlusOne().plusOne("1");
})();
// interface AddFunc {
//   (num1: number, num2: number): number;
// }
type AddFunc = { (num1: number, num2: number): number };
const addFunc: AddFunc = (a, b) => {
  return a;
};

(() => {
  type IOverload = {
    (param: number): number[];
    (param: object): object[];
  };

  const overloadedArrowFunc: IOverload = (param) => {
    return [param, param];
  };

  let val = overloadedArrowFunc(4);
  let val2 = overloadedArrowFunc({ a: 4 });
})();

// 引数なしだと string 型
function unsafeFunc(): string;
// number 型の引数を渡すと number 型
function unsafeFunc(n: number): number;
// 二つの型情報を満たす実装
function unsafeFunc(n?: number): number | string {
  // 実際には、number 型の引数を渡すと string 型 が返る
  if (n) return n.toString();
  // 実際には、引数なしだと number 型 が返る
  return 0;
}

unsafeFunc();

class Dog {
  kind: "dog" = "dog";
  speak() {
    console.log("bow-wow");
  }
}
class Bird {
  kind: "bird" = "bird";
  speak() {
    console.log("tweet-tweet");
  }
  fly() {
    console.log("flutter");
  }
}
type Pet = Dog | Bird;

function havePet(pet: Pet) {
  pet.speak();
  switch (pet.kind) {
    case "bird":
      pet.fly();
  }
}

function toUpperCase(x: string): number; // Return Numberに変更
function toUpperCase(x: number): number;
function toUpperCase(x: string | number) {
  return x;
}

const upperHello = toUpperCase("Hello"); //no error

function func(
  v: any,
  { o1 = "default-value", o2 = 1000 }: { o1?: string; o2?: number } = {}
) {
  console.log(o1, o2);
}

(() => {
  function copy<T extends { name: string }, U extends keyof T>(
    value: T,
    key: U
  ): T {
    //◆
    value[key];
    return value;
  }
  console.log(copy({ name: "Quill", age: 38 }, "name"));
  type K = Readonly<keyof { name: string; age: number }>;
})();
(() => {
  interface FuncA {
    (a: number, b: string): number;
    (a: string, b: number): number;
  }
  interface FuncA {
    (a: string): number;
  }
  let intersection: FuncA & FuncA; //★
  intersection = function (a: number | string, b?: number | string) {
    return 0;
  };
})();

interface Example {
  diff(one: string): number;
  diff(one: string, two: string): number;
  diff(one: string, two: string, three: boolean): number;
}
function fn(x: (a: string, b: number, c: number) => void) {}

var x: Example = { diff: (one: string, two?: string) => 1 };
fn(x.diff);

const overloaded: {
  (foo: string): string;
  (foo: number): number;
} = (foo: any) => foo;

(() => {
  interface Overloaded {
    (foo: string): string;
    (foo: number): number;
  }

  // example implementation
  function stringOrNumber(foo: any): any {
    if (typeof foo === "number") {
      return foo * foo;
    } else if (typeof foo === "string") {
      return `hello ${foo}`;
    }
  }

  const overloaded: Overloaded = stringOrNumber;

  // example usage
  const str = overloaded(""); // type of `str` is inferred as `string`
  const num = overloaded(123); // type of `num` is inferred as `numbe
})();
