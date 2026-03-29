import status from 'http-status';
import { EmailService } from '../email/email.service';
import { EmailTemplate } from '../email/email.template';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';

interface IContactPayload {
    name: string;
    email: string;
    message: string;
}

const handleContactInquiry = async (payload: IContactPayload) => {
    const { name, email, message } = payload;

    if (!name || !email || !message) {
        throw new AppError(status.BAD_REQUEST, 'All fields (name, email, message) are required.');
    }

    const html = EmailTemplate.contactEmailTemplate(name, email, message);
    
    await EmailService.sendEmail(
        envVars.EMAIL_SENDER_SMTP_USER, // Send to the admin
        `New Contact Inquiry from ${name}`,
        html
    );

    return { message: 'Your message has been sent successfully. We will get back to you shortly!' };
};

export const ContactService = {
    handleContactInquiry,
};