/*
 * @Author: bucai
 * @Date: 2021-02-26 12:48:15
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-28 23:27:19
 * @Description:
 */
import { createBrowserHistory } from "history";
import { changeBreadcrumb, changeRoute } from "../store/app/actions";

export const history = createBrowserHistory();

const initHistory = (store) => {

  store.dispatch(changeRoute(history.location));
  store.dispatch(changeBreadcrumb(history.location));

  history.listen((location, actions) => {
    store.dispatch(changeRoute(location));
    store.dispatch(changeBreadcrumb(location));
  });
  return history;
}

export default initHistory;