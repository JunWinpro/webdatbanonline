import transporter from "../configs/transporter.config.js";
import dotenv from 'dotenv'
dotenv.config()
const sendEmail = async (email, token, info) => {
    const url = info.path ? `http://${process.env.CLIENT_URL || 'localhost:3000'}/${info.path}/${token}` : null

    const text = info.action ? `Click on the following link to ${info.action}: ${url && url}` : info.textOption

    let mailOptions = {
        from: `Taste Tripper <${process.env.GMAIL_USERNAME}>`,
        to: email,
        subject: info.subject,
        text
    };

    await transporter.sendMail(mailOptions);
}

export default sendEmail