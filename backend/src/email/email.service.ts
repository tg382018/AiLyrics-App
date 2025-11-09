import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = port === 465;

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: Number(process.env.SMTP_CONNECTION_TIMEOUT ?? 10000),
      socketTimeout: Number(process.env.SMTP_SOCKET_TIMEOUT ?? 10000),
      tls: secure
        ? undefined
        : {
            // Gmail 587 STARTTLS
            ciphers: 'SSLv3',
          },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      });
      this.logger.log(`📧 Mail gönderildi → ${to}`);
    } catch (err) {
      this.logger.error(`❌ Mail gönderilemedi → ${to}`, err);
    }
  }
}
