import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UsersService } from './usersService';
import { User } from './entity/userEntity';
import { UserDto, UserUpdateDto } from './dto/userDto';
import { JwtAuthGuard } from '../auth/jwtAuthGuard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  SERVER_URL = process.env.SERVER_URL;
  constructor(private service: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.service.findAll();
  }

  @Get(':id')
  get(@Param() params: Partial<UserDto>) {
    return this.service.findOne(params.id);
  }

  @Post('/getByPayload')
  findByPayload(@Body() data: Partial<User>) {
    return this.service.findAllByPayload(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<UserUpdateDto>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':userId/uploadAvatar')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.update(userId, {
      avatar: `${this.SERVER_URL}/uploads/${file.filename}`,
    });
  }

  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadImage(
    @Req() req: any,
    @Body() data: Partial<User>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      console.log(req.user);
      if (data.avatar) {
        req.user.avatar = file.filename;
      } else if (data.background) {
        req.user.background = file.filename;
      }

      this.service.update(req.user.id, req.user);
      return {
        success: true,
        data: `${this.SERVER_URL}/uploads/${file.filename}`,
      };
    } catch (e) {
      return e;
    }
  }

  @Post(':userId/uploads')
  @UseInterceptors(
    FilesInterceptor('photos[]', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadMultiple(
    @Param('userId') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);
  }
}

export const imageFileFilter = (req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(csv)$/)) {
    return callback(new Error('Only csv files are allowed!'), false);
  }
  callback(null, true);
};
