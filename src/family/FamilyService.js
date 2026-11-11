const _ = require('lodash')

const FamilyStoreModule = require('./FamilyStore.js')

function FamilyService(FamilyStore = FamilyStoreModule()) {
  function cancelFamilyReservation(family) {
    const reservedFamilies = listReserved()
    const familyToCancel = reservedFamilies.find(
      (f) => f.id === family.id,
    )

    if (familyToCancel) {
      familyToCancel.free = true
      delete familyToCancel.contact
      FamilyStore.update(familyToCancel)

      return {
        familyId: family.id,
        success: true,
        errors: [],
      }
    } else {
      return {
        familyId: family.id,
        success: false,
        errors: [
          {
            code: 1102,
            message: `Family (${family.id}) is not reserved, did you try to cancel the reservation twice?`,
          },
        ],
      }
    }
  }

  function listReserved() {
    return FamilyStore.listAll().filter(
      (family) => family.free === false,
    )
  }

  function reserveGift(
    familyCenterIds,
    name,
    email,
    phone,
    packageCode,
  ) {
    const freeFamilies = FamilyStore.listFree()
    const results = familyCenterIds.map((familyCenterId) => {
      return _reserveOneFamily(
        familyCenterId.chosenCenterId,
        freeFamilies,
        name,
        email,
        phone,
        familyCenterId.familyId,
        packageCode,
      )
    }
    )
    const allSuccess = results.reduce(
      (acc, curr) => acc && curr.success,
      true,
    )

    return {
      success: allSuccess,
      results: results,
    }
  }

  function _reserveOneFamily(
    chosenCenterId,
    freeFamilies,
    name,
    email,
    phone,
    familyId,
    packageCode,
  ) {
    let result = {
      familyId: familyId,
      success: true,
      errors: [],
    }
    const familyToReserve = _.find(
      freeFamilies,
      (f) => f.id === familyId,
    )

    if (!familyToReserve) {
      result.errors.push({
        code: 1101,
        message: `Family (${JSON.stringify(familyId)}) not available anymore, probably reserved in the mean time.`,
      })
      result.success = false
    } else {
      familyToReserve.chosenCenterId = chosenCenterId
      familyToReserve.contact = {
        name: name,
        email: email,
        phone: phone,
      }
      familyToReserve.free = false
      familyToReserve.packageCode = packageCode
      const storeResult =
        FamilyStore.update(familyToReserve)
      if (!storeResult) {
        result.success = false
        result.errors.push({
          code: 1000,
          message:
            'Error during your Gift reservation process, please, contact us to resolve.',
        })
      }
    }

    return result
  }

  const api = {
    cancelFamilyReservation,
    listReserved,
    reserveGift,
  }

  return api
}

module.exports = FamilyService
