import { EventEmitter } from "events";
import { type } from "os";

//  this parameter
(() => {
  function fn(this: void) {
    // 'this' implicitly has type 'any' because it does not have a type annotation.ts(2683)
    console.log(this);
  }
  fn(); // undefined

  const obj = { fn, param: 1 };
  obj.fn(); // { "param": 1 }
})();

(() => {
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
})();

(() => {
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
    address: "fuga",
    fn: obj.fn,
  };

  obj3.fn(); // "bar"
})();

(() => {
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
})();

(() => {
  const obj = {
    name: "foo",
    fn(this: { name: string }, age: number) {
      console.log(this.name);
      console.log(age);
    },
  };

  const obj4 = {
    name: "bar",
    address: "fuga",
    fn: obj.fn,
  };
  obj4.fn(10); // "bar", 10
})();

(() => {
  const fn = (callback: () => void) => callback();
  class Cls {
    name = "foo";
    fn(this: Cls) {
      console.log(this.name);
    }
  }
  const cls = new Cls();
  fn(cls.fn); // TypeError: Cannot read property 'name' of undefined
})();

(() => {
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
})();

(() => {
  const fn = (callback: () => void) => callback();
  class Cls {
    name = "foo";
    fn() {}
    arrow = () => {
      console.log(this.name);
    };
  }
  const cls = new Cls();
  fn(cls.fn);
})();

//Polymorphic this types
(() => {
  class Set {
    has(value: number): boolean {}
    add(value: number): Set {}
  }
  new Set().add(1).has(1);
})();

// ThisParameterType\<Type>
(() => {
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

  // type FnOmitThisParameter = (age: number) => string
  type FnOmitThisParameter = OmitThisParameter<Fn>;

  const obj: ThisType<FnThisParameterType> = {
    fn() {
      this.name; // OK
      this.age; // Property 'age' does not exist on type '{ name: string; }'.ts(2339)
    },
  };
})();

(() => {
  function fn(this: { name: string }, age: number): string {
    return this.name;
  }

  interface CallableFunction {
    bind<T>(this: T, thisArg: ThisParameterType<T>): OmitThisParameter<T>;
  }

  // const bound: (age: number) => string
  const bound = fn.bind({ name: "foo" });
  bound(2); //OK
  // Argument of type '{ age: number; }' is not assignable to parameter of type '{ name: string; }'.
  fn.bind({ age: 1 });
})();

// Polymorphic this types

(() => {
  class Set {
    add(value: number): Set {}
  }
  new Set().add(1); // Set

  class MutableSet extends Set {
    delete(value: number) {}
  }
  // Property 'delete' does not exist on type 'Set'.ts(2339)
  new MutableSet().add(1).delete(1);
})();

(() => {
  class Set {
    add(value: number): this {}
  }
  new Set().add(1); // Set

  class MutableSet extends Set {
    delete(value: number) {}
  }
  // No Error
  new MutableSet().add(1).delete(1);
})();

(() => {
  interface Array<T> {
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
})();
(() => {
  interface I<T> extends Array<T> {}
  const a = [1, 2];
  const i: I<number> = [1, 2];

  a.sort(); // number[]
  i.sort(); // I<number>

  a.filter(() => {}); // number[]
  i.filter(() => {}); // number[]
})();

(() => {
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
  const test = (array: (string | number)[]) => {
    const isString = (value: string | number): value is string =>
      typeof value === "string";

    if (array.every(isString)) {
      array; // array: string[]
    } else {
      array; // array: (string | number)[]
    }
  };
})();

(() => {
  interface I<T> extends Array<T> {}
  const a = [1, 2];
  const i: I<number> = [1, 2];

  a.sort(); // number[]
  i.sort(); // I<number>

  a.filter(() => {}); // number[]
  i.filter(() => {}); // number[]
})();
