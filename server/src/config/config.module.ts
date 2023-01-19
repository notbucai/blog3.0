import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
    static async forRootAsync (): Promise<DynamicModule> {
        await ConfigService.init();
        return {
            module: ConfigModule,
            providers: [ConfigService],
            exports: [ConfigService],
        }
    }
}