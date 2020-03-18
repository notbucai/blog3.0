import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImgUploadDto, FileDto } from './dto/imgUpload.dto';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { CosService } from './cos.service';

@Controller('common')
@ApiTags('公共接口')
export class CommonController {

  constructor(private readonly cosService: CosService) { }

  @Post('uploadImage')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter(req, file, callback) {
      if (!file.mimetype.startsWith('image/')) {
        callback(new MyHttpException({
          code: ErrorCode.ImageTypeError.CODE
        }), false);
      } else {
        callback(null, true);
      }
    }
  }))
  @ApiOperation({ summary: "图片上传" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: ImgUploadDto,
  })
  public uploadImage(@UploadedFile() file: FileDto) {
    return this.cosService.uploadImage(file);
  }

}
