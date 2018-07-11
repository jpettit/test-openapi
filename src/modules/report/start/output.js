'use strict'

const { stdout } = require('process')
const { createWriteStream } = require('fs')

const { TestOpenApiError, addErrorHandler } = require('../../../errors')

// Where to output report according to `config.report.output`
const getOutput = async function({ report: { output } }) {
  // When `config.report.output` is `undefined` (default), write to `stdout`
  if (output === undefined) {
    return stdout
  }

  // Otherwise write to a file
  const stream = await eGetFileStream({ output })
  return stream
}

const getFileStream = function({ output }) {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(output)
    stream.on('open', resolve.bind(null, stream))
    stream.on('error', reject)
  })
}

const getFileStreamHandler = function({ message }, { output }) {
  throw new TestOpenApiError(`Could not write output to file '${output}': ${message}`, {
    property: 'report.output',
    value: output,
  })
}

const eGetFileStream = addErrorHandler(getFileStream, getFileStreamHandler)

module.exports = {
  getOutput,
}
