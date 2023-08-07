/*
 * @Author: bucai
 * @Date: 2021-04-01 23:07:20
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-02 00:25:33
 * @Description: 
 */
import BaseConfig from './BaseConfig';

export default class AliyunCaptchaConfig extends BaseConfig {

    public readonly accessKeyId: string;
    public readonly accessKeySecret: string;

    constructor(cfg) {
        super(cfg);
    }
}