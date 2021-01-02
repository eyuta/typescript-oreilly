// js ver
(() => {
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
      return val++;
    }
  }
})();

// Overloadを使わない場合
(() => {
  // increment(
  //    val: string | number,
  //    added?: number | undefined
  // ) : number | "NaN" | undefined
  function increment(val: string | number, added?: number): string | number {
    if (typeof val === "string") {
      return "NaN";
    } else if (typeof val === "number") {
      if (typeof added !== "undefined") {
        return val + added;
      }
      return val++;
    }
    return val;
  }
  // const result1: string | number
  const result1 = increment("1"); // NaN

  // const result2: string | number
  const result2 = increment(1); // 2

  // const result3: string | number
  const result3 = increment(1, 2); // 3
})();

// Overloadを使う場合
(() => {
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
      return val++;
    }
    return val;
  }
  // const result1: string
  const result1 = increment("1"); // NaN

  // const result2: number
  const result2 = increment(1); // 2

  // const result3: number
  const result3 = increment(1, 2); // 3
})();

// Overloadを使う場合
(() => {
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
        return val++;
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
})();

// Callable
(() => {
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
      return val++;
    }
    return val;
  };

  // const result1: string
  const result1 = increment("1"); // NaN

  // const result2: number
  const result2 = increment(1); // 2

  // const result3: number
  const result3 = increment(1, 2); // 3
})();
