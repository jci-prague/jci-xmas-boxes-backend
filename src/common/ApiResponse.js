'use strict'

function http200(req, res, payload) {
  res
    .type('application/json')
    .status(200)
    .send(payload)
}

function http400(req, res, payload) {
  res
    .type('application/json')
    .status(400)
    .send(payload)
}

function http405(req, res) {
  res
    .type('application/json')
    .sendStatus(405)
    .send()
}

function http500(req, res) {
  res
    .type('application/json')
    .sendStatus(500)
    .send()
}

module.exports = {
  http200: http200,
  http400: http400,
  http405: http405,
  http500: http500,
}
