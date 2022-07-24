import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import * as util from 'util';
import * as _ from 'lodash';
import { User } from '../entities/User';
import { ConfigService } from '../config/config.service';
// import { Category } from '../entity/category.entity';

class CacheKeys {
    readonly user: string = 'user:%s';
    readonly validationCode: string = 'validationcode:%s';
    readonly validationCodeTime: string = 'validationcodetime:%s';
    readonly userToken: string = 'usertoken:%s';
    readonly wsUserIdMap: string = 'WS_USER_MAP:%s';
    readonly publishArticle: string = 'publisharticle:%d';
    readonly categories: string = 'categories';
}

@Injectable()
export class RedisService {
    readonly client: Redis.Redis;
    readonly cacheKeys: CacheKeys;
    constructor(private readonly configService: ConfigService) {
        this.client = new Redis(this.configService.redis);
        this.cacheKeys = new CacheKeys();
    }

    async getUser (userId: string): Promise<User> {
        const cacheKey = util.format(this.cacheKeys.user, userId);
        const userStr = await this.client.get(cacheKey);
        if (!userStr) {
            return null;
        }
        const user = JSON.parse(userStr);
        return user;
    }

    async setUser (user: User) {
        const cacheKey = util.format(this.cacheKeys.user, user.id);
        return this.client.set(cacheKey, JSON.stringify(user), 'EX', 1 * 60 * 60);
    }

    async setValidationCode (phone: string, code: string, timeout = 10) {
        const cacheKey = util.format(this.cacheKeys.validationCode, phone);
        return this.client.set(cacheKey, code, 'EX', timeout * 60);
    }

    async getValidationCode (phone: string): Promise<string> {
        const cacheKey = util.format(this.cacheKeys.validationCode, phone);
        return this.client.get(cacheKey);
    }

    async setValidationCodeTime (phone: string, timeout = 10): Promise<string> {
        const cacheKey = util.format(this.cacheKeys.validationCodeTime, phone);
        return this.client.set(cacheKey, Date.now(), 'EX', timeout);
    }

    async getValidationCodeTime (phone: string): Promise<string> {
        const cacheKey = util.format(this.cacheKeys.validationCodeTime, phone);
        return this.client.get(cacheKey);
    }

    async setUserToken (userId: string, token: string) {
        const cacheKey = util.format(this.cacheKeys.userToken, userId);
        const tokenMaxAge: number = this.configService.server.tokenMaxAge;
        return this.client.set(cacheKey, token, 'EX', Math.floor(tokenMaxAge / 1000));
    }

    async getUserToken (userId: string) {
        const cacheKey = util.format(this.cacheKeys.userToken, userId);
        return this.client.get(cacheKey);
    }

    async setPublishArticle (userId: string, article) {
        const cacheKey = util.format(this.cacheKeys.publishArticle, userId);
        return this.client.set(cacheKey, JSON.stringify(article), 'EX', 60 * 60);
    }

    // async getCategories(): Promise<Category[]> {
    //     const str = await this.client.get(this.cacheKeys.categories);
    //     if (!str) {
    //         return null;
    //     }
    //     return JSON.parse(str);
    // }

    // async setCategories(categories: Category[]) {
    //     return this.client.set(this.cacheKeys.categories, JSON.stringify(categories), 'EX', 1 * 60 * 60);
    // }

    async setJson (key: string, value: object, expire: number) {
        try {
            const strValue = JSON.stringify(value);
            return this.client.set(key, strValue, 'EX', expire);
        } catch (error) {
            console.error(error);
        }
    }

    async getJson (key: string) {
        try {
            const value = await this.client.get(key);
            if (!value) return null;
            return JSON.parse(value)
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    async setCache (key: string, value: string, expire: number) {
        return this.client.set(key, value, 'EX', expire);
    }

    async getCache (key: string) {
        return this.client.get(key);
    }

    async delCache (key: string) {
        return this.client.del(key);
    }

}