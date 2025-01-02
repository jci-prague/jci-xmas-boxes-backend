#!/usr/local/bin/node

const PostmarkTransportModule = require('../src/common/PostmarkTransport.js')
const PostmarkTransport = PostmarkTransportModule()

const familiesSourceFile = '../__data__/test_2024.json'
const families = require(familiesSourceFile)

const EMAIL_BODY_GENERAL = `Vážené a milé dárkyně, vážení a milí dárci,

za celý tým Vánočních krabic a všechny spolupracující organizace bychom Vám chtěli moc poděkovat, že jste se zúčastnili již 8. ročníku Vánočních krabic a udělali tak radost všem dětem, které by pod stromečkem letos nic nenašly. Bez Vás by to nešlo!

A současně bychom Vám rádi popřáli do nového roku především hodně zdraví, mnoho osobních úspěchů a klidný čas strávený s Vašimi nejbližšími.

Začátkem roku se Vám přihlásíme s fotografiemi z letošního předávání dárečků.

Děkujeme za Vaši důvěru,
Váš tým Vánočních krabic`

// TODO: filter duplicate email, when ppl register multiple times
families
  .filter(_filterByCenter)
  .forEach(_sendEmailToFamilyDonor)

function _sendEmailToFamilyDonor(family) {
  const email = family.contact.email
  const message = {
    From: 'krabice@jcicr.cz',
    To: email,
    Cc: 'krabice@jcicr.cz',
    Subject: 'Vánoční Krabice - poděkování',
    TextBody: EMAIL_BODY_GENERAL,
  }
  PostmarkTransport.sendMail(message)
  console.log('Email sent to: ', email)
}

function _filterByCenter(family) {
  // const keep = family.chosenCenterId === 'c0004' // is DOMUS
  const keep = family.chosenCenterId !== 'c0004' // not DOMUS
  // console.log(`Center: ${family.chosenCenterId}, email: ${family.contact.email}, keep: ${keep}`)
  return keep
}
