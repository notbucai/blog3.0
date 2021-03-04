import React from 'react';
import { Switch, Route } from 'react-router-dom';
import KeepAlive from 'react-activation'
import loadable from '@loadable/component'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

class LoadingPage extends React.Component {
  //类似github页面加载的那个加载条
  componentWillMount () {
    NProgress.start()
  }
  componentWillUnmount () {
    NProgress.done()
  }
  render () {
    return (
      <div />
    )
  }
}

/**
 * 渲染路由
 * @param {{routes: {path:string,component:any,children:any[]}[]}} param0 props
 */
function Router ({ routes }) {

  return (
    <Switch>
      {
        routes.map(item => {
          let Component = item.component;
          const exact = routes.filter(route => route.path.startsWith(item.path)).length >= 2;

          // 判断是否是promise
          // TODO: 后面抽离成帮助类
          if (!!Component && (typeof Component === 'object' || typeof Component === 'function') && typeof Component.then === 'function') {

            const LazyComponent = loadable(() => item.component, {
              fallback: <LoadingPage />
            });
            Component = ({ children }) => {
              return (
                // <Suspense fallback={<div>loading....</div>}>
                <LazyComponent>
                  {children}
                </LazyComponent>
                // </Suspense>
              );
            };
          }
          return <Route exact={exact} key={item.path} path={item.path} render={() => (<Component>
            {
              item.noCache ?
                <KeepAlive name={item.path}>
                  <Router routes={item.children} />
                </KeepAlive>
                :
                <Router routes={item.children} />
            }
          </Component>)
          }></Route >
        })
      }
    </Switch >
  );
}

export default Router;
