import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { Router } from 'react-router-dom';
import initHistory from './router/history';

const customHistory = initHistory(store);

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router history={customHistory}>
      <App />
    </Router>
  </Provider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
