
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "jc9871274063@gmail.com",
    pass: "jnznpcycdksppcaq",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default transporter;
