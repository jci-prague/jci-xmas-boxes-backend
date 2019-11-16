#!/usr/local/bin/node

const csvtojson = require('csvtojson')
const fs = require('fs')
const uuid = require('uuid/v4')

const inputFilePaths = [
  'dobra_rodina_2019.csv',
  'dd_prestavlky_2019.csv',
  'barevny_svet_deti_2019.csv',
]

let familiesMap = {}

const csvConfig = {
  delimiter: ';',
}

const csvProcessor = csvtojson(csvConfig)
const filePromises = inputFilePaths.map(path => {
  console.log(path)
  return csvtojson(csvConfig).fromFile(path)
})

Promise.all(filePromises)
  .then(rawJsons => {
    rawJsons.map(rawJsonArray => {
      rawJsonArray.map(row => {
        const familyKey = row.family
        const kid = {
          name: row.name,
          age: parseInt(row.age),
          gender: getGender(row.sex),
          specifics: row.specifics,
        }
        if (!familiesMap[familyKey]) {
          const newFamily = {
            id: familyKey,
            free: true,
            children: [kid],
            gatheringPlaces: getPlaces(
              parseInt(row.place_1),
              parseInt(row.place_2),
            ),
          }
          familiesMap[familyKey] = newFamily
        } else {
          familiesMap[familyKey].children.push(kid)
        }
      })
      const familiesList = Object.values(familiesMap).map(
        family => {
          family.id = uuid()
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
  .catch(e => console.error)

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

function getPlaces(place1, place2) {
  if (place2 === 99) {
    return [place1]
  } else {
    return [place1, place2]
  }
}
