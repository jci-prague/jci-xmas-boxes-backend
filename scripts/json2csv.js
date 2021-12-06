#!/usr/local/bin/node
const json2csv = require('json2csv')

const centerList = require('../__data__/center.json')
const familyList = require('./family_final_2021.json')
const placeList = require('../__data__/place.json')

const centerDict = _centerListToDict(centerList)
const placeDict = _placeListToDict(placeList)

const data = []

familyList.forEach((family) => {
  family.children.forEach((child) => {
    data.push({
      familyId: family.id,
      name: child.name,
      age: child.age,
      gender: child.gender,
      donor: family.contact.name,
      email: family.contact.email,
      chosenOriginCenter:
        centerDict[family.chosenCenterId]?.name ||
        'MISSING',
      originCenter: centerDict[family.centerId].name,
      originPlace: placeDict[family.placeId].name,
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
  'chosenOriginCenter',
  'originCenter',
  'originPlace',
]

const opts = { fields }
const parser = new json2csv.Parser(opts)
const csv = parser.parse(data)

console.log(csv)

//{
//id: '25adaa83-3604-48a2-ab93-1a7215f0db41',
//centerId: 'c0002',
//free: false,
//chosenCenterId: 'c0003' -- !! might be missing !!
//children: [
//{
//name: 'Veronika',
//age: 8,
//gender: 'Female',
//specifics: 'Koníčky: tancování, zpěv, plavání. Sliz, panenky, kreslící potřeby, oblečení vel. L.'
//}
//],
//placeId: 'p0001',
//contact: { name: 'Tereza Škavronková', email: 'Terka8888@seznam.cz' }
//}

function _centerListToDict(centerList) {
  return centerList.reduce((acc, center) => {
    const centerId = center.id
    acc[centerId] = center
    return acc
  }, {})
}

function _placeListToDict(placeList) {
  return placeList.reduce((acc, place) => {
    const placeId = place.id
    acc[placeId] = place
    return acc
  }, {})
}
