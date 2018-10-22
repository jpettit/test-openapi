'use strict'

const { env } = require('process')

const { parseFlat } = require('../../../utils')

// `$$env.envVarName` template function
// Replaced by `process.env.envVarName`
const getEnv = function() {
  // We use a proxy (instead of a reference to `process.env` to add some logic:
  //  - case-insensitive names
  //  - value parsing
  // eslint-disable-next-line fp/no-proxy
  return new Proxy({}, { get: getEnvVar })
}

const getEnvVar = function(proxy, envVarName) {
  const envVar = findEnvVar({ envVarName })

  if (envVar === undefined) {
    return
  }

  // Allow environment variables to be integers, booleans, etc.
  const envVarA = parseFlat(envVar)
  return envVarA
}

const findEnvVar = function({ envVarName }) {
  if (env[envVarName] !== undefined) {
    return env[envVarName]
  }

  // Try to match environment variable name case-insensitively
  const envVar = Object.entries(env).find(
    ([key]) => envVarName.startsWith(key.toLowerCase()),
  )

  if (envVar === undefined) {
    return
  }

  return envVar[1]
}

const envTemplate = getEnv()

module.exports = {
  $$env: envTemplate,
}
