import { Injectable } from '@nestjs/common';
import { ReadService } from '../article/read.service';
import { ArticleService } from '../article/article.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientIpInfo as ClientIpInfoRepository } from '../../entities/ClientIpInfo';
import { Repository } from 'typeorm';
import { ConfigService } from '../../config/config.service';
import http from '../../plugins/axios';
import { LoggerService } from '../../common/logger.service';
import { delay } from '../../utils/common';

@Injectable()
export class ClientIpService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly articleReadService: ReadService,
    // logger
    private readonly loggerService: LoggerService,

    private readonly configService: ConfigService,

    @InjectRepository(ClientIpInfoRepository)
    private clientIpInfoRepository: Repository<ClientIpInfoRepository>,
  ) {}

  getLastRow() {
    return this.clientIpInfoRepository.findOne({
      where: {},
      order: {
        id: 'DESC',
      },
    });
  }

  getRowByIp(ip: string) {
    return this.clientIpInfoRepository.findOne({
      where: {
        ip,
      },
    });
  }

  async getClientInfoByIp(ip: string) {
    // 国外 http://ip-api.com/json/218.206.197.134?lang=zh-CN&fields=status,message,country,countryCode,region,regionName,city,lat,lon
    // 百度 https://api.map.baidu.com/location/ip?ak=您的AK&ip=您的IP&coor=bd09ll
    // const appKey = this.configService.baiduMap.appKey;
    // const url = `https://api.map.baidu.com/location/ip?ak=${appKey}&ip=${ip}&coor=bd09ll`;
    // const res = await http.get<IBaiduLocationIp>(url);

    const url = `http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,message,country,countryCode,region,regionName,city,lat,lon`;
    const res = await http.get<IIpApiData>(url);
    const header = res.headers || {};
    // X-Rl、X-Ttl
    const xrl = header['x-rl'];
    const xttl = header['x-ttl'];
    this.loggerService.info({
      message: `getClientInfoByIp xrl: ${xrl}, xttl: ${xttl}`,
    });

    const data: IIpApiData = res.data || {};
    if (data?.status !== 'success') {
      throw new Error(data?.message);
    }

    const clientIpInfo = new ClientIpInfoRepository();

    clientIpInfo.ip = ip;
    clientIpInfo.city = data.city;
    clientIpInfo.country = data.country;
    clientIpInfo.countryCode = data.countryCode;
    clientIpInfo.lat = data.lat;
    clientIpInfo.lon = data.lon;
    clientIpInfo.region = data.region;
    clientIpInfo.regionName = data.regionName;

    return clientIpInfo;
  }

  private async generateClientIpInfoByRows(ips: string[]) {
    this.loggerService.info({
      message: `ips: ${ips.length}`,
    });
    this.loggerService.info({
      message: `ips: ${ips.length}`,
    });
    // 查信息，控制并发1分钟最多30个请求
    const COMPLICATION_SIZE = 40;
    const COMPLICATION_ITEM_TIME = (1000 * 60) / COMPLICATION_SIZE;

    for (let i = 0; i < ips.length; i++) {
      let startNow = Date.now();
      const ip = ips[i];

      try {
        this.loggerService.info({
          message: `start: [${i}]: ip: ${ip}, startNow: ${startNow}`,
        });
        const row = await this.getRowByIp(ip);
        if (row) {
          startNow -= COMPLICATION_ITEM_TIME;
          this.loggerService.info({
            message: `ip: ${ip}, row: ${row}, startNow: ${startNow}`,
          });
          continue;
        }
        const clientIpInfo = await this.getClientInfoByIp(ip);
        this.loggerService.info({
          message: `getClientInfoByIp: [${i}]: ip: ${ip}`,
          data: clientIpInfo,
        });
        await this.clientIpInfoRepository.save(clientIpInfo);
      } catch (error) {
        this.loggerService.error({
          message: `ip: ${ip}, esg: ${error?.message}.`,
          data: error,
        });
      } finally {
        this.loggerService.info({
          message: `finally: [${i}]: ip: ${ip}}`,
        });
        let endNow = Date.now();
        let diff = endNow - startNow;
        if (diff < COMPLICATION_ITEM_TIME) {
          await delay(COMPLICATION_ITEM_TIME - diff);
        }
      }
    }
  }

  async generateClientIpInfo() {
    // const lastRow = await this.getLastRow();
    const lastDate = new Date(0);
    this.loggerService.info({
      message: `lastDate: ${lastDate}`,
      // data: lastRow,
    });

    // 遍历所有数据
    let total = 0;
    let readOnlyRowsNum = 0;
    let LIMIT = 1000;
    do {
      try {
        // 如果没有就取1970年1月1日
        const readOnlyData = await this.articleReadService.findAfterDateRows(
          lastDate,
          LIMIT,
          readOnlyRowsNum * LIMIT,
        );
        const readOnlyRows = readOnlyData.rows;
        total = readOnlyData.total;
        // 1. 取出所有ip
        let ips = readOnlyRows.map(item => item.ip);
        // 去重
        ips = [...new Set(ips)];

        // 2. ip对应的信息
        await this.generateClientIpInfoByRows(ips);
      } catch (error) {
        this.loggerService.error({
          message: `error: ${error?.message}.`,
          data: error,
        });
      } finally {
        this.loggerService.info({
          message: `finally: total: ${total}, readOnlyRowsNum: ${readOnlyRowsNum}`,
        });
        readOnlyRowsNum++;
      }
    } while (total > readOnlyRowsNum * LIMIT);

    return total;
  }
}
