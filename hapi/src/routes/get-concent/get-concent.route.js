const getConcentHandler = require('./get-concent.handler')

module.exports = {
  method: 'GET',
  path: '/get-concent/{accountName}',
  handler: getConcentHandler
}
