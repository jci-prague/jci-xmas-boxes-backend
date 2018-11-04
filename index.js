'use strict'

const bodyParser = require('body-parser')
const express = require('express')

const Configuration = require('./src/common/Configuration.js')()
const familyStore = require('./src/family/FamilyStore.js')()

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const appPort = Configuration.applicationPort || 8888

const familyAdminEndpointModule = require('./src/family/FamilyAdminEndpoint.js')
const familyPublicEndpointModule = require('./src/family/FamilyPublicEndpoint.js')

familyStore.init()

const familyAdminEndpoint = familyAdminEndpointModule()
familyAdminEndpoint.register(app)

const familyPublicEndpoint = familyPublicEndpointModule()
familyPublicEndpoint.register(app)

app.listen(appPort, () => {})
console.log(`Application running at port ${appPort}`)
