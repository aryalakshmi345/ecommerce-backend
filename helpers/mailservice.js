const nodemailer = require('nodemailer')


const sendOtpVerificationEmail = async (email, otp) => {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_EMAIL_PASSWORD
        }
    });
    try {
        const mailOptions={
            from: process.env.SENDER_EMAIL, // sender address
            to: email, // recipient
            subject: 'OTP for Account Verification', // Subject line
            html: `<b>Your OTP code is ${otp}</b>` // html body
        }
        transporter.sendMail(mailOptions,function (err,info){
            if (err) console.log(err);
            else 
            console.log('Email sent successfully');

        })

    } catch (error) {
        console.log('Error sending email: ', error);
        throw error;
    }
};



module.exports = sendOtpVerificationEmail