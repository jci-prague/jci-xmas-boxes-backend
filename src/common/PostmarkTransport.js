const postmark = require('postmark')

const ConfigurationModule = require('./Configuration.js')

let postmarkClient

function PostmarkTransportModule(
  configuration = ConfigurationModule(),
) {

  if (!postmarkClient) {
    postmarkClient = new postmark.ServerClient(configuration.postmarkApiToken)
  }

  function sendMail(message) {
    // message.MessageStream = 'broadcast'
    message.MessageStream = 'outbound'
    // console.log('Sending email:', JSON.stringify(message, null, 2))
    return postmarkClient.sendEmail(message)
  }

  const api = {
    sendMail: sendMail,
  }

  return api
}

module.exports = PostmarkTransportModule
