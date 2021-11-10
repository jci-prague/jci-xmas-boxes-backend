const _ = require('lodash')
const fs = require('fs')

const ConfigurationModule = require('../common/Configuration.js')

function PlaceStore(configuration = ConfigurationModule()) {
  let places = []
  const pathToPlaceData = `${configuration.dataDirectoryPath}/place.json`

  function init() {
    return new Promise((resolve) => {
      const placeData = JSON.parse(
        fs.readFileSync(pathToPlaceData, 'utf8'),
      )
      places = _.cloneDeep(placeData)
      resolve()
    })
  }

  function listAvailable() {
    return _.cloneDeep(places).filter(
      (place) => place.available,
    )
  }

  function listAll() {
    return _.cloneDeep(places)
  }

  const api = {
    init,
    listAll,
    listAvailable,
  }

  return api
}

const placeStore = PlaceStore()

module.exports = () => placeStore
