import BaseConfig from './BaseConfig';

export default class COSConfig extends BaseConfig {
    readonly SecretId: string;
    readonly SecretKey: string;
    readonly Bucket: string;
    readonly Region: string;

    constructor(cfg) {
        super(cfg);
    }
}