const { itsmoConfig } = require('../config')
const axiosUtil = require('./axios.util')

const login = async () => {
  const { data } = await axiosUtil.instance.post(
    `${itsmoConfig.host}/rpc/login`,
    {
      email: itsmoConfig.user,
      pass: itsmoConfig.password
    }
  )

  return data.token
}

const getPendingRecords = async () => {
  try {
    const token = await login()
    const { data } = await axiosUtil.instance.get(
      `${itsmoConfig.host}/event_blocks`,
      {
        headers: {
          Authorization: `bearer ${token}`
        }
      }
    )

    return data
  } catch (error) {
    return []
  }
}

const setHash = async (id, hash) => {
  const token = await login()
  const { data } = await axiosUtil.instance.patch(
    `${itsmoConfig.host}/event_blocks?id=${id}`,
    {
      hash_result: hash
    },
    {
      headers: {
        Authorization: `bearer ${token}`
      }
    }
  )

  return data
}

module.exports = {
  login,
  getPendingRecords,
  setHash
}
