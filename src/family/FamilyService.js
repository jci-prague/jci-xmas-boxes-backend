'use strict'

const _ = require('lodash')

const FamilyStoreModule = require('./FamilyStore.js')

function FamilyService(
  FamilyStore = FamilyStoreModule(),
) {

  function reserveGift(familyIds, name, email) {
    const freeFamilies = FamilyStore.listFree()
    const results = familyIds.map(id => _reserveOneFamily(freeFamilies, name, email, id)) 
    const allSuccess = results.reduce((acc, curr) => acc && curr.success, true)

    return {
      success: allSuccess,
      results: results
    }
  }

  function _reserveOneFamily(freeFamilies, name, email, familyId) {
    let result = {
      familyId: familyId,
      success: true,
      errors: []
    }
    const familyToReserve = _.find(freeFamilies, f => f.id === familyId)

    if (!familyToReserve) {
      result.errors.push({ code: 1101, message: `Family (${id}) not available anymore, probably reserved in the mean time.` })
      result.success = false
    } else {
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
    }

    return result
  }

  const api = {
      reserveGift: reserveGift
  }

  return api
}

module.exports = FamilyService
