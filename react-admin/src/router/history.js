/*
 * @Author: bucai
 * @Date: 2021-02-26 12:48:15
 * @LastEditors: bucai
 * @LastEditTime: 2021-02-26 19:34:26
 * @Description:
 */
import { createBrowserHistory } from "history";
import { changeRoute } from "../store/app/actions";

export const history = createBrowserHistory();

const initHistory = (store) => {

  store.dispatch(changeRoute(history.location));

  history.listen((location, actions) => {
    store.dispatch(changeRoute(location));
  });
  return history;
}

export default initHistory;