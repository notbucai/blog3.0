/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2022-04-05 17:37:27
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-04-05 17:43:40
 * @Description: 
 */
const http = require('./http')

module.exports = {
  async userCard (userId) {
    const [userRes, achievementRes] = await Promise.all([http.get(`/users/${userId}`),  http.get(`users/${userId}/achievement`)]);
    if (
      userRes.status === 200 && userRes.data && userRes.data.code === 0 
      &&
      achievementRes.status === 200 && achievementRes.data && achievementRes.data.code === 0 
    ) {
      return {
        ...userRes.data.data,
        ...achievementRes.data.data,
      }
    }
    return null;
  }
}