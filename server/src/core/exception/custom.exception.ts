/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2022-03-13 22:38:11
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-13 22:39:36
 * @Description: 
 */
import { ErrorCode } from '../../constants/error';

class CustomExceptionOption {
  code?: number;
  message?: string;
}

export class CustomException extends Error {
  public code: number;
  public message: string;
  constructor(expData: CustomExceptionOption) {
    if (typeof expData.code === 'undefined') {
      expData.code = ErrorCode.ParamsError.CODE;
    }
    if (typeof expData.message === 'undefined') {
      expData.message = ErrorCode.CodeToMessage(expData.code || ErrorCode.ParamsError.CODE);
    }
    super(expData.message);
    this.code = expData.code;
    this.message = expData.message;
  }
}