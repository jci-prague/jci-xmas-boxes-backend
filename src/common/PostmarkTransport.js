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
    message.MessageStream = 'outbound'
    return postmarkClient.sendEmail(message)
  }

  const api = {
    sendMail: sendMail,
  }

  return api
}

module.exports = PostmarkTransportModule
