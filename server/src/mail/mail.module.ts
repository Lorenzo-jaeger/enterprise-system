import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: '"Enterprise System" <noreply@enterprise.com>',
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
