const apiResponse = require('../common/ApiResponse.js')

const PlaceServiceModule = require('./PlaceService.js')

function KeydataPublicEndpoint(
  PlaceService = PlaceServiceModule(),
) {
  const ENDPOINT = '/api/keydata'

  function register(app) {
    console.log('registering Keydata public end-point')
    app.get(ENDPOINT, _get)
  }

  function _get(req, res) {
    apiResponse.http200(req, res, {
      places: PlaceService.listAvailable(),
    })
  }

  const api = {
    register: register,
  }

  return api
}

module.exports = KeydataPublicEndpoint
