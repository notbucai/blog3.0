/*
 * @Author: bucai
 * @Date: 2020-05-02 22:03:18
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-09 15:44:19
 * @Description: 
 */
export const valid = {
  REQUIRED: [v => !!v || '不能为空'],
  PHONE: [v => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(v) || '手机号不正确'],
}
// https://github.com/login/oauth/authorize?client_id=121bf37951669bd171d4&state=github
const GITHUB_CLIENT_ID = process.env.NODE_ENV === 'production' ? "121bf37951669bd171d4" : '2a4cd3628191c69f682b';
const BAIDU_CLIENT_ID = process.env.NODE_ENV === 'production' ? "uY7uKdaHNdKKzoS01yQeFIlX" : 'uY7uKdaHNdKKzoS01yQeFIlX';
const QQ_CLIENT_ID = process.env.NODE_ENV === 'production' ? "101862792" : '101862792';
const WEIBO_CLIENT_ID = process.env.NODE_ENV === 'production' ? "42171906" : '42171906';
const GITEE_CLIENT_ID = process.env.NODE_ENV === 'production' ? "d208b7476ff8f79010ff026b7487b400bc6bdf4690450b9deaa57f2d35fe1cc5" : 'd208b7476ff8f79010ff026b7487b400bc6bdf4690450b9deaa57f2d35fe1cc5';
const NOTBUCAI_CLIENT_ID = process.env.NODE_ENV === 'production' ? "e3afc612ee3d46df5405aff7de410b2b" : 'e3afc612ee3d46df5405aff7de410b2b';
const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://www.notbucai.com' : 'https://www.notbucai.com';

const urls = {
  github: 'https://github.com/login/oauth/authorize',
  baidu: 'https://openapi.baidu.com/oauth/2.0/authorize',
  qq: 'https://graph.qq.com/oauth2.0/authorize',
  weibo: 'https://api.weibo.com/oauth2/authorize',
  gitee: 'https://gitee.com/oauth/authorize',
  notbucai: 'https://www.notbucai.com/api/openapi/authorize',
}

export const redirect_uris = {
  login: BASE_URL + '/oauth/login',
  bind: BASE_URL + '/oauth/bind'
}

const getOAuthUrl = ({
  url,
  client_id,
  state,
  redirect_uri,
  ...args
}) => {
  const urlSP = new URLSearchParams();

  urlSP.set('client_id', client_id);
  urlSP.set('state', state);
  urlSP.set('redirect_uri', redirect_uri);


  Object.keys(args).forEach(key => {
    urlSP.set(key, args[key]);
  });

  return url + '?' + urlSP.toString();
}


export const STATE_LIST = {
  bind_github: getOAuthUrl({
    url: urls.github,
    client_id: GITHUB_CLIENT_ID,
    state: 'github',
    redirect_uri: redirect_uris.bind
  }),
  login_github: getOAuthUrl({
    url: urls.github,
    client_id: GITHUB_CLIENT_ID,
    state: 'github',
    redirect_uri: redirect_uris.login
  }),


  bind_baidu: getOAuthUrl({
    url: urls.baidu,
    client_id: BAIDU_CLIENT_ID,
    state: 'baidu',
    response_type: 'code',
    redirect_uri: redirect_uris.bind
  }),
  login_baidu: getOAuthUrl({
    url: urls.baidu,
    client_id: BAIDU_CLIENT_ID,
    state: 'baidu',
    response_type: 'code',
    redirect_uri: redirect_uris.login
  }),


  bind_qq: getOAuthUrl({
    url: urls.qq,
    client_id: QQ_CLIENT_ID,
    state: 'qq',
    response_type: 'code',
    redirect_uri: redirect_uris.bind
  }),
  login_qq: getOAuthUrl({
    url: urls.qq,
    client_id: QQ_CLIENT_ID,
    state: 'qq',
    response_type: 'code',
    redirect_uri: redirect_uris.login
  }),


  bind_weibo: getOAuthUrl({
    url: urls.weibo,
    client_id: WEIBO_CLIENT_ID,
    state: 'weibo',
    response_type: 'code',
    redirect_uri: redirect_uris.bind
  }),
  login_weibo: getOAuthUrl({
    url: urls.weibo,
    client_id: WEIBO_CLIENT_ID,
    state: 'weibo',
    response_type: 'code',
    redirect_uri: redirect_uris.login
  }),


  bind_gitee: getOAuthUrl({
    url: urls.gitee,
    client_id: GITEE_CLIENT_ID,
    state: 'gitee',
    response_type: 'code',
    redirect_uri: redirect_uris.bind
  }),
  login_gitee: getOAuthUrl({
    url: urls.gitee,
    client_id: GITEE_CLIENT_ID,
    state: 'gitee',
    response_type: 'code',
    redirect_uri: redirect_uris.login
  }),


  bind_notbucai: getOAuthUrl({
    url: urls.notbucai,
    client_id: NOTBUCAI_CLIENT_ID,
    state: 'notbucai',
    response_type: 'code',
    redirect_uri: redirect_uris.bind
  }),
  login_notbucai: getOAuthUrl({
    url: urls.notbucai,
    client_id: NOTBUCAI_CLIENT_ID,
    state: 'notbucai',
    response_type: 'code',
    redirect_uri: redirect_uris.login
  }),


}