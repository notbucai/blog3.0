/*
 * @Author: bucai
 * @Date: 2020-03-23 20:55:22
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-23 21:12:58
 * @Description: 
 */
import { format } from 'date-fns';

export const formatDate = (date, formatStr = "yyyy-MM-dd HH:mm:ss") => {
  return format(date, formatStr);
}