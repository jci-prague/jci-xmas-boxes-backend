'use strict'

const apiResponse = require('../common/ApiResponse.js')

const CenterServiceModule = require('../keydata/CenterService.js')
const FamilyServiceModule = require('./FamilyService.js')
const FamilyStoreModule = require('./FamilyStore.js')
const PostmarkTransportModule = require('../common/PostmarkTransport.js')

function FamilyPublicEndpoint(
  CenterService = CenterServiceModule(),
  FamilyService = FamilyServiceModule(),
  FamilyStore = FamilyStoreModule(),
  PostmarkTransport = PostmarkTransportModule(),
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

    const familyCenterIds = req.body.familyCenterIds
    const name = req.body.donor.name
    const email = req.body.donor.email
    const validationResult =
      validateReservationRequestParams(
        familyCenterIds,
        name,
        email,
      )

    if (validationResult.success) {
      const reservationResults = FamilyService.reserveGift(
        familyCenterIds,
        name,
        email,
      )
      if (reservationResults.success) {
        const text = generateEmailText(
          familyCenterIds,
        )

        const message = {
          From: 'krabice@jcicr.cz',
          To: email,
          Cc: 'krabice@jcicr.cz',
          Subject: 'Vánoční Krabice - potvrzení registrace',
          TextBody: text,
        }
        PostmarkTransport.sendMail(message)
        apiResponse.http200(req, res, reservationResults)

      } else {
        apiResponse.http400(req, res, reservationResults)
      }
    } else {
      apiResponse.http400(req, res, validationResult)
    }
  }

  function validateReservationRequestParams(
    familyCenterIds,
    name,
    email,
  ) {
    let result = {
      success: true,
      errors: [],
    }

    if (!familyCenterIds) {
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

    return result
  }

  function generateEmailText(familyCenterIds) {
    return `Dobrý den,\nvelice nás těší Vaše rozhodnutí obdarovat následující dítě, děti či sourozence.\n${generateChildrenListForEmail(
      familyCenterIds,
    )}\nV případě jakýchkoliv dotazů nás neváhejte kontaktovat na e-mailové adrese: krabice@jcicr.cz\n\nDěkujeme! :-)\n\nTým "Vánoční krabice"`
  }

  function generateChildrenListForEmail(familyCenterIds) {
    const familyIds = familyCenterIds.map(familyCenterId => familyCenterId.familyId)
    const giftedFamilies = FamilyStore.listAll().filter(
      (family) => familyIds.includes(family.id),
    )

    const childrenText = giftedFamilies.reduce((acc, family) => {
      const children = family.children
        .map(
          (child) => {
            let text = ` - ${child.name}\n   - věk: ${child.age}\n   - zájmy: ${child.specifics}`
            if (child.url.length > 0) {
              text = text.concat(`\n   - odkaz: ${child.url}`)
            }
            return text
          }
        )
        .join('\n')

        const centerText = generatePlaceDetails(family.chosenCenterId)

      return `${acc}${children}\n${centerText}\n`
    }, '\nVybrané dítě, děti či sourozenci:\n')

    return childrenText
  }

  function generatePlaceDetails(centerId) {
    const center = CenterService.findById(centerId)
    return `   - Vámi zvolené místo doručení Vánoční krabice pro toto dítě nebo všechny sourozence:\n     - ${center.name}\n     - Adresa: ${center.address.street}, ${center.address.city}\n     - Otevírací doba: ${center.openHours}\n     - Dárky doneste během sběrného týdne 4.-8.12.2024\n     - Kontakt: ${center.contactPerson}\n`
  }

  const api = {
    register: register,
  }

  return api
}

module.exports = FamilyPublicEndpoint
