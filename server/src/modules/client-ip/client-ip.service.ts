import { Injectable } from '@nestjs/common';
import { ReadService } from '../article/read.service';
import { ArticleService } from '../article/article.service';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientIpInfo as ClientIpInfoRepository } from '../../entities/ClientIpInfo';
import { In, Repository } from 'typeorm';
import { ConfigService } from '../../config/config.service';
import http from '../../plugins/axios';
import { LoggerService } from '../../common/logger.service';
import { delay, md5 } from '../../utils/common';
import { URLSearchParams } from 'url';
import { chunk } from 'lodash';

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
  getRowByInIps(ips: string[]) {
    return this.clientIpInfoRepository.find({
      where: {
        ip: In(ips),
      },
      select: ['ip'],
    });
  }
  async getClientInfoByIpOfQQMap(ip: string) {
    const appKey = this.configService.qqMap.key;
    const sk = this.configService.qqMap.sk;
    const params: Record<string, string> = {
      key: appKey,
      ip,
    };
    // key排序
    const keys = Object.keys(params).sort();
    // 拼接字符串
    const paramStr = keys
      .reduce((pv, curr) => {
        return pv + curr + '=' + params[curr] + '&';
      }, '')
      .replace(/&$/, '');

    const tempStr = `/ws/location/v1/ip?${paramStr}${sk}`;

    // md5
    const sig = md5(tempStr);
    params.sig = sig;
    this.loggerService.info({
      message: `getClientInfoByIpOfQQMap tempStr: ${tempStr} sig: ${sig}`,
    });
    const url = `https://apis.map.qq.com/ws/location/v1/ip?${new URLSearchParams(
      params,
    )}`;
    const res = await http.get<IQQLocationIpResponse>(url);
    const data = res.data;
    if (data?.status !== 0) {
      throw new Error(data?.message);
    }
    const clientIpInfo = new ClientIpInfoRepository();

    clientIpInfo.ip = ip;
    clientIpInfo.city = data?.result?.ad_info?.city;
    clientIpInfo.country = data?.result?.ad_info?.nation;
    clientIpInfo.countryCode = data?.result?.ad_info?.nation_code?.toString();
    clientIpInfo.lat = data?.result?.location?.lat;
    clientIpInfo.lon = data?.result?.location?.lng;
    clientIpInfo.region = data?.result?.ad_info?.province;
    clientIpInfo.regionName = data?.result?.ad_info?.district;

    return clientIpInfo;
  }
  async getClientInfoByIp(ip: string) {
    // 国外 http://ip-api.com/json/218.206.197.134?lang=zh-CN&fields=status,message,country,countryCode,region,regionName,city,lat,lon
    // 百度 https://api.map.baidu.com/location/ip?ak=您的AK&ip=您的IP&coor=bd09ll
    // const appKey = this.configService.baiduMap.appKey;
    // const url = `https://api.map.baidu.com/location/ip?ak=${appKey}&ip=${ip}&coor=bd09ll`;
    // const res = await http.get<IBaiduLocationIp>(url);
    const domains = ['http://ip-api.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const url = `${domain}/json/${ip}?lang=zh-CN&fields=status,message,country,countryCode,region,regionName,city,lat,lon`;
    const res = await http.get<IIpApiData>(url, {
      timeout: 8 * 1000,
    });
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
    const COMPLICATION_SIZE = 15;
    const existRows = await this.getRowByInIps(ips);
    const existIps = existRows.map(item => item.ip);
    // 去重
    const newIps = ips.filter(item => {
      return !existIps.includes(item);
    });
    // COMPLICATION_SIZE个一组
    const chunkIps = chunk(newIps, COMPLICATION_SIZE);

    for (let i = 0; i < chunkIps.length; i++) {
      const ips = chunkIps[i];
      const chunkStartTime = Date.now();
      const promiseList = ips.map(async ip => {
        try {
          this.loggerService.info({
            message: `start: [${i}]: ip: ${ip}`,
          });
          const row = await this.getRowByIp(ip);
          if (row) {
            this.loggerService.info({
              message: `ip: ${ip}, row: ${row}`,
            });
            return;
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
        }
      });
      await Promise.all(promiseList);
      const chunkEndTime = Date.now();
      const chunkDiffTime = chunkEndTime - chunkStartTime;
      // 查看是否超过1分钟，如果没有就延迟间隔
      await delay(5 * 1000);
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
          LIMIT,
          readOnlyRowsNum * LIMIT,
        );
        const readOnlyRows = readOnlyData.rows;
        // 避免死循环
        if (total === 0) {
          total = readOnlyData.total;
        }
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

  groupByLonLat() {
    return this.clientIpInfoRepository
      .createQueryBuilder('client_ip_info')
      .select('count(*) as count, client_ip_info.lon, client_ip_info.lat')
      .groupBy('client_ip_info.lon, client_ip_info.lat')
      .orderBy({
        count: 'DESC',
      })
      .getRawMany();
  }

  groupByCity() {
    return this.clientIpInfoRepository
      .createQueryBuilder('client_ip_info')
      .select('count(*) as count, client_ip_info.city')
      .groupBy('client_ip_info.city')
      .orderBy({
        count: 'DESC',
      })
      .limit(30)
      .getRawMany();
  }
  groupByRegion() {
    return this.clientIpInfoRepository
      .createQueryBuilder('client_ip_info')
      .select('count(*) as count, client_ip_info.regionName')
      .groupBy('client_ip_info.regionName')
      .orderBy({
        count: 'DESC',
      })
      .limit(30)
      .getRawMany();
  }
}
