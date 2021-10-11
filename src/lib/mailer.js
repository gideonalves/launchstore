const nodemailer = require('nodemailer')


module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "abe4447a85e7a6",
      pass: "280582e01560f9"
    }
  });