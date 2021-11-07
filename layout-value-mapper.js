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



/* input
{
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
              ]}]},
      ]},
    {
      component: 'footer_section', field: 'bottom', items: [
        {
          component: 'left_side', field: 'links:array', items: [
            {
              component: 'my-comp', field: '.', items: [
                {component: 'link-label', field: 'label', items: []},
                {component: 'note-url', field: 'url', items: []},
                {component: 'link-item', field: '.', items: []},
              ]}]
        }]},
  ]}
 */

/* output
{
  component:"page",config:{},field:"",
  items:[{
    component:"top_section",config:{},field:"top",
    items:[
      {component:"logo",config:{hide:true},field:"top.logo",items:[],value:"path-to-logo.png", // <= config rull set hide: true
        extra:{path:{isArrayField:false,original:"logo",arbitrary:"..top.logo",full:"top.logo"},
          cms:{field:"logo",config:{}}}}],value:{logo:"path-to-logo.png"},
    extra:{path:{isArrayField:false,original:"top",arbitrary:"..top",full:"top"},
      cms:{field:"top",config:{}}}},
    {component:"middle_section",config:{},field:"content",items:[
      {component:"pic1",config:{},field:"content.mainImage",items:[],value:"main-image.png",
        extra:{path:{isArrayField:false,original:"mainImage",arbitrary:"..content.mainImage",full:"content.mainImage"},
          cms:{field:"mainImage",config:{}}}},
        {component:"pic2",config:{},field:"content.altImage",items:[],value:"alt-image.png",
          extra:{path:{isArrayField:false,original:"altImage",arbitrary:"..content.altImage",full:"content.altImage"},
            cms:{field:"altImage",config:{}}}},
        {component:"section",config:{},field:"content.article",items:[
          {component:"sub_section",config:{},field:"content.article",items:[
            {component:"title",config:{},field:"content.article.sub_title",items:[],value:"My Sub Title",
              extra:{path:{isArrayField:false,original:"sub_title",arbitrary:"..content.article...sub_title",full:"content.article.sub_title"},
                cms:{field:"sub_title",config:{}}}}],value:{a:1,b:2,sub_title:"My Sub Title"},
            extra:{path:{isArrayField:false,original:".",arbitrary:"..content.article..",full:"content.article"},
              cms:{field:".",config:{}}}}],value:{a:1,b:2,sub_title:"My Sub Title"},
          extra:{path:{isArrayField:false,original:"article",arbitrary:"..content.article",full:"content.article"},
            cms:{field:"article",config:{}}}}],value:{mainImage:"main-image.png",altImage:"alt-image.png",article:{a:1,b:2,sub_title:"My Sub Title"}},
      extra:{path:{isArrayField:false,original:"content",arbitrary:"..content",full:"content"},
        cms:{field:"content",config:{}}}},
    {component:"footer_section",config:{},field:"bottom",items:[
      {component:"left_side",config:{},field:"bottom.links",items:[
        {component:"my-comp",config:{},field:"bottom.links.0",items:[ // <= 3 navigations items (1 of 3)
          {component:"link-label",config:{},field:"bottom.links.0.label",items:[],value:"AAA",
            extra:{path:{isArrayField:false,original:"label",arbitrary:"..bottom.links.0.label",full:"bottom.links.0.label"},
              cms:{field:"label",config:{}}}},
            {component:"note-url",config:{},field:"bottom.links.0.url",items:[],value:".com/aaa",
              extra:{path:{isArrayField:false,original:"url",arbitrary:"..bottom.links.0.url",full:"bottom.links.0.url"},cms:{field:"url",config:{}}}},
            {component:"link-item",config:{},field:"bottom.links.0",items:[],value:{label:"AAA",url:".com/aaa"},extra:{path:{isArrayField:false,original:".",arbitrary:"..bottom.links.0..",full:"bottom.links.0"},cms:{field:".",config:{}}}}],value:{label:"AAA",url:".com/aaa"},extra:{path:{isArrayField:false,original:"0",arbitrary:"..bottom.links.0",full:"bottom.links.0"},cms:{field:"0",config:{}}}},
          {component:"my-comp",config:{},field:"bottom.links.1",items:[  // <= 3 navigations items (2 of 3)
            {component:"link-label",config:{},field:"bottom.links.1.label",items:[],value:"BBB",
              extra:{path:{isArrayField:false,original:"label",arbitrary:"..bottom.links.1.label",full:"bottom.links.1.label"},cms:{field:"label",config:{}}}},
              {component:"note-url",config:{},field:"bottom.links.1.url",items:[],value:".com/bbb",
                extra:{path:{isArrayField:false,original:"url",arbitrary:"..bottom.links.1.url",full:"bottom.links.1.url"},cms:{field:"url",config:{}}}},
              {component:"link-item",config:{},field:"bottom.links.1",items:[],value:{label:"BBB",url:".com/bbb"},extra:{path:{isArrayField:false,original:".",arbitrary:"..bottom.links.1..",full:"bottom.links.1"},cms:{field:".",config:{}}}}],value:{label:"BBB",url:".com/bbb"},extra:{path:{isArrayField:false,original:"1",arbitrary:"..bottom.links.1",full:"bottom.links.1"},cms:{field:"1",config:{}}}},
          {component:"my-comp",config:{},field:"bottom.links.2",items:[
            {component:"link-label",config:{},field:"bottom.links.2.label",items:[],value:"CCC",
              extra:{path:{isArrayField:false,original:"label",arbitrary:"..bottom.links.2.label",full:"bottom.links.2.label"},cms:{field:"label",config:{}}}},
              {component:"note-url",config:{},field:"bottom.links.2.url",items:[],value:".com/ccc",
                extra:{path:{isArrayField:false,original:"url",arbitrary:"..bottom.links.2.url",full:"bottom.links.2.url"},cms:{field:"url",config:{}}}},
              {component:"link-item",config:{},field:"bottom.links.2",items:[],  // <= 3 navigations items (3 of 3)
                value:{label:"CCC",url:".com/ccc"},
                extra:{path:{isArrayField:false,original:".",arbitrary:"..bottom.links.2..",full:"bottom.links.2"},
                  cms:{field:".",config:{}}}}],value:{label:"CCC",url:".com/ccc"},
            extra:{path:{isArrayField:false,original:"2",arbitrary:"..bottom.links.2",full:"bottom.links.2"},
              cms:{field:"2",config:{}}}}],value:[{label:"AAA",url:".com/aaa"},{label:"BBB",url:".com/bbb"},{label:"CCC",url:".com/ccc"}],
        extra:{path:{isArrayField:true,original:"links:array",arbitrary:"..bottom.links",full:"bottom.links"},
          cms:{field:"links:array",config:{}}},meta_data:{hide:true}}], // <= config rull set hide: true
      value:{links:[{label:"AAA",url:".com/aaa"},{label:"BBB",url:".com/bbb"},{label:"CCC",url:".com/ccc"}]},
      extra:{path:{isArrayField:false,original:"bottom",arbitrary:"..bottom",full:"bottom"},
        cms:{field:"bottom",config:{}}}}],value:{top:{logo:"path-to-logo.png"},content:{mainImage:"main-image.png",altImage:"alt-image.png",article:{a:1,b:2,sub_title:"My Sub Title"}},bottom:{links:[{label:"AAA",url:".com/aaa"},{label:"BBB",url:".com/bbb"},{label:"CCC",url:".com/ccc"}]}},
  extra:{path:{isArrayField:false,original:".",arbitrary:".",full:""},
    cms:{field:".",config:{}}}
};
*/
