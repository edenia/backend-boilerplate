const getConsentHandler = require('./get-consent.handler')

module.exports = {
  method: 'GET',
  path: '/get-consent/{accountName}',
  handler: getConsentHandler
}
