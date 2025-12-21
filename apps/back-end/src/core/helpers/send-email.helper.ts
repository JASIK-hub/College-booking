import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { ENV_KEYS } from '../config/env-keys';

export class SendEmail {
  constructor(private configService: ConfigService) {}
  async sendCodeEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get(ENV_KEYS.EMAIL),
        pass: this.configService.get(ENV_KEYS.EMAIL_PASSWORD),
      },
    });

    await transporter.sendMail({
      from: '"College App" <no-reply@college.com>',
      to: email,
      subject: 'Your login code',
      text: `Your login code is ${code}. It is valid for 5 minutes.`,
    });
  }
}
