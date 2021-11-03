const base = (input) => {
  const instance = {
    value: input,
    doA: (input) => { instance.value = `${instance.value} -> ${input}`; return instance; },
    doB: (input) => { instance.value = `${instance.value} -> ${input}`; return instance; },
    doC: (input) => { instance.value = `${instance.value} -> ${input}`; return instance; },
  };

  return instance;
};


const fn = base('hello');
const output = fn.doA('doA').doB('doB').doC('doC').value;

console.log(output); //hello -> doA -> doB -> doC
