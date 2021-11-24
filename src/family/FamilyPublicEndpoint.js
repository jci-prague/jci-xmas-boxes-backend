'use strict'

const apiResponse = require('../common/ApiResponse.js')

const CenterServiceModule = require('../keydata/CenterService.js')
const FamilyServiceModule = require('./FamilyService.js')
const FamilyStoreModule = require('./FamilyStore.js')
const MailTransportModule = require('../common/MailTransport.js')

function FamilyPublicEndpoint(
  CenterService = CenterServiceModule(),
  FamilyService = FamilyServiceModule(),
  FamilyStore = FamilyStoreModule(),
  MailTransport = MailTransportModule(),
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
      centerId: "c0001",
      familyIds: ['F001', 'F006'],
      donor: {
        name: 'John Doe',
        email: 'john@doe.com'
      }
    }
    */

    const centerId = req.body.centerId
    const familyIds = req.body.familyIds
    const name = req.body.donor.name
    const email = req.body.donor.email
    const validationResult =
      validateReservationRequestParams(
        centerId,
        familyIds,
        name,
        email,
      )

    if (validationResult.success) {
      const reservationResults = FamilyService.reserveGift(
        familyIds,
        name,
        email,
      )
      if (reservationResults.success) {
        const text = generateEmailText(centerId, familyIds)
        console.log(text)

        const message = {
          from: 'krabice@jcicr.cz',
          to: email,
          cc: 'krabice@jcicr.cz',
          subject: 'Vánoční Krabice - potvrzení registrace',
          text: text,
        }
        MailTransport.sendMail(message).then(() => {
          apiResponse.http200(req, res, reservationResults)
        })
      } else {
        apiResponse.http400(req, res, reservationResults)
      }
    } else {
      apiResponse.http400(req, res, validationResult)
    }
  }

  function validateReservationRequestParams(
    centerId,
    familyIds,
    name,
    email,
  ) {
    let result = {
      success: true,
      errors: [],
    }

    if (!familyIds) {
      result.errors.push({
        code: 1000,
        message: "Missing attribute 'familyIds'",
      })
      result.success = false
    }
    if (!name) {
      result.errors.push({
        code: 1001,
        message: "Missing attribute 'name'",
      })
      result.success = false
    }
    if (!email) {
      result.errors.push({
        code: 1002,
        message: "Missing 'email'",
      })
      result.success = false
    }

    if (!centerId) {
      result.errors.push({
        code: 1003,
        message: "Missing attribute 'centerId'",
      })
      result.success = false
    }

    return result
  }

  function generateEmailText(centerId, familyIds) {
    return `Dobrý den,\nvelice nás těší Vaše rozhodnutí obdarovat následující děti či sourozence:\n${generateChildrenListForEmail(
      familyIds,
    )}\n${generatePlaceDetails(
      centerId,
    )}\nV případě jakýchkoliv dotazů nás neváhejte kontaktovat na e-mailové adrese: krabice@jcicr.cz\n\nDěkujeme! :-)\n\nTým "Vánoční krabice"`
  }

  function generateChildrenListForEmail(familyIds) {
    const giftedFamilies = FamilyStore.listAll().filter(
      (family) => familyIds.includes(family.id),
    )

    return giftedFamilies.reduce((acc, family) => {
      const children = family.children
        .map(
          (child) =>
            ` - ${child.name}\n   - věk: ${child.age}\n   - zájmy: ${child.specifics}`,
        )
        .join('\n')
      return `${acc}${children}\n`
    }, '\n=> Jedno vybrané dítě, či sourozenci:\n')
  }

  function generatePlaceDetails(centerId) {
    const center = CenterService.findById(centerId)
    return `Vámi zvolené místo doručení Vánoční krabice:\n\n${center.name}\nAdresa: ${center.address.street}, ${center.address.city}\nKontakt: ${center.contactPerson}\n`
  }

  const api = {
    register: register,
  }

  return api
}

module.exports = FamilyPublicEndpoint
