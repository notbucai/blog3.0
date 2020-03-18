/*
 * @Author: bucai
 * @Date: 2020-03-18 15:24:38
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-18 20:05:49
 * @Description: cos操作类
 */
import * as path from 'path';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as COS from 'cos-nodejs-sdk-v5';
import COSConfig from '../config/type/COSConfig';
import { promisify } from 'util';

export class COSActions {
  private readonly options: COSConfig;
  private client: any;
  constructor(options: COSConfig, Domain: string) {

    this.options = options;
    this.client = new COS({
      SecretId: options.SecretId,
      SecretKey: options.SecretKey,
      Domain
    });
  }
  public async uploadImg(path: string, body: any) {
    const resData = [null, null];
    const opts = this.options;

    try {
      const res = await promisify(this.client.putObject.bind(this.client))({
        Bucket: opts.Bucket,
        Region: opts.Region,
        Key: path,
        Body: body,
      });
      if (res.statusCode === 200) {
        resData[1] = res.Location;
      } else {
        resData[0] = res;
      }
    } catch (error) {
      resData[0] = error;
    }

    return resData;
  }
}

export const generatePath = (filename: string): string => {
  const filePathJson = path.parse(filename);
  const md5 = crypto.createHash('md5').update(filename).digest('hex');
  const dirname = moment(Date.now()).format('YYYY/MM/DD');
  return path.join(dirname, md5 + filePathJson.ext);
}