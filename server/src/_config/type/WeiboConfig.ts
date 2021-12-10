import BaseConfig from './BaseConfig';

export default class WeiboConfig extends BaseConfig {
    readonly clientID: string;
    readonly clientSecret: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;
    readonly authorizeURL: string;
    readonly getTokenInfo: string;

    constructor(cfg) {
        super(cfg);
    }
}