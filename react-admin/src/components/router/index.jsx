import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component'
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'
import { cloneDeep } from 'lodash'

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
 * @param {{ routes: {path:string, component:any, noCache:boolean, children:any[] }[]}} param0 props
 */
function Router ({ routes }) {
  const newRoutes = cloneDeep(routes).map(item => {
    let Component = item.component;

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

    const ComponentRoute = () => {
      return (<Component>
        <Router routes={item.children} />
      </Component>)
    };
    item.component = ComponentRoute;

    return item;
  });

  return (
    <>
      <Switch>
        {
          newRoutes.map(item => {
            const exact = routes.filter(route => route.path.startsWith(item.path)).length >= 2;
            return <Route exact={exact} key={item.path} path={item.path} component={item.component}></Route>
          })
        }
      </Switch>
    </>
  );
}

export default Router;
