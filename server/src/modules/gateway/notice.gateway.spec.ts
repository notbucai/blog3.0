import { Test, TestingModule } from '@nestjs/testing';
import { NoticeGateway } from './notice.gateway';

describe('NoticeGateway', () => {
  let gateway: NoticeGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoticeGateway],
    }).compile();

    gateway = module.get<NoticeGateway>(NoticeGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
