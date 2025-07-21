const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  //  Crate aA Transporter

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: "Cineflix support<support@cineflix.com",
    to: option.email,
    subject: option.subject,
    text: option.message,
    html: `<p>${option.message}</p>`,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
