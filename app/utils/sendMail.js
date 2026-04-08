const  transporter  = require("../config/emailConfig")
const otpModel=require('../models/otpModel')

const sendEmail=async(req, user)=>{
    // Generate a random 4-digit number
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Save OTP in Database
  const gg=await new otpModel({ userId: user._id, otp: otp }).save();
  console.log('otp',gg);
  

  //  OTP Verification Link
  //const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "OTP - Verify your account",
    text:"",
    html: `<!-- Main Card --> <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);"> <!-- Header --> <tr> <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff;"> <h1 style="margin:0; font-size:22px;">Verify Your Email</h1> </td> </tr> <!-- Body --> <tr> <td style="padding:30px;"> <p style="font-size:16px; color:#333;">Hi <strong>${user.name}</strong>,</p> <p style="font-size:14px; color:#555; line-height:1.6;"> Thanks for signing up! To complete your registration, please use the One-Time Password (OTP) below to verify your email address. </p> <!-- OTP Box --> <div style="text-align:center; margin:25px 0;"> <span style="display:inline-block; background:#4f46e5; color:#fff; padding:12px 24px; font-size:22px; letter-spacing:4px; border-radius:8px; font-weight:bold;"> ${otp} </span> </div> <p style="font-size:13px; color:#777; text-align:center;"> This OTP is valid for <strong>15 minutes</strong>. </p> <p style="font-size:13px; color:#777; line-height:1.6;"> If you didn’t request this, you can safely ignore this email. </p> </td> </tr> <!-- Footer --> <tr> <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#999;"> © ${new Date().getFullYear()} Your Company. All rights reserved. </td> </tr> </table> </td> </tr>`
  })

  return otp
}


module.exports=sendEmail