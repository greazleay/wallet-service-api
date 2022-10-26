import { createTransport, SendMailOptions, } from 'nodemailer';
import { ENV } from '@config/configuration';
import { logger } from '../logger';

const transporter = createTransport({
    host: ENV.EMAIL_HOST,
    port: ENV.EMAIL_PORT,
    secure: true,
    auth: {
        user: ENV.EMAIL_API_KEY,
        pass: ENV.EMAIL_API_KEY,
    }
});

export const sendMail = async (to: string, subject: string, text: string) => {

    const mailOptions: SendMailOptions = {
        from: '',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error(err)
        logger.info('Message Sent', info.messageId)
    })
}