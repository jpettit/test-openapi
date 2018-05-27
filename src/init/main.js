'use strict'

const { addErrorHandler, addGenErrorHandler, topNormalizeHandler } = require('../errors')
const { loadConfig } = require('../config')
const { getTasks } = require('../tasks')

const { getPluginNames, getPlugins, runHandlers } = require('./plugins')
const { launchRunner } = require('./runner')
const { runTask } = require('./run')

// Main entry point
const run = async function(config = {}) {
  const configA = loadConfig({ config })

  const configB = await getTasks({ config: configA })

  const pluginNames = getPluginNames({ config: configB })

  await eRunPlugins({ config: configB, pluginNames })
}

const eRun = addErrorHandler(run, topNormalizeHandler)

const runPlugins = async function({ config, pluginNames }) {
  const plugins = getPlugins({ pluginNames })

  const configA = { ...config, runTask }

  const {
    handlers: { start: handlers },
  } = plugins
  const configB = await runHandlers(configA, handlers)

  await launchRunner({ config: configB, plugins })
}

const eRunPlugins = addGenErrorHandler(runPlugins, ({ pluginNames }) => ({ plugins: pluginNames }))

module.exports = {
  run: eRun,
}
