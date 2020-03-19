
import * as nodemailer from 'nodemailer';
import EmailConfig from '../config/type/EmailConfig'
export default class Email {

  private readonly transporter: any;

  constructor(options: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure, // true for 465, false for other ports
      auth: options.auth
    });
  }
  async sendMail({ from, subject, to, html }) {
    let info = await this.transporter.sendMail({
      from, // sender address
      to, // list of receivers
      subject, // Subject line
      // text: "Hello world?", // plain text body
      html // html body
    });
    return /ok/i.test(info.response);
  }
}
