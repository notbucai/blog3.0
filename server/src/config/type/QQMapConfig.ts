import BaseConfig from './BaseConfig';

export default class QQMapConfig extends BaseConfig {
    readonly key: string;
    readonly sk: string;

    constructor(cfg) {
        super(cfg);
    }
}