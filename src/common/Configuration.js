const dotenv = require('dotenv')

const confObject = _init()

function _init() {
  dotenv.config()

  return {
    applicationPort: process.env.PORT || process.env.APPLICATION_PORT,
    dataDirectoryPath: process.env.DATA_DIRECTORY_PATH,
    mailConfigurationPath: process.env.MAIL_CONFIGURATION_PATH,
    postmarkApiToken: process.env.POSTMARK_API_TOKEN
  }
}

function Configuration() {
  return Object.assign({}, confObject)
}

module.exports = Configuration
