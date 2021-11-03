const Comp1 = () => {
  return ({children}) => {
    return <article>
      <h1>Comp1</h1>
      {children}
    </article>;
  };
};
const Comp2 = (ParentComp) => {
  return ({children}) => {
    return (<ParentComp>
      <section>
        <h1>Comp2</h1>
        {children}
      </section>
    </ParentComp>);
  };
};
const Comp3 = (ParentComp) => {
  return ({children}) => {
    return (<ParentComp>
      <div>
        <h1>Comp3</h1>
        {children}
      </div>
    </ParentComp>);
  };
};
