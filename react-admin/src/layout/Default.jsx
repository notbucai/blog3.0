import React from 'react';
import { Avatar, Col, Dropdown, Layout, Menu, Row } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';

import { useTranslation } from 'react-i18next';

import { changeMenuState, changeLanguage } from '../store/app/actions';
import { Logo as AppLogo, Menu as AppMenu } from './components';

import './styles.scss';
import Router from '../components/router';
import TabView from './components/tab-view';
import Breadcrumb from './components/breadcrumb';

import localeIcon, { America, China } from '../assets/image/locale'
import { ZH_CN, EN_US } from '../locale';


const DefaultLayout = ({ menuState, changeMenuState, menus, routes, tabViews, currentRoute, breadcrumbs, language, changeLanguage } = {}) => {

  const countriesIcon = localeIcon[language];

  const { i18n, t } = useTranslation();

  const menu = (
    <Menu onClick={e => {
      const type = e.key;
      if (type === 'exit') {
        // TODO: 这都属于业务块了，不做详细处理
        localStorage.removeItem('token');
        window.location.replace('/login')
      }
    }}>
      <Menu.Item className="p1 pl2 pr2">
        <span>个人信息</span>
      </Menu.Item>
      <Menu.Item key="exit" className="p1 pl2 pr2">
        <span>退出系统</span>
      </Menu.Item>
    </Menu>
  );

  const langeList = (
    <Menu onClick={e => {
      changeLanguage(e.key);
      i18n.changeLanguage(e.key);
    }}>
      <Menu.Item className="p1 pl2 pr2" key={ZH_CN}>
        <Avatar style={{ backgroundColor: '#02e686', verticalAlign: 'middle' }} size="small" src={<img src={China} alt="" />}></Avatar>
        <span className="pl2">中文</span>
      </Menu.Item>
      <Menu.Item className="p1 pl2 pr2" key={EN_US}>
        <Avatar style={{ backgroundColor: '#02e686', verticalAlign: 'middle' }} size="small" src={<img src={America} alt="" />}></Avatar>
        <span className="pl2">英文</span>
      </Menu.Item>
    </Menu>
  );
  if (currentRoute && (currentRoute.full || currentRoute.noInitRouter)) {
    return <Router routes={routes} />
  }

  return (
    <Layout className="layout">
      {/* LEFT */}
      <Layout.Sider trigger={null} collapsible collapsed={menuState}>
        {/* LOGO */}
        <AppLogo collapsed={menuState} />
        {/* MENU */}
        <AppMenu menus={menus} menuState={menuState} currentRoute={currentRoute ? currentRoute.path : ''} />
      </Layout.Sider>
      {/* RIGHT */}
      <Layout style={{ height: '100vh' }}>
        {/* RIGHT - HEADER */}
        <Layout.Header className="layout-header">
          <Row justify="space-between" style={{ height: '100%' }}>
            <Col span={6}>
              <div className="df aic" style={{ height: '100%' }}>
                <div className="layout-fold_outlined" onClick={changeMenuState}>{menuState ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
                <span className="text-default" style={{ fontSize: '12px' }}>{t('WELCOME')}</span>
              </div>
            </Col>
            <Col span={12}>
              <div className="df aic jce" style={{ height: '100%' }}>
                <div className="df aic" style={{ height: '100%' }}>
                  <Dropdown overlay={langeList} arrow>
                    <div className="layout-fold_outlined pl2 pr2">
                      <div className="df aic">
                        <Avatar style={{ verticalAlign: 'middle' }} size="small" src={<img src={countriesIcon} alt="" />}></Avatar>
                      </div>
                    </div>
                  </Dropdown>
                </div>

                <div className="df aic" style={{ height: '100%' }}>
                  <Dropdown overlay={menu} arrow>
                    <div className="layout-fold_outlined pl2 pr2">
                      <div className="df aic">
                        <Avatar style={{ backgroundColor: '#f4f5f6', verticalAlign: 'middle' }} size="default" src={<img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="" />}></Avatar>
                        <span className="text-default ml1">超级管理员</span>
                        {/* <DownOutlined className="text-default" /> */}
                      </div>
                    </div>
                  </Dropdown>
                </div>

              </div>
            </Col>
          </Row>
        </Layout.Header>
        {/* RIGHT - TABS */}
        <TabView list={tabViews} choose={currentRoute} />
        {/* RIGHT -  BREADCRUMB */}
        <Breadcrumb breadcrumbs={breadcrumbs} />
        {/* RIGHT - CONTENT */}
        <Layout.Content>
          <div style={{ margin: '0 14px', padding: '14px', backgroundColor: '#fff' }}>
            <Router routes={routes} />
          </div>
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
    breadcrumbs: state.app.breadcrumbs,
    language: state.app.language,
    userInfo: state.user.userInfo,
  }
}, dispatch => {
  return {
    changeMenuState () {
      dispatch(changeMenuState());
    },
    changeLanguage (language) {
      dispatch(changeLanguage(language));
    },
  }
})(DefaultLayout);
