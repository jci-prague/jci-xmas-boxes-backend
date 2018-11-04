'use strict'

const _ = require('lodash')

const FamilyStoreModule = require('./FamilyStore.js')

function FamilyService(
  FamilyStore = FamilyStoreModule(),
) {

  function reserveGift(id, name, email) {
    let result = {
      success: true,
      errors: []
    }
    const freeFamilies = FamilyStore.listFree()
    const familyToReserve = _.find(freeFamilies, f => f.id === id)

    if (!familyToReserve) {
      result.errors.push({ code: 1101, message: 'Family not available anymore, probably reserved in the mean time.' })
      result.success = false
      return result
    }

    familyToReserve.contact = {
      name: name,
      email: email
    }
    familyToReserve.free = false
    const storeResult = FamilyStore.update(familyToReserve)
    if (!storeResult) {
      result.success = false
      result.errors.push({ code: 1000, message: 'Error during your Gift reservation process, please, contact us to resolve.' })
    }

    return result
  }

  const api = {
      reserveGift: reserveGift
  }

  return api
}

module.exports = FamilyService
