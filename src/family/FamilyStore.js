'use strict'

const _ = require('lodash')
const fs = require('fs')

const ConfigurationModule = require('../common/Configuration.js')

function FamilyStore(
  configuration = ConfigurationModule(),
) {
  let families = []
  const pathToFamilyData = `${
    configuration.dataDirectoryPath
  }/family.json`

  function init() {
    return new Promise(resolve => {
      const familyData = JSON.parse(
        fs.readFileSync(pathToFamilyData, 'utf8'),
      )
      families = _.cloneDeep(familyData)
      resolve()
    })
  }

  function listFree() {
    return _.cloneDeep(families)
      .filter(family => family.free)
      .map(family => {
        return {
          id: family.id,
          free: family.free,
          children: family.children,
        }
      })
  }

  function listAll() {
    return _.cloneDeep(families)
  }

  function update(family) {
    const familyToUpdate = _.find(
      families,
      f => family.id == f.id,
    )
    if (!familyToUpdate) {
      console.error('No family to update found', family)
      return false
    }
    familyToUpdate.free = false
    familyToUpdate.contact = family.contact
    const fileContent = JSON.stringify(families)
    fs.writeFileSync(pathToFamilyData, fileContent)

    return true
  }

  const api = {
    init: init,
    listAll: listAll,
    listFree: listFree,
    update: update,
  }

  return api
}

const familyStore = FamilyStore()

module.exports = () => familyStore
