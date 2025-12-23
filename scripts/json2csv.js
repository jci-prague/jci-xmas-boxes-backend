#!/Users/tomm/.asdf/shims/node
const json2csv = require('json2csv')

const centerList = require('../__data__/center.json')
const familyList = require('../__data__/family.json')
const placeList = require('../__data__/place.json')

const centerDict = _centerListToDict(centerList)
const placeDict = _placeListToDict(placeList)

const data = []

familyList
  .filter((family) => {
    return family.free === false
  })
  .forEach((family) => {
    family.children
      .forEach((child) => {
        data.push({
          familyId: family.id,
          name: child.name,
          age: child.age,
          specifics: child.specifics,
          gender: child.gender,
          donor: family.contact?.name,
          email: family.contact?.email,
          transfer: _isTransferNecessary(family.centerId, family.chosenCenterId),
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
  'specifics',
  'gender',
  'donor',
  'email',
  'transfer',
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

function _isTransferNecessary(origincenterId, chosenCenterId) {
  if (origincenterId === chosenCenterId) {
    return 'NO'
  } else {
    return 'YES'
  }
}
