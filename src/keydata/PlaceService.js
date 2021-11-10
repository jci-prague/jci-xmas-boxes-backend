'use strict'

const _ = require('lodash')

const PlaceStoreModule = require('./PlaceStore.js')

function PlaceService(PlaceStore = PlaceStoreModule()) {
  function listAvailable() {
    return PlaceStore.listAvailable()
  }

  const api = {
    listAvailable,
  }

  return api
}

module.exports = PlaceService
