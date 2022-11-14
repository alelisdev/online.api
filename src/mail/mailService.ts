import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/userCreateDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendUserConfirmation(user: CreateUserDto) {
    try {
      await this.mailerService
        .sendMail({
          to: user.email,
          from: this.config.get('MAIL_FROM'),
          // from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Affect Cx App! Confirm your Email',
          template: './invitation', // `.hbs` extension is appended automatically
          context: {
            // ✏️ filling curly brackets with content
            name: user.username,
            url: this.config.get('CONFIRM_URL'),
          },
        })
        .then((success) => {
          console.log('Mail sent');
          return success;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    } catch (e) {
      return e;
    }
  }
}
