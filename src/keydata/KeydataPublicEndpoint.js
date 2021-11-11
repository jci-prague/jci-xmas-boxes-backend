const apiResponse = require('../common/ApiResponse.js')

const CenterServiceModule = require('./CenterService.js')
const PlaceServiceModule = require('./PlaceService.js')

function KeydataPublicEndpoint(
  CenterService = CenterServiceModule(),
  PlaceService = PlaceServiceModule(),
) {
  const ENDPOINT = '/api/keydata'

  function register(app) {
    console.log('registering Keydata public end-point')
    app.get(ENDPOINT, _get)
  }

  function _get(req, res) {
    apiResponse.http200(req, res, {
      centers: CenterService.listAvailable(),
      places: PlaceService.listAvailable(),
    })
  }

  const api = {
    register: register,
  }

  return api
}

module.exports = KeydataPublicEndpoint
