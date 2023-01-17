/*
 * @Author: bucai
 * @Date: 2021-04-01 23:07:20
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-02 00:25:33
 * @Description: 
 */
import BaseConfig from './BaseConfig';

export default class DBConfig extends BaseConfig {

    public readonly appID: string;
    public readonly appSecret: string;
    public readonly CaptchaAppId: number;
    public readonly AppSecretKey: string;

    constructor(cfg) {
        super(cfg);
    }
}