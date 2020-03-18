import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { COSActions, generatePath } from '../utils/cos';
import { FileDto } from './dto/imgUpload.dto';
@Injectable()
export class CosService {
  private readonly cos: COSActions;
  constructor(
    private readonly configService: ConfigService
  ) {
    this.cos = new COSActions(this.configService.cos, this.configService.static.imgPath);
  }

  public async uploadImage(img: FileDto) {
    const fulepath = generatePath(img.originalname);
    const [error, imgPath] = await this.cos.uploadImg(fulepath, img.buffer);
    if (error) {
      throw error
    }
    return '//' + imgPath;
  }

}
