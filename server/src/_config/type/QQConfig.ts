import BaseConfig from './BaseConfig';

export default class QQConfig extends BaseConfig {
    readonly clientID: string;
    readonly clientSecret: string;
    readonly accessTokenURL: string;
    readonly userInfoURL: string;
    readonly getTokenInfo: string;

    constructor(cfg) {
        super(cfg);
    }
}