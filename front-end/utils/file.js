/*
 * @Author: bucai
 * @Date: 2020-05-05 10:58:10
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-04-13 22:54:20
 * @Description: 文件工具
 */

import { asyncLoad } from "./loadScriptComponent";

const options = {
  // maxSizeMB: 1, // (default: Number.POSITIVE_INFINITY)
  maxWidthOrHeight: 1000, // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined)
  // useWebWorker: boolean, // optional, use multi-thread web worker, fallback to run in main-thread (default: true)
  // maxIteration: number, // optional, max number of iteration to compress the image (default: 10)
  // exifOrientation: number, // optional, see https://stackoverflow.com/a/32490603/10395024
  // onProgress: Function, // optional, a function takes one progress argument (percentage from 0 to 100)
  fileType: 'png' // optional, fileType override
};

export const imageFleCompression = async (file) => {
  // 应该吧价值的位置放在这里
  const imageCompression = await asyncLoad.browserImageCompression();
  const _file = await imageCompression(file, options);
  // const _file = file;
  console.log('-原图：', file);
  console.log('处理后：', _file);
  return _file
}

export const fileSize = (file) => {
  return file.size / 1024 / 1024;
}