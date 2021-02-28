import React from 'react';
import { Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { changeMenuState } from '../store/app/actions';
import { Logo, Menu } from './components';

import './styles.scss';
import Router from '../components/router';
import TabView from './components/tab-view';

const DefaultLayout = ({ menuState, changeMenuState, menus, routes, tabViews, currentRoute } = {}) => {

  return (
    <Layout className="layout">
      {/* LEFT */}
      <Layout.Sider trigger={null} collapsible collapsed={menuState}>
        {/* LOGO */}
        <Logo collapsed={menuState} />
        {/* MENU */}
        <Menu menus={menus} menuState={menuState} currentRoute={currentRoute} />
      </Layout.Sider>
      {/* RIGHT */}
      <Layout style={{ height: '100vh' }}>
        {/* RIGHT - HEADER */}
        <Layout.Header className="layout-header">
          <span className="layout-fold_outlined" onClick={changeMenuState}>{menuState ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</span>
        </Layout.Header>
        {/* RIGHT - TABS */}
        <TabView list={tabViews} choose={currentRoute} />
        {/* RIGHT -  BREADCRUMB */}
        {/* RIGHT - CONTENT */}
        <Layout.Content>
          <Router routes={routes} />
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default connect(state => {
  return {
    menuState: state.app.menuState,
    menus: state.app.menus,
    routes: state.app.routes,
    tabViews: state.app.tabViews,
    currentRoute: state.app.currentRoute,
  }
}, dispatch => {
  return {
    changeMenuState () {
      dispatch(changeMenuState());
    }
  }
})(DefaultLayout);
