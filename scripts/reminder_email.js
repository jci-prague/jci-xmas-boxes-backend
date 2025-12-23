#!/Users/tomm/.asdf/shims/node

const PostmarkTransportModule = require('../src/common/PostmarkTransport.js')
const PostmarkTransport = PostmarkTransportModule()

const familiesSourceFile = '../20251205-1230_family.json'
const families = require(familiesSourceFile)

const EMAIL_BODY_GENERAL = `Dobrý den,

rádi bychom Vám připomněli, že v pátek 5.12. je poslední den sběrného týdne, a tedy poslední možnost přinést Vánoční krabici na Vámi vybrané sběrné místo. 🎁

Pokud jste dárek již předali, berte tento e-mail pouze jako informativní.

Otevírací hodiny jednotlivých sběrných míst a kontakty naleznete zde:

Rodinné centrum Letná, z.s. ‐ hlavní sběrné místo
Janovského 24, Praha 7
Otevřeno:
Pondělí, Středa a Pátek 09.00 - 12.00 hod.
Úterý, Čtvrtek a Pátek 17.00 - 19.00 hod.
Kontaktní osoba: Jitka Kováříková, +420 737 713 544, jytuska@centrum.cz

Temperi o.p.s.
Jar. Haška 1818/1, České Budějovice
Otevřeno:
Pondělí - Pátek 8.30 - 17.00 hod.
O konkrétním čase doručení dárků doporučujeme předem telefonicky informovat paní Hanu Francovou, která na Vás bude v centru čekat.
Kontaktní osoba: Hana Francová, +420 702 571 757, hana.francova@tempericb.cz

DOMUS, Centrum pro rodinu, z.s.
Černická 887/9, Plzeň
Otevřeno:
Pondělí 7.00 - 17.00 hod.
Úterý - Pátek 7.00 - 15.00 hod.
Zvonek DS Domusáček. V případě zájmu o jiný čas doručení dárku je nutné se předem domluvit s paní Martinou Hajnou. Kontaktní osoba: Martina Hajná, +420 730 890 760, martinahajna@domus-cpr.cz

Společnost pro ranou péči České Budějovice, z.s.
Čechova 164/1, České Budějovice
Otevřeno:
Pondělí - Čtvrtek 7.00 - 17.00 hod.
Pátek 7.00 - 13.00 hod.
O konkrétním čase doručení dárků doporučujeme předem telefonicky informovat paní Zuzanu Divišovou.
Kontaktní osoba: Zuzana Divišová, +420 734 781 833, zuzana.divisova@ranapece.cz

Společnost pro ranou péči Karlovy Vary, z.s.
Třeboňského 907/90, Karlovy Vary
Otevřeno:
Pondělí - Pátek 7.30 - 17.00 hod.
Kontaktní osoba: Kristýna Velecká, +420 734 308 720, kristyna.velecka@ranapece.cz


Váš tým Vánočních krabic`


const allEmails = families
  .filter(family => family.free === false)
  .map(family => family.contact.email)

const uniqueEmails = Array.from(new Set(allEmails))

uniqueEmails.forEach(_sendEmailToFamilyDonor)

function _sendEmailToFamilyDonor(email) {
  const message = {
    From: 'krabice@jcicr.cz',
    To: email,
    Subject: 'Vánoční Krabice - připomenutí posledního dne sběru krabic',
    TextBody: EMAIL_BODY_GENERAL
  }
  PostmarkTransport.sendMail(message)
  console.log('Email sent to:', email)
}
