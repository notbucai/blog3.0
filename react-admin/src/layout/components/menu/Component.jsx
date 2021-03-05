import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

import './styles.scss';

function MenuItem (props) {
  const menu = props.menu;
  const children = menu.children || [];
  const menuOptions = menu.menu || {};
  if (!children || !children.length) {
    return (<Menu.Item key={menu.path} icon={menuOptions && menuOptions.icon} {...props}>
      <Link to={menu.path}>{menuOptions && (menuOptions.title || menu.title)}</Link>
    </Menu.Item>);
  }

  return (<Menu.SubMenu key={menu.path} icon={menuOptions && menuOptions.icon} title={menu.title} {...props}>
    {
      children.map(item => {
        return <MenuItem key={item.path} menu={item} />
      })
    }
  </Menu.SubMenu>);
}

function AppMenu ({ menuState, menus, currentRoute }) {
  const defaultSelectedKeys = [];
  if (currentRoute) {
    defaultSelectedKeys.push(currentRoute);
  }
  return (
    <Menu
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultSelectedKeys}
      selectedKeys={defaultSelectedKeys}
      mode="inline"
      theme="dark"
    >
      {menus.map(item => {
        return <MenuItem key={item.path} menu={item} />
      })}
    </Menu>
  );
}

export default AppMenu;
