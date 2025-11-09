import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not set. Emails will not be sent.');
    }
    this.resend = new Resend(apiKey);
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      if (!process.env.RESEND_API_KEY) {
        this.logger.warn(`Skipping email to ${to}; RESEND_API_KEY missing.`);
        return;
      }

      await this.resend.emails.send({
        from:
          process.env.RESEND_FROM ??
          process.env.SMTP_FROM ??
          'AI Lyrics <no-reply@ai-lyrics.com>',
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
