'use strict'

const apiResponse = require('../common/ApiResponse.js')

const FamilyServiceModule = require('./FamilyService.js')
const FamilyStoreModule = require('./FamilyStore.js')

function FamilyPublicEndpoint(
  FamilyService = FamilyServiceModule(),
  FamilyStore = FamilyStoreModule(),
) {
  const ENDPOINT = '/api/family'

  function register(app) {
    console.log('registering Family public end-point')
    app.get(ENDPOINT, _get)
    app.post(`${ENDPOINT}/gift`, _post)
    app.put(ENDPOINT, apiResponse.http405)
    app.delete(ENDPOINT, apiResponse.http405)
  }

  function _get(req, res) {
    apiResponse.http200(req, res, {
      families: FamilyStore.listFree(),
    })
  }

  function _post(req, res) {
    /*
    Payload:
    {
      id: '123456',
      contactName: 'John Doe',
      contactEmail: 'john@doe.com'
    }
    */

    const id = req.body.id
    const name = req.body.contactName
    const email = req.body.contactEmail
    const validationResult = validateReservationRequestParams(id, name, email)

    if (validationResult.success) {
      const reservationState = FamilyService.reserveGift(id, name, email)
      if (reservationState.success) {
        apiResponse.http200(req, res, reservationState)
      } else {
        apiResponse.http400(req, res, reservationState)
      }
    } else {
      apiResponse.http400(req, res, validationResult)
    }
  }

  function validateReservationRequestParams(id, name, email) {
    let result = {
      success: true,
      errors: []
    }

    if (!id) {
      result.errors.push({ code: 1000, message: 'Missing attribute \'id\'' })
      result.success = false
    }
    if (!name) {
      result.errors.push({ code: 1001, message: 'Missing attribute \'name\'' })
      result.success = false
    }
    if (!email) {
      result.errors.push({ code: 1002, message: 'Missing \'email\'' })
      result.success = false
    }

    return result
  }

  const api = {
    register: register,
  }

  return api
}

module.exports = FamilyPublicEndpoint
