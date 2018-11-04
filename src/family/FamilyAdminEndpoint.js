'use strict'

const apiResponse = require('../common/ApiResponse.js')

const FamilyStoreModule = require('./FamilyStore.js')

function FamilyAdminEndpoint(
  FamilyStore = FamilyStoreModule(),
) {
  const ENDPOINT = '/family'

  function register(app) {
    app.get(ENDPOINT, _get)
    app.post(ENDPOINT, _post)
    app.put(ENDPOINT, apiResponse.http405)
    app.delete(ENDPOINT, apiResponse.http405)
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

  const api = {
    register: register,
  }

  return api
}

module.exports = FamilyAdminEndpoint
