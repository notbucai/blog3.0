import { Breadcrumb } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import './styles.scss';

function AppBreadcrumb ({ breadcrumbs = [] }) {
  const items = breadcrumbs.map((item, index) => {
    if (index === breadcrumbs.length - 1) {
      item.fullPath = undefined;
    }
    if (index === 0) {
      item.icon = <HomeOutlined style={{ color: '#02e686' }} />
    }
    item.breadcrumbName = item.title; // 6
    return item;
  }).filter(item => {
    return item;
  });
  return (
    <div style={{ padding: '14px' }}>
      <Breadcrumb routes={items} itemRender={((item) => {
        if (item.fullPath) {
          return (
            <>
              {item.icon}
              <Link key={item.path} to={item.fullPath}>{item.title}</Link>
            </>
          );
        } else {
          return (
            <>
              {item.icon}
              <span key={item.path}>{item.title}</span>
            </>
          );
        }
      })} />
    </div>
  );
}

export default AppBreadcrumb;
