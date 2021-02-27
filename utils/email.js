const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.pseudo = user.pseudo;
    this.url = url;
    this.from = `TweekTabs <${process.env.EMAIL_ADDRESS}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: process.env.EMAIL_PORT,
      secure: true,
      requireTLS: true,
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    });
  }

  async send(template, subject) {
    // 1) render html based on a pug template
    const html = pug.renderFile(`${__dirname}/templates/${template}.pug`, {
      pseudo: this.pseudo,
      url: this.url,
      subject,
    });
    // 2) define emails options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Bienvenue sur TweekTabs!');
  }
  async sendPasswordReset() {
    await this.send('passwordReset', 'Demande de changement de mot de passe!');
  }
  async sendLogin() {
    await this.send('login', 'Connexion sur TweekTabs!');
  }
  async sendUpdatePassword() {
    await this.send('passwordUpdate', 'Mise à jour du mot de passe TweekTabs!');
  }
};
