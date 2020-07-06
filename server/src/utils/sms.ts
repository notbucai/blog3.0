/*
 * @Author: bucai
 * @Date: 2020-03-18 20:34:46
 * @LastEditors: bucai
 * @LastEditTime: 2020-07-06 16:34:12
 * @Description: 短信
 */
import * as QcloudSms from 'qcloudsms_js'
import SMSConfig from '../config/type/SMSConfig';

export default class SMS {
  private readonly optiopns: SMSConfig;
  private readonly qcloudsms: any;
  constructor(options: SMSConfig) {
    this.optiopns = options;
    // 短信应用 SDK AppID
    var appid = options.AppID;  // SDK AppID 以1400开头
    // 短信应用 SDK AppKey
    var appkey = options.appkey;
    // 实例化 QcloudSms
    this.qcloudsms = QcloudSms(appid, appkey);
  }
  async sendSMS(templateId: string | number, phoneNumber: string, params: (string | number)[]) {

    const ssender = this.qcloudsms.SmsSingleSender();

    return new Promise((resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
      function callback(err, res, resData) {
        if (err) {
          reject(err.errmsg || err.message || err.toString());
        } else {
          if (resData.result !== 0) {
            reject(resData.errmsg);
          } else {
            resolve();
          }
        }
      }
      ssender.sendWithParam("86", phoneNumber, templateId,
        params, this.optiopns.smsSign, "", "", callback);
    });
  }
}