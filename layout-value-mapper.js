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
  const correctedDataField = dataField.replaceAll('..', '');
  return get(value, correctedDataField, defaultValue);
};

const mergeLayoutData = (level, layout, data, parentField = []) => {
  const prefix = buildPrefix(level);

  const {component, data_field, items = []} = layout;
  let [dataField, dataFieldType] = data_field.split(':');

  if (!dataField) {
    dataField = '.';
  }

  const currentPath = [...parentField, dataField];

  const fullDataField = currentPath.join('.');

  const value = getValue(data, fullDataField);
  //const value = data;

  let passDownValue = data;

  layout.full_data_field = fullDataField;
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
    mergeLayoutData(level + 1, item, passDownValue, dataField ? currentPath : []);
  });
  return layout;
};

//const newLayout = JSON.parse(JSON.stringify(layout));
const newLayout = mergeLayoutData(1, JSON.parse(JSON.stringify(layout)), data);


/* output
page > . undefined
  top_section > ..top {logo: 'path-to-logo.png'}
    logo > ..top.logo path-to-logo.png
  middle_section > ..content {mainImage: 'main-image.png', altImage: 'alt-image.png', article: {…}}
    pic1 > ..content.mainImage main-image.png
    pic2 > ..content.altImage alt-image.png
    section > ..content.article {a: 1, b: 2, sub_title: 'My Sub Title'}
      sub_section > ..content.article.. {a: 1, b: 2, sub_title: 'My Sub Title'}
        title > ..content.article...sub_title My Sub Title
  footer_section > ..bottom {links: Array(3)}
    left_side > ..bottom.links (3) [{…}, {…}, {…}]
      my-comp > ..bottom.links.0 {label: 'AAA', url: '.com/aaa'}
        link-label > ..bottom.links.0.label AAA
        note-url > ..bottom.links.0.url .com/aaa
        link-item > ..bottom.links.0.. {label: 'AAA', url: '.com/aaa'}
      my-comp > ..bottom.links.1 {label: 'BBB', url: '.com/bbb'}
        link-label > ..bottom.links.1.label BBB
        note-url > ..bottom.links.1.url .com/bbb
        link-item > ..bottom.links.1.. {label: 'BBB', url: '.com/bbb'}
      my-comp > ..bottom.links.2 {label: 'CCC', url: '.com/ccc'}
        link-label > ..bottom.links.2.label CCC
        note-url > ..bottom.links.2.url .com/ccc
        link-item > ..bottom.links.2.. {label: 'CCC', url: '.com/ccc'}
*/
