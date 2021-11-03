const doA = (input) => `${input} -> doA`;
const doB = (input) => `${input} -> doB`;
const doC = (input) => `${input} -> doC`;

const compose = (fns) => {
  return (input) => {
    return fns.reduce((p, fn) => {
      return fn(p);
    }, input);
  };
};


const composedFns = compose([doA,doB,doC]);

const output = composedFns('hello');

console.log(output); //hello -> doA -> doB -> doC
