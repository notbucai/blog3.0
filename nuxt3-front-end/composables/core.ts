/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2021-12-08 17:08:06
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-12-08 18:22:43
 * @Description: 
 */
import { useState } from "#app";

export const useToken = () => useState('core-token', () => null)
export const useLoginOrRegisterDialog = () => useState('core-loginOrRegisterDialog', () => false)

export const useSideStatus = () => useState('core-sideStatus', () => false)
export const useTheme = () => useState('core-theme', () => 'light')