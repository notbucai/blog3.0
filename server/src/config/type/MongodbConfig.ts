import BaseConfig from './BaseConfig';

export default class MongodbConfig extends BaseConfig {

    public readonly uri: string;
    public readonly useUnifiedTopology: boolean;
    public readonly useNewUrlParser: boolean;
    public readonly useCreateIndex: boolean;

    constructor(cfg) {
        super(cfg);
    }
}