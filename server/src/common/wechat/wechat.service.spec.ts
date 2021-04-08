import { Test, TestingModule } from '@nestjs/testing';
import { WechatService } from './wechat.service';

describe('WechatService', () => {
  let service: WechatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WechatService],
    }).compile();

    service = module.get<WechatService>(WechatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
