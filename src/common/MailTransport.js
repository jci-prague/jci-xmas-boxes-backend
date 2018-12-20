const nodemailerModule = require('nodemailer')

const ConfigurationModule = require('./Configuration.js')

let smtpTransport

function MailTransport(
  configuration = ConfigurationModule(),
  nodemailer = nodemailerModule,
) {
  if (!smtpTransport) {
    const mailConfiguration = require(`${__dirname}/../../${
      configuration.mailConfigurationPath
    }`)
    if (!mailConfiguration) {
      console.error(
        `Unable to use mail configuration file: ${
          configuration.MAIL_CONFIGURATION_PATH
        }`,
      )
      process.exit(1)
    }

    smtpTransport = nodemailer.createTransport(
      mailConfiguration,
    )
    smtpTransport
      .verify()
      .catch(err => {
        console.error('SMTP connection fails', err)
        process.exit(1)
      })
  }

  function sendMail(message) {
    return smtpTransport.sendMail(message)
  }

  const api = {
    sendMail: sendMail,
  }

  return api
}

module.exports = MailTransport
