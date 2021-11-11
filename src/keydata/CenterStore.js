const _ = require('lodash')
const fs = require('fs')

const ConfigurationModule = require('../common/Configuration.js')

function CenterStore(
  configuration = ConfigurationModule(),
) {
  let centers = []
  const pathToCenterData = `${configuration.dataDirectoryPath}/center.json`

  function init() {
    return new Promise((resolve) => {
      const centerData = JSON.parse(
        fs.readFileSync(pathToCenterData, 'utf8'),
      )
      centers = _.cloneDeep(centerData)
      resolve()
    })
  }

  function listAll() {
    return _.cloneDeep(centers)
  }

  const api = {
    init,
    listAll,
  }

  return api
}

const placeStore = CenterStore()

module.exports = () => placeStore
