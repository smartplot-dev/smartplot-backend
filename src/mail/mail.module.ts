import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvoiceModule } from 'src/invoice/invoice.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
    useFactory: () => ({
      transport: {
        pool: true,
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED !== 'false',
        }
      },
      defaults: {
        from: process.env.SMTP_FROM,
      },
      template: {
        dir: process.cwd() + '/src/mail/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    inject: [ConfigService]
  }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController]
})
export class MailModule {}
