import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { KeepAlive } from 'react-keep-alive'
import loadable from '@loadable/component'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

class LoadingPage extends React.Component {
  //类似github页面加载的那个加载条
  componentDidMount () {
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
          if (typeof Component === 'function') {

            const LazyComponent = loadable(item.component, {
              fallback: <LoadingPage />,
              cacheKey () {
                return item.path
              }
            });
            Component = ({ children }) => {
              return (
                <LazyComponent>
                  {children}
                </LazyComponent>
              );
            };
          }

          const ComponentRoute = (<Component>
            <Router routes={item.children} />
          </Component>);

          return <Route exact={exact} key={item.path} path={item.path} render={() => (
            item.noCache ?
              ComponentRoute :
              <KeepAlive name={item.path}>
                <div>
                  {ComponentRoute}
                </div>
              </KeepAlive>
          )}></Route>
        })
      }
    </Switch >
  );
}

export default Router;
