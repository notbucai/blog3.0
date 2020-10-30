/*
 * @Author: bucai
 * @Date: 2020-05-02 22:03:18
 * @LastEditors: bucai
 * @LastEditTime: 2020-10-30 15:02:18
 * @Description: 
 */
export const valid = {
  REQUIRED: [v => !!v || '不能为空'],
  PHONE: [v => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(v) || '手机号不正确'],
}
// https://github.com/login/oauth/authorize?client_id=121bf37951669bd171d4&state=github
const GITHUB_CLIENT_ID = process.env.NODE_ENV === 'production' ? "121bf37951669bd171d4" : '2a4cd3628191c69f682b';
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://www.notbucai.com' : 'http://localhost:9907';

export const STATE_LIST = {
  bind_github: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&state=github&redirect_uri=` + encodeURIComponent(BASE_URL + '/oauth/bind'),
  login_github: `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&state=github&redirect_uri=` + encodeURIComponent(BASE_URL + '/oauth/login'),
}