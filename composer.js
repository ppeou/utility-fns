const doA = (input) => `${input} -> doA`;
const doB = (input) => `${input} -> doB`;
const doC = (input) => `${input} -> doC`;

const composerStyle1 = (fns) => {
  return (input) => {
    return fns.reduce((p, fn) => {
      return fn(p);
    }, input);
  };
};

const composerStyle2 = (...fns) => {
  return (input) => {
    return fns.reduce((p, fn) => {
      return fn(p);
    }, input);
  };
};

const composedFns1 = composerStyle1([doA,doB,doC]);
const output1 = composedFns1('composerStyle1');
console.log(output1); //composerStyle1 -> doA -> doB -> doC

const composedFns2 = composerStyle1(doA,doB,doC);
const output2 = composedFns1('composerStyle2');
console.log(output2); //composerStyle2 -> doA -> doB -> doC
