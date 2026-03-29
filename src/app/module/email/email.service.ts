import nodemailer from 'nodemailer';
import { envVars } from '../../config/env';

const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: envVars.EMAIL_SENDER_SMTP_HOST,
        port: Number(envVars.EMAIL_SENDER_SMTP_PORT),
        secure: Number(envVars.EMAIL_SENDER_SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: envVars.EMAIL_SENDER_SMTP_USER,
            pass: envVars.EMAIL_SENDER_SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: `"${envVars.EMAIL_SENDER_SMTP_FROM}" <${envVars.EMAIL_SENDER_SMTP_USER}>`,
        to,
        subject,
        html,
    });
};

export const EmailService = {
    sendEmail,
};
