import BaseConfig from './BaseConfig';

export default class BaiduMapConfig extends BaseConfig {
    readonly appKey: string;

    constructor(cfg) {
        super(cfg);
    }
}