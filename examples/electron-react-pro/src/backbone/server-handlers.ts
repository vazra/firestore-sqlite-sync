type TAnyArry = any[];
type THandlerFun = (...args: any[]) => Promise<any>;

export type THandlers = {
  [x: string]: THandlerFun;
};

let _history: TAnyArry = [];

let handlers: THandlers = {};

handlers["make-factorial"] = async ({ num }) => {
  _history.push(num);

  function fact(n: number): number {
    if (n === 1) {
      return 1;
    }
    return n * fact(n - 1);
  }

  console.log("making factorial");
  return fact(num);
};

handlers["ring-ring"] = async () => {
  console.log("picking up the phone");
  return "hello!";
};

export default handlers;
