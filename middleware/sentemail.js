const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port:465,
        secure: true,
        auth: {
            user: process.env.SENTEMAIL,
            pass: process.env.SENTEMAILPASS
        }
    });

    var mailOptions = {


        from: `${process.env.SENTEMAIL}`,
        to: options.email,
        subject: options.subject,
       
        html: options.htmls
    };


    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail