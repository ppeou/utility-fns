import {get} from 'lodash';

console.clear();

//{component: '', data_field: '', items: []}

const layout = {
  component: 'page',
  data_field: '.',
  items: [
    {
      component: 'top_section', data_field: 'top', items: [
        {component: 'logo', data_field: 'logo'}
      ]
    },
    {
      component: 'middle_section', data_field: 'content', items: [
        {component: 'pic1', data_field: 'mainImage'},
        {component: 'pic2', data_field: 'altImage'},
        {
          component: 'section', data_field: 'article', items: [
            {
              component: 'sub_section', data_field: '.', items: [
                {component: 'title', data_field: 'sub_title'}
              ]
            }
          ]
        },
      ]
    },
    {
      component: 'footer_section', data_field: 'bottom', items: [
        {
          component: 'left_side', data_field: 'links:array', items: [
            {component: 'my-comp', data_field: '.', items: [
                {component: 'link-label', data_field: 'label', items: []},
                {component: 'note-url', data_field: 'url', items: []},
                {component: 'link-item', data_field: '.', items: []},
            ]}
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

const buildPrefix = (level) => {
  const arr = [];
  for (let i = 0; i < level; i++) {
    arr.push('  ');
  }
  return arr.join('');
};

const getValue = (value, dataField, defaultValue) => {
  return !dataField ? value : get(value, dataField, defaultValue);
};

const mergeLayoutData = (level, layout, data, parentField = [], fromRootParentField = []) => {
  const prefix = buildPrefix(level);

  const {component, data_field, items = []} = layout;
  let [dataField, dataFieldType] = data_field.split(':');

  if (dataField === '.') {
    dataField = false;
  }

  const currentPath = [...parentField];
  const currentFromParentPath = [...fromRootParentField];
  if (dataField) {
    currentPath.push(dataField);
    currentFromParentPath.push(dataField);
  }

  const fullDataField = currentPath.join('.');
  const value = getValue(data, fullDataField);

  let passDownValue = data;
  if (!dataField) {
    passDownValue = value;
  }

  layout.full_data_field = fullDataField;
  layout.root_data_field = currentFromParentPath.join('.');
  layout.value = value;

  console.log(prefix, component, '>', fullDataField, value);

  if (dataFieldType === 'array') {
    const newItems = value.reduce((p,arrItemData, idx) => {
       const a = items.map(({...item}) => {
         const {data_field: df} = item;
         const _df = df === '.' ? `${idx}` : `${idx}.${df}`;
        item.data_field = _df;
        return item;
      });
       return [...p, ...a];
    }, []);

    Object.assign(items, newItems);

  }
  items.forEach((item, idx) => {
    mergeLayoutData(level + 1, item, passDownValue, dataField ? currentPath : [], currentPath);
  });
  return layout;
};

//const newLayout = JSON.parse(JSON.stringify(layout));
const newLayout = mergeLayoutData(1, JSON.parse(JSON.stringify(layout)), data);
console.log(newLayout);
