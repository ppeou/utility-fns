import {get} from 'lodash';

console.clear();

const layout = {
  component: 'page',
  field: '.',
  items: [
    {
      component: 'top_section', field: 'top', items: [
        {component: 'logo', field: 'logo'}
      ]
    },
    {
      component: 'middle_section', field: 'content', items: [
        {component: 'pic1', field: 'mainImage'},
        {component: 'pic2', field: 'altImage'},
        {
          component: 'section', field: 'article', items: [
            {
              component: 'sub_section', field: '.', items: [
                {component: 'title', field: 'sub_title'}
              ]
            }
          ]
        },
      ]
    },
    {
      component: 'footer_section', field: 'bottom', items: [
        {
          component: 'left_side', field: 'links:array', items: [
            {
              component: 'my-comp', field: '.', items: [
                {component: 'link-label', field: 'label', items: []},
                {component: 'note-url', field: 'url', items: []},
                {component: 'link-item', field: '.', items: []},
              ]
            }
          ]
        }
      ]
    },
  ]
};

const data = {
  top: {
    logo: 'path-to-logo.png'
  },
  content: {
    mainImage: 'main-image.png',
    altImage: 'alt-image.png',
    article: {a: 1, b: 2, sub_title: 'My Sub Title'},
  },
  bottom: {
    links: [
      {label: 'AAA', url: '.com/aaa'},
      {label: 'BBB', url: '.com/bbb'},
      {label: 'CCC', url: '.com/ccc'},
    ]
  }
};

const buildPrefix = (level, token = '  ') => {
  const arr = [];
  for (let i = 0; i < level; i++) {
    arr.push(token);
  }
  return arr.join('');
};

const createGetCleanPathFn = () => {
  const removeDoubleDot = input => input.replace(/\.+/g, '.');
  const removeLeadingTrailingDot = input => input.replace(/^\.+|\.+$/g, '');

  return (input) => removeDoubleDot(removeLeadingTrailingDot(input));
};

const getEnhancedDataPath = createGetCleanPathFn();

const getValue = (value, dataField, defaultValue) => {
  return dataField ? get(value, dataField, defaultValue) : value;
};

const enhanceDataField = (parentPath = [], currentField) => {

  let [dataField, dataFieldType] = currentField.split(':');

  if (!dataField) {
    dataField = '.';
  }

  const currentPath = [...parentPath, dataField];

  const fullDataField = currentPath.join('.');
  const dataFieldPath = getEnhancedDataPath(fullDataField);

  return {
    isArrayField: dataFieldType === 'array',
    original: currentField,
    arbitrary: fullDataField,
    full: dataFieldPath,
    currentPath
  }
};

const withData = (layout, data, parentField = []) => {
  const prefix = buildPrefix(parentField.length);

  const {component, field: cmsField, items: cmsChildren = [], config = {}} = layout;

  const {currentPath, ...path} = enhanceDataField(parentField, cmsField);

  const value = getValue(data, path.full);

  console.log(prefix, component, '>', path.arbitrary, ':', path.full, value);
  let items = cmsChildren;
  if (path.isArrayField) {
    const tempChildren = value.reduce((p, arrItemData, idx) => {
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

  items = cmsChildren.map((item, idx) => {
    return withData(item, data, currentPath, parentField.length + 1);
  });

  return {
    component,
    config: {...config},
    field: path.full,
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

const withConfig = (layout, rules, rootValue = {}, level) => {
  const {component, field: dataField, value, items = []} = layout;
  if (!level) {
    rootValue = value;
  }

  const prefix = buildPrefix(level);

  //const dataField = getEnhancedDataPath(fullDataField);

  console.log(prefix, component, '>', dataField, '→', getEnhancedDataPath(dataField));

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

const configRules = {
  'top.logo': (rootValue, value, layout) => {
    const {component} = layout;
    console.log('[ effect ] :', component, '→', value);
    layout.config.hide = true;
    return {hide: true};
  },
  'bottom.links': (rootValue, value, layout) => {
    const {component} = layout;
    console.log('[ effect ] :', component, '→', value);
    if (!layout.meta_data) {
      layout.meta_data = {};
    }
    layout.meta_data.hide = true;
    return {hide: true};
  }
};

//const newLayout = JSON.parse(JSON.stringify(layout));
const newLayout = withData(JSON.parse(JSON.stringify(layout)), data);
//console.clear();
console.log(newLayout);

const layoutWithEffect = withConfig(newLayout, configRules);
console.log(layoutWithEffect);
