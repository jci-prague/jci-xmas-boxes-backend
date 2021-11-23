const CenterStoreModule = require('./CenterStore.js')

function CenterService(CenterStore = CenterStoreModule()) {
  function findById(centerId) {
    return CenterStore.listAll().find(
      (center) => center.id === centerId,
    )
  }

  function listAvailable() {
    return CenterStore.listAll().filter(
      (center) => center.available,
    )
  }

  const api = {
    findById,
    listAvailable,
  }

  return api
}

module.exports = CenterService
