import * as path from 'path';

const domain = '127.0.0.1';
const port = 9905;
const url = `http://${domain}`; 

const staticURL = `https://image.notbucai.com`; // 静态资源域名配置

export default {
    db: {
        // type: 'mongodb',
        // host: 'localhost',
        // port: 27017,
        // // charset: 'utf8mb4',
        // username: '',
        // password: '',
        // database: 'blog3',
        // synchronize: false,
        // entities: [path.join(__dirname, '../entity/**/*.entity{.ts,.js}')],
        // useUnifiedTopology: true,
        // logging: 'all', // query, error, schema, warn, info, log, all
        // logger: 'simple-console',
        // maxQueryExecutionTime: 500, // 单位毫秒
        uri: "mongodb://localhost/blog3",
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
    },
    static: {
        staticURL,
        imgPath: `${staticURL}`,
        imgFormat: ['jpg', 'jpeg', 'png', 'gif'],
        imgMaxSize: 3 * 1024 * 1024,
        imgMaxSizeError: '图片大小不能超过%sM',
        userLevelChapterURL: 'https://www.notbucai.com/',
    },
    // 腾讯云存储
    cos: {
        SecretId: '',
        SecretKey: '',
        Bucket: "blog-",
        Region: "ap-chengdu",
    },
    // 腾讯云 短信
    sms: {
        AppID: "",
        appkey: "",
        templateIds: {
            code: "", // 验证码模版id
        },
        smsSign: "code"
    },
    email: {
        host: "smtp.qq.com",
        port: 465,
        secure: true,
        auth: {
            user: 'bucai_o@qq.com',
            pass: ''
        }
    },

    captcha: {
        appID: "",
        appSecret: "",
        CaptchaAppId: 0,
        AppSecretKey: '**',
    },

    wxMp: {
        AppID: "",
        AppSecret: "",
        urls: {
            getAccessToken: "https://api.weixin.qq.com/cgi-bin/token",
            code2Session: "https://api.weixin.qq.com/sns/jscode2session",
            getUnlimited: "https://api.weixin.qq.com/wxa/getwxacodeunlimit"
        }
    },

    server: {
        siteName: '不才的博客',
        companyName: '北京xxxxxxx有限公司',
        icp: '京ICP备12345678号',
        email: "bucai_o@qq.com",
        url,
        domain,
        allowOrigins: [],
        port,
        apiPrefix: '/api/v1',
        passSalt: '',
        tokenName: 'authorization',
        tokenSecret: '',
        tokenMaxAge: 7 * 24 * 60 * 60 * 1000, // token多久过期，单位毫秒
        cookieSecret: '',
        rateLimitWindowMs: 15 * 60 * 1000, // 时间窗口，单位毫秒
        rateLimitMax: 1000, // limit each IP to rateLimitMax requests per windowMs
        swaggerPrefix: 'doc/v1'
    },

    // GeeTest 极验验证
    geetestCaptcha: {
        geetest_id: '',
        geetest_key: '',
    },
    github: {
        clientID: '',
        clientSecret: '',
        accessTokenURL: 'https://github.com/login/oauth/access_token',
        userInfoURL: 'https://api.github.com/user',
    },
    baidu: {
        clientID: '',
        clientSecret: '',
        accessTokenURL: 'https://openapi.baidu.com/oauth/2.0/token',
        userInfoURL: 'https://openapi.baidu.com/rest/2.0/passport/users/getLoggedInUser',
    },
    weibo: {
        clientID: '',
        clientSecret: '',
        accessTokenURL: 'https://api.weibo.com/oauth2/access_token',
        getTokenInfo: 'https://api.weibo.com/oauth2/get_token_info',
        userInfoURL: 'https://api.weibo.com/2/users/show.json',
    },
    gitee: {
        clientID: '',
        clientSecret: '',
        accessTokenURL: 'https://gitee.com/oauth/token',
        userInfoURL: 'https://gitee.com/api/v5/user',
    },
    qq: {
        clientID: '',
        clientSecret: '',
        accessTokenURL: 'https://graph.qq.com/oauth2.0/token',
        getTokenInfo: 'https://graph.qq.com/oauth2.0/me',
        userInfoURL: 'https://graph.qq.com/user/get_user_info',
    },

    wxmp_oauth: {
        clientID: '',
        clientSecret: '',
        accessTokenURL: 'https://www.notbucai.com/api/openapi/access_token',
        userInfoURL: 'https://www.notbucai.com/api/openapi/userinfo',
    },
    // 内容审查 百度AI
    censor: {
        appID: "",
        apiKey: "",
        secretKey: ""
    }
};
