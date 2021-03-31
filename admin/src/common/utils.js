/*
 * @Author: bucai
 * @Date: 2020-03-23 20:55:22
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-31 13:08:33
 * @Description: 
 */
import { format } from 'date-fns';

export const formatDate = (date, formatStr = "yyyy-MM-dd HH:mm:ss") => {
  return format(date, formatStr);
}
