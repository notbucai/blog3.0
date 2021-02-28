import { connect } from 'react-redux';
import { DefaultLayout } from './layout';

import './App.scss';
import { updateTabViews, initPermissionRouters } from './store/app/actions';

function App ({ init }) {
  init();
  return (
    <DefaultLayout />
  );
}

export default connect(() => ({}), dispatch => {
  return {
    async init () {
      await dispatch(initPermissionRouters());
      dispatch(updateTabViews());
    }
  }
})(App);
