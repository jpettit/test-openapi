'use strict'

const { checkSchema } = require('../validation')

// Validate plugin-specific configuration against a JSON schema specified in
// `plugin.config`
const verifyConfig = function({
  plugin: { config: { general: schema } = {}, name },
  config: { [name]: value },
}) {
  if (schema === undefined || value === undefined) {
    return
  }

  checkSchema({
    schema,
    value,
    name: `config.${name}`,
    message: `Configuration`,
    props: { module: `plugin-${name}` },
  })
}

// Validate plugin-specific task configuration against a JSON schema specified in
// `plugin.task`
const verifyTask = function({
  plugin: { config: { task: schema } = {}, name },
  task: { [name]: value },
}) {
  if (schema === undefined || value === undefined) {
    return
  }

  checkSchema({
    schema,
    value,
    name: `task.${name}`,
    message: `Task configuration`,
    props: { module: `plugin-${name}` },
  })
}

module.exports = {
  verifyConfig,
  verifyTask,
}
