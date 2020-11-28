'use strict'

const apiResponse = require('../common/ApiResponse.js')

const FamilyServiceModule = require('./FamilyService.js')
const FamilyStoreModule = require('./FamilyStore.js')
const MailTransportModule = require('../common/MailTransport.js')

function FamilyPublicEndpoint(
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
      familyIds: ['F001', 'F006'],
      donor: {
        name: 'John Doe',
        email: 'john@doe.com'
      }
    }
    */

    const familyIds = req.body.familyIds
    const name = req.body.donor.name
    const email = req.body.donor.email
    const validationResult = validateReservationRequestParams(
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
        const text = `Dobrý den,\nvelice nás těší Vaše rozhodnutí obdarovat následující děti či sourozence:\n${generateChildrenListForEmail(
          familyIds,
        )}\n\nDárky přineste na přidělené sběrné místo v týdnu od pondělí 7.12. do pátku 11.12. 2020. Otevírací hodiny:\n - České Budějovice: denně od 09:00h do 17:00h\n - Praha: úterý, středa, čtvrtek od 17:00h do 19:00h\n\nBudeme rádi, když nám dáte vědět, kam se chystáte dárek doručit (ČB/Praha).\n\nV případě jakýchkoliv dotazů nás neváhejte kontaktovat na e-mailové adrese: krabice@jcicr.cz\n\nDěkujeme! :-)\n\nTým "Vánoční krabice od bot"`

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

    return result
  }

  function generateChildrenListForEmail(familyIds) {
    const giftedFamilies = FamilyStore.listAll().filter(
      family => familyIds.includes(family.id),
    )

    return giftedFamilies.reduce((acc, family) => {
      const children = family.children
        .map(
          child =>
            ` - ${child.name}\n   - věk: ${child.age}\n   - zájmy: ${child.specifics}`,
        )
        .join('\n')
      return `${acc}${children}\n   => Sběrná místa: ${generateGatheringPlacesForEmail(
        family.gatheringPlaces,
      )}.\n`
    }, '\n=> Jedno vybrané dítě, či sourozenci:\n')
  }

  function generateGatheringPlacesForEmail(places) {
    return places.map(codeToPlaceName).join('; ')
  }

  function codeToPlaceName(code) {
    switch (code) {
      case 0:
        return 'Rodinné centrum Letná, o.s.: Janovského 24, Praha 7'
      case 1:
        return 'Dobrá rodina o.p.s.: Klimentská 1246/1, Praha 1'
      case 2:
        return 'Barevný svět dětí: Pod Nuselskými schody 1721/3, Praha 2'
      case 3:
        return 'Dětský domov v Přestavlkách'
      case 4:
        return 'Temperi o.p.s.: Jar. Haška 1818/1, České Budějovice'
      default:
        ''
    }
  }

  const api = {
    register: register,
  }

  return api
}

module.exports = FamilyPublicEndpoint
