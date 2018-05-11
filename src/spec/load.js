'use strict'

const { chdir, cwd } = require('process')
const { dirname, basename } = require('path')

const { validateOpenApi } = require('./validate')

// Parses an OpenAPI file (including JSON references)
// Then validates its syntax
const loadOpenApiSpec = async function({ path }) {
  const spec = await loadSpec({ path })

  validateOpenApi({ spec })

  return spec.definitionFullyResolved
}

const loadSpec = async function({ path }) {
  const dir = dirname(path)
  const spec = basename(path)

  // We need to change `process.cwd` for the JSON references to be resolved correctly
  const currentDir = cwd()
  chdir(dir)

  const specA = await parseSpec({ spec })

  chdir(currentDir)

  return specA
}

const parseSpec = function({ spec }) {
  try {
    const sway = getSway()
    const specA = sway.create({ definition: spec })
    return specA
  } catch ({ message }) {
    const messageA = `OpenAPI specification could not be loaded: ${message}`
    throw new Error(messageA)
  }
}

// This is needed until https://github.com/whitlockjc/json-refs/pull/133
// is merged.
// Sway's dependency `json-refs` caches files, so when this function gets called
// again, it might received old file contents.
// This is problematic for Gulp tasks running in watch mode.
const getSway = function() {
  Object.keys(require.cache)
    .filter(path => path.includes('/sway/') || path.includes('/json-refs/'))
    .forEach(path => delete require.cache[path])
  const sway = require('sway')
  return sway
}

module.exports = {
  loadOpenApiSpec,
}