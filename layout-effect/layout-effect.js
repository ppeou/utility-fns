import {enhanceDataField, getValue} from './utils';

const buildPrefix = (level, token = '  ') => {
  const arr = [];
  for (let i = 0; i < level; i++) {
    arr.push(token);
  }
  return arr.join('');
};

const withData = (layout, data, parentField = []) => {
  const staticValueField= '---';

  if(layout.config && layout.config.items && !layout.items) {
    layout.items = layout.config.items;
  }

  const {component, field: cmsField, items: cmsChildren = [], config = {}} = layout;
  const useStaticValue = cmsField === staticValueField;

  const {currentPath, ...path} = enhanceDataField(parentField, cmsField);

  const value = useStaticValue ? (config || {}).defaultValue : getValue(data, path.full);

  let items = cmsChildren;
  if (path.isArrayField) {
    //if(cmsField === 'categories:array') {debugger;}
    const tempChildren = (value || []).reduce((p, arrItemData, idx) => {
      const a = cmsChildren.map(({...item}) => {
        const {field: df} = item;
        const _df = df === '.' ? `${idx}` : `${idx}.${df}`;
        item.field = _df;
        return item;
      });
      return [...p, ...a];
    }, []);

    Object.assign(items, tempChildren);
  }

  items = cmsChildren.map(item => {
    return withData(item, data, currentPath, parentField.length + 1);
  });

  return {
    component,
    config: {...config},
    field: useStaticValue ? staticValueField : path.full,
    items,
    value,
    extra: {
      path,
      cms: {
        field: cmsField,
        config
      }
    }
  };
};

const withConfig = (layout, rules, rootValue = {}, level = 0) => {
  const {field: dataField, value, items = []} = layout;

  if (!level) {
    rootValue = value;
  }

  let effects = rules[dataField];
  if (effects) {
    effects = Array.isArray(effects) ? effects : [effects];
    effects.forEach(effect => effect(rootValue, value, layout));
  }
  items.forEach((item) => {
    withConfig(item, rules, rootValue, level ? level + 1 : 1);
  });
  return layout;
};

const layoutEffect = (layout, data, rules) => {
  const layoutWithData = withData(JSON.parse(JSON.stringify(layout)), data);
  const layoutWithConfig = withConfig(layoutWithData, rules);
  return layoutWithConfig;
};

export {
  withConfig,
  withData,
  layoutEffect,
};
export default layoutEffect;
//------- Utils -------------//
import {get} from 'lodash';

const createGetCleanPath = () => {
  const removeDoubleDot = input => input.replace(/\.+/g, '.');
  const removeLeadingTrailingDot = input => input.replace(/^\.+|\.+$/g, '');
  const getCleanPath = (input) => removeDoubleDot(removeLeadingTrailingDot(input));

  return getCleanPath;
};

const getCleanPath = createGetCleanPath();


const enhanceParentPathDataField = (dataField, parentPath) => {
  if(dataField.substr(0, 3) === '../') {
    const temp = dataField.split("../");
    const tempField = temp.pop();
    let newArr = [...parentPath].join('.').split('.');

    newArr.splice(newArr.length - temp.length);

    return [...newArr, tempField];
  } else {
    return [...parentPath, dataField];
  }
};

const enhanceDataField = (parentPath = [], currentField) => {
  /*if(!currentField) {debugger;}*/
  let [dataField, dataFieldType] = (currentField || '').split(':');

  if (!dataField) {
    dataField = '.';
  }

  const currentPath = enhanceParentPathDataField(dataField, parentPath);

  const fullDataField = currentPath.join('.');
  const dataFieldPath = getCleanPath(fullDataField);

  return {
    isArrayField: dataFieldType === 'array',
    original: currentField,
    arbitrary: fullDataField,
    full: dataFieldPath,
    currentPath
  }
};

const getValue = (value, dataField, defaultValue) => {
  return dataField ? get(value, dataField, defaultValue) : value;
};


export {
  enhanceDataField,
  getCleanPath,
  getValue
};


