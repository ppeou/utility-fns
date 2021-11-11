import React from 'react';

const getData = ({component, value, config = {}}) => ([component,value, config.hidden]);

const H1 = ({cKeyIndex, ...props}) => {
  const [component, value, hidden] = getData(props);
  return hidden ? null : (<h1 data-component={component} data-cid="native.h1" data-ckidx={cKeyIndex}>{value}</h1>);
};

const H2 = ({cKeyIndex, ...props}) => {
  const [component, value, hidden] = getData(props);
  return hidden ? null : (<h2 data-component={component} data-cid="native.h2" data-ckidx={cKeyIndex}>{value}</h2>);
};

const H3 = ({cKeyIndex, ...props}) => {
  const [component, value, hidden] = getData(props);
  return hidden ? null : (<h3 data-component={component} data-cid="native.h3" data-ckidx={cKeyIndex}>{value}</h3>);
};

const H4 = ({cKeyIndex, ...props}) => {
  const [component, value, hidden] = getData(props);
  return hidden ? null : (<h4 data-component={component} data-cid="native.h4" data-ckidx={cKeyIndex}>{value}</h4>);
};

const H5 = ({cKeyIndex, ...props}) => {
  const [component, value, hidden] = getData(props);
  return hidden ? null : (<h5 data-component={component} data-cid="native.h5" data-ckidx={cKeyIndex}>{value}</h5>);
};

const H6 = ({cKeyIndex, ...props}) => {
  const [component, value, hidden] = getData(props);
  return hidden ? null : (<h6 data-component={component} data-cid="native.h6" data-ckidx={cKeyIndex}>{value}</h6>);
};

const elements1 = [
  ['native.h1', H1],
  ['native.h2', H2],
  ['native.h3', H3],
  ['native.h4', H4],
  ['native.h5', H5],
  ['native.h6', H6],
];

const Image = ({cKeyIndex, ...props}) => {
  const {component, value, config = {}} = props;
  const {hidden, styles} = config;

  return hidden ? null : (<img src={value} data-cid="native.img" data-component={component} data-ckidx={cKeyIndex} style={styles} />);
};

const elements2= [
  ['native.img', Image]
];

import React from 'react';

const Section = ({cKeyIndex, ...props}) => {
  const {component, items, engine, config = {}} = props;
  const {hidden} = config;
  return hidden ? null : (<section  data-component={component} data-cid="native.section" data-ckidx={cKeyIndex}>
    {items && items.map((c, idx) => engine({...c, engine}, `${cKeyIndex}-${idx}`))}
  </section>);
};

const P = ({cKeyIndex, ...props}) => {
  const {component, items, engine, config = {}} = props;
  const {hidden} = config;

  return hidden ? null : (<p data-component={component} data-cid="native.p" data-ckidx={cKeyIndex}>
    {items && items.map((c, idx) => engine({...c, engine}, `${cKeyIndex}-${idx}`))}
  </p>);
};

const Div = ({cKeyIndex, ...props}) => {
  const {component, items, engine, config = {}} = props;
  const {hidden, styles} = config;

  return hidden ? null : (<div  data-component={component} data-cid="native.div" data-ckidx={cKeyIndex} style={styles}>
    {items && items.map((c, idx) => engine({...c, engine}, `${cKeyIndex}-${idx}`))}
  </div>);
};

const elements3 = [
  ['native.section', Section],
  ['native.div', Div],
  ['native.p', P],
];

import React from 'react';
import {Link} from 'react-router-dom';

const ALink = ({cKeyIndex, ...props}) => {
  const {component, value, items, engine, config = {}} = props;
  const {hidden} = config;

  return hidden ? null : (<a href={value} data-component={component} data-cid="native.a" data-ckidx={cKeyIndex}>
    {items && items.map((c, idx) => engine({...c, engine}, `${cKeyIndex}-${idx}`))}
  </a>);
};

const NavLink = ({cKeyIndex, ...props}) => {
  const {component, value, items, engine, config = {}} = props;
  const {hidden, styles} = config;

  return hidden ? null : (<Link to={value} data-component={component} data-cid="native.link" data-ckidx={cKeyIndex} style={styles}>
    {items && items.map((c, idx) => engine({...c, engine}, `${cKeyIndex}-${idx}`))}
  </Link>);
};

const elements4 = [
  ['native.nav-link', NavLink],
  ['native.a', ALink]
];

import React from 'react';
import ReactMarkdown from 'react-markdown';

const TextTags = ({value}) => {
  return <>{value || 'no data'}</>;
};

const TextMarkdown = ({value}) => {
  return <ReactMarkdown>{value}</ReactMarkdown>;
};

const Label = ({cKeyIndex, ...props}) => {
  const {component, items, engine, config = {}} = props;
  const {hidden, styles} = config;

  return hidden ? null : (<label  data-component={component} data-cid="native.label" data-ckidx={cKeyIndex} style={styles}>
    {items && items.map((c, idx) => engine({...c, engine}, `${cKeyIndex}-${idx}`))}
  </label>);
};


const elements5 = [
  ['native.text', TextTags],
  ['native.markdown', TextMarkdown],
  ['native.label', Label],
];
