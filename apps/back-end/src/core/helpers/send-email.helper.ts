import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';
import { ENV_KEYS } from '../config/env-keys';

export class SendEmail {
  constructor(private configSerice: ConfigService) {}
  async sendCodeEmail(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: this.configSerice.get(ENV_KEYS.EMAIL),
        pass: this.configSerice.get(ENV_KEYS.EMAIL_PASSWORD),
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
