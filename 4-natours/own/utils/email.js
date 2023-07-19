const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    //service: 'Gmail'
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less scure app" option
    // Gmail is not a good idea for a production server, it's limited to 500 mails per day
    // AND you'll be marked as a spammer
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Aldoru Gurdilek <hello@aldoru.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
