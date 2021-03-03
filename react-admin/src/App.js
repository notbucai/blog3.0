import { connect } from 'react-redux';
import { DefaultLayout } from './layout';
import { Router } from 'react-router-dom';
import { AliveScope } from 'react-activation'
import initHistory from './router/history';
import { ConfigProvider } from 'antd';

import store from './store';

import './App.scss';

import { antd } from './locale';
import init from './store/init';

const customHistory = initHistory(store);

function App ({ init, language }) {
  init();
  const locale = antd(language);

  return (
    <ConfigProvider locale={locale}>
      <Router history={customHistory}>
        <AliveScope>
          <DefaultLayout />
        </AliveScope>
      </Router>
    </ConfigProvider>
  );
}

export default connect((state) => ({
  language: state.app.language
}), dispatch => {
  return {
    async init () {
      init();
    }
  }
})(App);
