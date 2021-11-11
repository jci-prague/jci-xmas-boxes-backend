const CenterStoreModule = require('./CenterStore.js')

function CenterService(CenterStore = CenterStoreModule()) {
  function listAvailable() {
    return CenterStore.listAll().filter(
      (center) => center.available,
    )
  }

  const api = {
    listAvailable,
  }

  return api
}

module.exports = CenterService
