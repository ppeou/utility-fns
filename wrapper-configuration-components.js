import React, {useEffect, useState} from 'react';

const createDelay = (waitTime, value) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, waitTime * 1000);
  });
};

const Layer1 = ({children}) => {
  const [layer1Data, setLayer1Data] = useState(false);

  useEffect(() => {
    createDelay(5, {layer1Data: 'Config from Layer 1'}).then(r => {
      setLayer1Data(r);
    });
  }, [setLayer1Data]);

  return layer1Data ? React.cloneElement(children, layer1Data) : <h1>Loading Layer 1...</h1>
};

const Layer2 = ({children, layer1Data}) => {
  const [layer2Data, setLayer2Data] = useState(false);

  useEffect(() => {
    createDelay(5, {layer2Data: 'Config from Layer 2'}).then(r => {
      setLayer2Data(r);
    });
  }, [setLayer2Data]);
  return layer2Data ? React.cloneElement(children, {layer1Data, ...layer2Data}) : <h1>Loading Layer 2...{layer1Data}</h1>
};

const MyPage = ({layer1Data, layer2Data}) => {
  return <h1>App is Ready: {layer1Data} - {layer2Data}</h1>
};

const Component = () => {
  return (<Layer1>
    <Layer2>
      <MyPage />
    </Layer2>
  </Layer1>);
};

/* output:

// Loading Layer 1...
//    (wait for 5 secs)
// Loading Layer 2...Config from Layer 1
//    (wait for 5 secs)
// App is Ready: Config from Layer 1 - Config from Layer 2

*/
