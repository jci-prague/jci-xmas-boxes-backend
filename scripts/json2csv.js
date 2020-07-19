#!/usr/local/bin/node
const json2csv = require('json2csv')

const familyList = require('./final-family.json')

const data = []

familyList.forEach(family => {
  family.children.forEach(child => {
    data.push({
      familyId: family.id,
      name: child.name,
      age: child.age,
      gender: child.gender,
      donor: family.contact.name,
      email: family.contact.email,
      place: codeToPlaceName(family.gatheringPlaces[0]),
    })
  })
})

const fields = [
  'familyId',
  'name',
  'age',
  'gender',
  'donor',
  'email',
  'place',
]

const opts = { fields }
const parser = new json2csv.Parser(opts)
const csv = parser.parse(data)

console.log(csv)

//{
//id: '25adaa83-3604-48a2-ab93-1a7215f0db41',
//free: false,
//children: [
//{
//name: 'Veronika',
//age: 8,
//gender: 'Female',
//specifics: 'Koníčky: tancování, zpěv, plavání. Sliz, panenky, kreslící potřeby, oblečení vel. L.'
//}
//],
//gatheringPlaces: [ 1, 0 ],
//contact: { name: 'Tereza Škavronková', email: 'Terka8888@seznam.cz' }
//}

function codeToPlaceName(code) {
  switch (code) {
    case 0:
      return 'Rodinné centrum Letná'
    case 1:
      return 'Dobrá rodina o.p.s.'
    case 2:
      return 'Barevný svět dětí'
    case 3:
      return 'Dětský domov v Přestavlkách'
    default:
      ''
  }
}
