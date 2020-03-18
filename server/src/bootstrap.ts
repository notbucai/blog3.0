import { ConfigService } from './config/config.service';
import { TransformResInterceptor } from './core/interceptors/transform-res.interceptor';
import { GlobalExceptionFilter } from './core/filters/global-exceptoin.filter';
import { ValidateDtoPipe } from './core/pipes/validate-dto.pipe';
import { MyLoggerService } from './common/logger.service';
import { INestApplication } from '@nestjs/common';

// api文档插件
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function initSwagger(app, swaggerPrefix) {
    // DocumentBuilder是一个辅助类，有助于结构的基本文件SwaggerModule。它包含几种方法，可用于设置诸如标题，描述，版本等属性。
    const options = new DocumentBuilder()
        .setTitle("博客3.0")
        .setDescription('博客3.0 接口文档') // 文档介绍
        .setVersion('1.0.0') // 文档版本
        // .addTag('') // 每个tag标签都可以对应着几个@ApiUseTags('用户,安全') 然后被ApiUseTags注释，字符串一致的都会变成同一个标签下的
        // .setBasePath('http://localhost:5000')
        .build();
    // 为了创建完整的文档（具有定义的HTTP路由），我们使用类的createDocument()方法SwaggerModule。此方法带有两个参数，分别是应用程序实例和基本Swagger选项。
    const document = SwaggerModule.createDocument(app, options);
    // 最后一步是setup()。它依次接受（1）装入Swagger的路径，（2）应用程序实例, （3）描述Nest应用程序的文档。
    SwaggerModule.setup(swaggerPrefix, app, document);
}

export default async function bootstrap(app: INestApplication, listening: boolean = true) {
    const configService: ConfigService = app.get(ConfigService);
    const myLoggerService: MyLoggerService = app.get(MyLoggerService);

    myLoggerService.info({
        message: 'Starting Nest application...',
        data: {
            NODE_ENV: process.env.NODE_ENV,
            port: configService.server.port,
        },
    });

    app.useGlobalPipes(new ValidateDtoPipe(configService));
    app.useGlobalInterceptors(new TransformResInterceptor(configService, myLoggerService));
    app.useGlobalFilters(new GlobalExceptionFilter(configService, myLoggerService));

    initSwagger(app, configService.server.swaggerPrefix);

    if (listening) {
        await app.listen(configService.server.port);
        myLoggerService.info({
            message: 'Nest application successfully started',
        });
    }
}