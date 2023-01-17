import BaseConfig from './BaseConfig';

export default class WxMpConfig extends BaseConfig {
    readonly clientID: string;
    readonly clientSecret: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;

    constructor(cfg) {
        super(cfg);
    }
}