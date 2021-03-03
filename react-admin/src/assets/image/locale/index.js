/*
 * @Author: bucai
 * @Date: 2021-03-02 10:33:25
 * @LastEditors: bucai
 * @LastEditTime: 2021-03-02 10:44:31
 * @Description: 
 */
import { ZH_CN, EN_US } from '@/locale';
import AmericaIcon from './america.svg'
import ChinaIcon from './china.svg'

export const America = AmericaIcon;
export const China = ChinaIcon;

const locale = {
  [ZH_CN]: China,
  [EN_US]: America,
}

export default locale;