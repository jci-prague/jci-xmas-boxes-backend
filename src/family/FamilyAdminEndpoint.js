const apiResponse = require('../common/ApiResponse.js')

const FamilyServiceModule = require('./FamilyService.js')
const FamilyStoreModule = require('./FamilyStore.js')

function FamilyAdminEndpoint(
  FamilyService = FamilyServiceModule(),
  FamilyStore = FamilyStoreModule(),
) {
  const ENDPOINT = '/admin/api/family'

  function register(app) {
    console.log('registering Family admin end-point')
    app.get(ENDPOINT, _get)
    app.post(ENDPOINT, _post)
    app.put(ENDPOINT, apiResponse.http405)
    app.delete(ENDPOINT, apiResponse.http405)

    app.get(`${ENDPOINT}/reserved`, _getReserved)
    app.post(
      `${ENDPOINT}/reserved`,
      _postCancelFamilyReservation,
    )
  }

  function _get(req, res) {
    apiResponse.http200(req, res, {
      families: FamilyStore.listAll(),
    })
  }

  function _post(req, res) {
    const familyUpdate = req.body
    if (!familyUpdate) {
      apiResponse.http400(req, res)
      return
    }

    if (FamilyStore.update(familyUpdate)) {
      apiResponse.http200(req, res, { message: 'success' })
    } else {
      apiResponse.http500(req, res)
    }
  }

  function _getReserved(req, res) {
    apiResponse.http200(req, res, {
      families: FamilyService.listReserved(),
    })
  }

  function _postCancelFamilyReservation(req, res) {
    const familyUpdate = req.body
    if (!familyUpdate) {
      apiResponse.http400(req, res)
      return
    }
    const result = FamilyService.cancelFamilyReservation(
      familyUpdate.id,
    )
    if (result.success) {
      apiResponse.http200(req, res, { message: 'success' })
    } else {
      apiResponse.http500(req, res, result)
    }
  }

  const api = {
    register: register,
  }

  return api
}

module.exports = FamilyAdminEndpoint
