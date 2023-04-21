/*
 * @Author: bucai
 * @Date: 2020-03-18 20:34:46
 * @LastEditors: bucai
 * @LastEditTime: 2020-07-06 16:34:12
 * @Description: 短信
 */
import * as QcloudSms from 'qcloudsms_js'
import SMSConfig from '../config/type/SMSConfig';
import axios from 'axios';

export const messages = {
  0: { code: 0, enum: 'Ok', message: '请求成功' },
  101000: { code: 101000, enum: 'Internal', message: '内部错误' },
  101301: {
    code: 101301,
    enum: 'NoUpstreamConfigured',
    message:
      '未设置有效的上游通道。请检查是否开启了专家模式并未完成通道配置，你可以切换至融合模式快速地解决该问题',
  },
  101303: {
    code: 101303,
    enum: 'NoUpstreamAvailable',
    message: '所有上游通道失败，表示该请求没有可提供服务的上游',
  },
  104001: { code: 104001, enum: 'MissingParams', message: '缺少参数' },
  104002: { code: 104002, enum: 'InvalidParams', message: '无效的参数' },
  104003: { code: 104003, enum: 'RestrictedParams', message: '受限的参数' },
  104110: {
    code: 104110,
    enum: 'MissingAccessKeyId',
    message: '缺少 AccessKeyId',
  },
  104111: {
    code: 104111,
    enum: 'InvalidAccessKeyId',
    message: '错误的 AccessKeyId',
  },
  104201: {
    code: 104201,
    enum: 'InvalidSignature',
    message: '错误的签名。请参考 API 通用说明 生成请求签名',
  },
  104202: {
    code: 104202,
    enum: 'InvalidSignatureTimestamp',
    message:
      '无效的签名时间戳。请检查传入的值是否为有效的 UNIX 时间戳，可接受与服务器时间差为 10 分钟',
  },
  105001: { code: 105001, enum: 'Unauthorized', message: '未授权' },
  105100: {
    code: 105100,
    enum: 'IpRestricted',
    message:
      '请求 IP 受限。请检查是否启用 IP 限制扩展服务，并确保请求服务器 IP 与配置相符',
  },
  105300: {
    code: 105300,
    enum: 'LimitExceed',
    message:
      '超出发送频率限制。请检查是否启用发送频率限制扩展服务，如有需要可自行调整限制上限',
  },
  105400: { code: 105400, enum: 'InsufficientFunds', message: '账户余额不足' },
  107111: {
    code: 107111,
    enum: 'InvalidPhoneNumbers',
    message: '错误的手机号码',
  },
  107120: {
    code: 107120,
    enum: 'MissingSmsSignature',
    message: '缺少短信签名',
  },
  107121: {
    code: 107121,
    enum: 'SmsSignatureNotExists',
    message: '短信签名不存在，请访问控制台添加',
  },
  107122: {
    code: 107122,
    enum: 'InvalidSmsSignature',
    message: '无效的短信签名，表示该签名未通过审核或正在审核中',
  },
  107123: {
    code: 107123,
    enum: 'RestrictedSmsSignature',
    message: '受限的短信签名，请联系客户经理了解是否有协商限制',
  },
  107141: {
    code: 107141,
    enum: 'SmsTemplateNotExists',
    message:
      '短信模板不存在，请访问控制台添加。如果你使用的是以pub_开头的免审模板，请检查模板码是否正确',
  },
  107143: {
    code: 107143,
    enum: 'MissingSmsTemplateData',
    message: '缺少必要的短信模板参数',
  },
  107144: {
    code: 107144,
    enum: 'InvaildSmsTemplateData',
    message: '无效的短信模板参数',
  },
  107145: {
    code: 107145,
    enum: 'RestrictedSmsTemplate',
    message: '受限的短信模板，请联系客户经理了解是否有协商限制',
  },
};
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
  async sendSMS(templateId: string | number, to: string, params: Record<string, string>) {

    const { data } = await axios.post(
      `https://uni.apistd.com/?action=sms.message.send&accessKeyId=${this.optiopns.accessKey}`,
      {
        to: to,
        signature: this.optiopns.smsSign,
        templateId: templateId,
        templateData: params,
      },
    );
    console.log('send sms data.code', data.code);

    if (data.code !== 0 && data.code !== '0') {
      throw new Error(messages[data.code]?.message || data.message);
    }
    return data.data;

    // const ssender = this.qcloudsms.SmsSingleSender();

    // return new Promise((resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
    //   function callback(err, res, resData) {
    //     if (err) {
    //       reject(err.errmsg || err.message || err.toString());
    //     } else {
    //       if (resData.result !== 0) {
    //         reject(resData.errmsg);
    //       } else {
    //         resolve();
    //       }
    //     }
    //   }
    //   ssender.sendWithParam("86", phoneNumber, templateId,
    //     params, this.optiopns.smsSign, "", "", callback);
    // });
  }
}