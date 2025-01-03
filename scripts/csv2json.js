#!/usr/local/bin/node

const csvtojson = require('csvtojson')
const fs = require('fs')
const uuid = require('uuid')
const uuid4 = uuid.v4

// Year 2019
// const inputFilePaths = [
//   'dobra_rodina_2019.csv',
//   'dd_prestavlky_2019.csv',
//   'barevny_svet_deti_2019.csv',
// ]
//
// Year 2020
// const inputFilePaths = [
//   'barevny_svet_deti_2020.csv',
//   'temperi_2020.csv',
// ]

// Year 2021
// const inputFilePaths = [
//   'praha_rodinne_centrum_letna_2021.csv',
//   'praha_barevny_svet_deti_2021.csv',
//   'cb_temperi_2021.csv',
//   'plzen_domus_2021.csv',
// ]

// const inputFilePaths = [
//   '2023_dd_prestavlky.csv',
//   '2023_domus.csv',
//   '2023_rc_letna.csv',
//   '2023_temperi.csv',
// ]

const inputFilePaths = [
  '2024_dd_prestavlky.csv',
  '2024_domus.csv',
  '2024_rc_letna.csv',
  '2024_stredisko_pro_ranou_peci.csv',
  '2024_temperi.csv',
]

let familiesMap = {}

const csvConfig = {
  delimiter: ',',
}

const csvProcessor = csvtojson(csvConfig)
const filePromises = inputFilePaths.map((path) => {
  return csvtojson(csvConfig).fromFile(path)
})

Promise.all(filePromises)
  .then((rawJsons) => {
    rawJsons.map((rawJsonArray) => {
      rawJsonArray.map((row) => {
        const familyKey = row.family
        const kid = {
          name: row.name,
          age: parseInt(row.age),
          gender: getGender(row.sex),
          specifics: row.specifics,
          url: row.url,
        }
        if (!familiesMap[familyKey]) {
          const newFamily = {
            centerId: row.centerId,
            id: familyKey,
            free: true,
            children: [kid],
            placeId: row.placeId,
          }
          familiesMap[familyKey] = newFamily
        } else {
          familiesMap[familyKey].children.push(kid)
        }
      })
      const familiesList = Object.values(familiesMap).map(
        (family) => {
          family.id = uuid4()
          return family
        },
      )
      fs.writeFileSync(
        'output.json',
        JSON.stringify(familiesList),
        'utf8',
      )
    })
  })
  .catch((e) => console.error)

function getGender(sex) {
  switch (sex) {
    case 'f':
      return 'Female'
    case 'm':
      return 'Male'
    default:
      return 'Unknown'
  }
}
