const dotenv = require('dotenv')

const confObject = _init()

function _init() {
  dotenv.config()

  return {
    applicationPort: process.env.PORT || process.env.APPLICATION_PORT,
    dataDirectoryPath: process.env.DATA_DIRECTORY_PATH,
    mailConfigurationPath: process.env.MAIL_CONFIGURATION_PATH,
  }
}

function Configuration() {
  return Object.assign({}, confObject)
}

module.exports = Configuration
