const { syncConfig } = require('../config')
const { hasuraUtil, dbiometricosUtil, itsmoUtil } = require('../utils')

const CREATE = `
  mutation ($payload: record_tracking_insert_input!) {
    insert_record_tracking_one(object: $payload) {
      id
      created_at
      updated_at
    }
  }
`

const FIND = `
  query ($where: record_tracking_bool_exp) {
    record_tracking(where: $where) {
      id
      json_data
      hash_result
      created_at
      updated_at
      user_reference
      project_id
    }
  }
`

const UPDATE = `
  mutation ($where: record_tracking_bool_exp!, $set: record_tracking_set_input) {
    update_record_tracking(where: $where, _set: $set) {
      affected_rows
    }
  }
`

const create = async payload => {
  const data = await hasuraUtil.request(CREATE, { payload })

  return data
}

const find = async where => {
  const data = await hasuraUtil.request(FIND, { where })

  return data.record_tracking
}

const update = async (where, set) => {
  const data = await hasuraUtil.request(UPDATE, { where, set })

  return data.update_record_tracking
}

const sync = async () => {
  const pendingRecords = await itsmoUtil.getPendingRecords()
  console.log(`${pendingRecords.length} pending records`)

  for (let index = 0; index < pendingRecords.length; index++) {
    const { id, ...record } = pendingRecords[index]

    try {
      const {
        transaction_id: transactionId
      } = await dbiometricosUtil.registramsp(
        syncConfig.account,
        syncConfig.accountPassword,
        record
      )
      await create(
        { id: { _eq: record.id } },
        { ...record, hash_result: transactionId }
      )
      await itsmoUtil.setHash(id, transactionId)
      console.log(`record.id ${id} was processed`)
    } catch (error) {
      console.log(`error processing record.id ${record.id} `)
      console.error('record-tracking.service.sync', error)
    }
  }
}

module.exports = {
  create,
  find,
  update,
  sync
}
