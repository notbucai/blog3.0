/*
 * @Author: bucai
 * @Date: 2020-03-23 20:55:22
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-07 21:44:22
 * @Description: 
 */
import { format } from 'date-fns';

export const formatDate = (date, formatStr = "yyyy-MM-dd HH:mm:ss") => {
  return format(new Date(date), formatStr);
}
