import BaseConfig from './BaseConfig';

export default class MysqlConfig extends BaseConfig {

    public readonly type: 'mysql';
    public readonly host: string;
    public readonly port: number;
    public readonly username: string;
    public readonly password: string;
    public readonly database: string;
    public readonly synchronize: boolean;
    public readonly logging: boolean;

    constructor(cfg) {
        super(cfg);
    }
}