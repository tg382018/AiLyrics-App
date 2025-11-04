    import { Injectable, Logger } from '@nestjs/common';
    import * as nodemailer from 'nodemailer';

    @Injectable()
    export class EmailService {
    private transporter;
    private readonly logger = new Logger(EmailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
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
