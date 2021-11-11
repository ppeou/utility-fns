import layoutBasePage from './layout/base-page';
import pageContent from './page/content';
import pageFooter from './page/footer';
import pageHeader from './page/header';
import layoutSiteMenu from './layout/site-menu';
import siteMenuItem from './site-menu/site-menu-item';
import nativeComponents from './native/index';

const allComponents = [
  layoutSiteMenu,
  layoutBasePage,
  pageContent,
  pageFooter,
  pageHeader,
  siteMenuItem,
  ...nativeComponents
];

const compMap = allComponents.reduce((p, [field, comp]) => {
  p[field] = comp;
  return p;
}, {});

const defaultComponent = (props, cKeyIndex) => {
  const {component, data_field, items, engine} = props;
  return (<section>
      <h4>Not Found: {component}</h4>
      {items && items.map((c, idx) => engine(c, `${cKeyIndex}-${idx}`))}
    </section>
  );
};

const getComponent = (compName) => {
  const idealComp = compMap.hasOwnProperty(compName) ? compMap[compName] : undefined;
  return idealComp || defaultComponent;
};


const engine = (props, cKeyIndex) => {
  const component = props.component;
  const Component = getComponent(component);
  return <Component {...props} index={cKeyIndex} key={cKeyIndex}/>
};

const UiEngine = (props, cKeyIndex) => {
  return engine({...props, engine}, cKeyIndex);
};

export {UiEngine};

/*import './ui-engine.module.less';
export function UiEngine(props) {
  return (
    <div>
      <h1>Welcome to UiEngine!</h1>
    </div>
  );
}
export default UiEngine;*/
