import nodemailer from "nodemailer";

const sendEmail = async (options) =>{
    // transport provide by mailtrap while using nodemailer
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "85de9a326f25b0",
          pass: "7f5295eed6572b"
        }
    });
    const mailOptions = {
        from : `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to : options.email,
        subject : options.subject,
        html : options.message
    }

    await transport.sendMail(mailOptions);
}

export default sendEmail;