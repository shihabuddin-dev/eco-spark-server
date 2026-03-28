import { Request, Response } from 'express';
import status from 'http-status';
import { EmailService } from '../email/email.service';
import { EmailTemplate } from '../email/email.template';
import { envVars } from '../../config/env';

const handleContactInquiry = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: 'All fields (name, email, message) are required.',
            });
        }

        const html = EmailTemplate.contactEmailTemplate(name, email, message);
        
        await EmailService.sendEmail(
            envVars.EMAIL_SENDER_SMTP_USER, // Send to the admin (shihabuddin.dev@gmail.com)
            `New Contact Inquiry from ${name}`,
            html
        );

        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you shortly!',
        });
    } catch (error: any) {
        console.error('Email sending error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.',
            error: error.message,
        });
    }
};

export const ContactController = {
    handleContactInquiry,
};
