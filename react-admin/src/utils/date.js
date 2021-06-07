/*
 * @Author: bucai
 * @Date: 2021-04-15 14:10:32
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-15 14:12:33
 * @Description: 
 */
import dayjs from 'dayjs';

export const format = (date = new Date(), formatStr = "YYYY-MM-DD HH:mm:ss") => {
  return  dayjs(new Date(date)).format(formatStr);
}