//send confirmation email to the users
const nodemailer = require("nodemailer");

 const sendCode = async (code, email, myemail, mypass) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: myemail,
          pass: mypass
        }
      });

    const mailOptions = {
        from: 'bioscopeapporg@gmail.com',
        to: email,
        subject: 'Your confirmation code',
        text: `This is your BioScope account confirmation code. DO NOT SHARE IT WITH ANYONE!. Enter this code in your app or website and enjoy! Your code is ${code}`,
      };

    const result = await transporter.sendMail(mailOptions);
    return result;
  }

  const sendForgotPasswordMail = async (email, code, myemail, mypass) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: myemail,
        pass: mypass
      }
    });

  const mailOptions = {
      from: 'bioscopeapporg@gmail.com',
      to: email,
      subject: 'FORGOT PASSWORD CODE',
      text: `This is your forgot password code. DO NOT SHARE IT WITH ANYONE!. Enter this code in your app or website to change your password! Your code is ${code}`,
    };

  const result = await transporter.sendMail(mailOptions);
  return result;
  }

  
  module.exports = {
      sendCode,
      sendForgotPasswordMail
}
  