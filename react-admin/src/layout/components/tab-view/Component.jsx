import React from 'react';
import { Link } from 'react-router-dom';

import './styles.scss';

const TabItem = ({ data, active }) => {
  return (
    <Link to={data.fullPath} className={active ? 'tab-view-item active' : 'tab-view-item'}>
      {data.title}
    </Link>
  )
}

function Component ({ list = [], choose }) {
  return (
    <div className="tab-view">
      {list.map((item, index) => <TabItem key={item.path} data={item} active={choose && choose.path === item.path} />)}
    </div>
  );
}

export default Component;
