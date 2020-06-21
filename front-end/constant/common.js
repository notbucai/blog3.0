/*
 * @Author: bucai
 * @Date: 2020-05-02 22:03:18
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-21 15:57:45
 * @Description: 
 */
export const valid = {
  REQUIRED: [v => !!v || '不能为空'],
  PHONE: [v => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(v) || '手机号不正确'],
}

export const STATE_LIST = {
  bind_github: 'https://github.com/login/oauth/authorize?client_id=121bf37951669bd171d4&state=github&redirect_uri=' + encodeURIComponent('https://www.notbucai.com//oauth/bind'),
  login_github: 'https://github.com/login/oauth/authorize?client_id=121bf37951669bd171d4&state=github&redirect_uri=' + encodeURIComponent('https://www.notbucai.com/oauth/login'),
}