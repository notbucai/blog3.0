/*
 * @Author: bucai
 * @Date: 2020-05-03 21:01:51
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2021-11-27 14:15:09
 * @Description: 
 */
import { format,formatDistanceToNow } from 'date-fns';

import * as zhCNLocale from 'date-fns/locale/zh-CN/index.js'
/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce (func, wait, immediate) {
  let timeout;

  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait)
      if (callNow) func.apply(context, args)
    }
    else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait);
    }
  }
}
/**
 * @desc 函数节流
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
function throttle (func, wait, type) {
  let previous = 0;
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (type === 1) {
      let now = Date.now();

      if (now - previous > wait) {
        func.apply(context, args);
        previous = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          func.apply(context, args)
        }, wait)
      }
    }
  }
}
/**
 * 树状扁平化
 * @param {Array} currentArr 
 * @param {String} keyName 
 */
function flatTreeList (currentArr, keyName = 'children') {
  let _list = [];
  for (let i = 0; i < currentArr.length; i++) {
    _list.push(currentArr[i])
    if (currentArr[i][keyName]) {
      _list.push(...flatTreeList(currentArr[i][keyName], keyName));
    }
  }
  return _list;
};

function formatDate (date = new Date(), formatStr = 'yyyy-MM-dd HH:mm:ss') {
  return format(date, formatStr);
}

function fromNowDate (date = new Date()) {
  if(!date) {
    date = new Date()
  }
  return formatDistanceToNow(date, { addSuffix: true, locale: zhCNLocale });
}

async function fileToBase64 (file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((ok, gg) => {
    reader.onerror = e => {
      console.error(e);

      gg(e);
    }
    reader.onload = e => {
      const result = e.target.result;
      const base64 = result.substring(result.indexOf(',') + 1);
      ok(base64);
    };
  })
}

function getFileSuffix (file) {
  var filename = file.name;
  var index1 = filename.lastIndexOf(".");
  var index2 = filename.length;
  var type = filename.substring(index1 + 1, index2);
  return type;
}

function randomString (len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function date2timeStamp (date) {
  if (Number.isNaN(Number(date))) {
    return new Date(date).getTime()
  } else {
    return parseInt((parseInt(date) * 24 * 3600 * 1000));
  }
}

export default {
  debounce,
  throttle,
  flatTreeList,
  formatDate,
  fromNowDate,
  fileToBase64,
  getFileSuffix,
  randomString,
  date2timeStamp
}