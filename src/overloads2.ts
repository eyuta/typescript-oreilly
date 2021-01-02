// オーバーロードなし
(() => {
  const fn = (val: number | string) => val;

  // const num: string | number
  const num = fn(1);
  // const str: string | number
  const str = fn("1");
})();

// オーバーロードあり
(() => {
  type T = {
    (val: number): number;
    (val: string): string;
  };

  // Error
  // Type '(val: number | string) => string | number' is not assignable to type 'T'.
  //   Type 'string | number' is not assignable to type 'number'.
  //     Type 'string' is not assignable to type 'number'.ts(2322)
  const fn: T = (val: number | string): number | string => val;

  // const num: number
  const num = fn(1);
  // const str: string
  const str = fn("1");
})();

//返り値変更
(() => {
  type T = {
    (val: number): number;
    (val: string): string;
  };

  // No Error
  // const fn: T = (val: number | string): any => val;
  const fn: T = (val: number | string) => val as any;

  // const num: number
  const num = fn(1);
  // const str: string
  const str = fn("1");
})();

//返り値 が &
(() => {
  type T = {
    (val: number): number;
    (val: string): string;
  };

  // No Error
  const fn: T = (val: number | string): number & string => val as never;

  // const num: number
  const num = fn(1);
  // const str: string
  const str = fn("1");
})();

// functionだと発生しない
(() => {
  function fn(val: number): number;
  function fn(val: string): string;
  function fn(val: number | string) {
    return val;
  }

  // const num: number
  const num = fn(1);
  // const str: string
  const str = fn("1");
})();
