const Boom = require('@hapi/boom')
const { BAD_REQUEST } = require('http-status-codes')

module.exports = async req => {
  try {
    const { accountName } = req.params

    return { accountName, concentStatus: false }
  } catch (error) {
    console.error('get-concent.handler', error)
    return Boom.boomify(error, { statusCode: BAD_REQUEST })
  }
}
