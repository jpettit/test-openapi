'use strict'

// `types` decides whether to show errors, successes, skipped tasks
// `taskData` decided whether to include task.PLUGIN.*
//    - `added` means only the added props (i.e. not in `task.config.task.*`)
const LEVELS = require('./levels')

// Normalize `config.report.REPORTER.level`
// The reporting level should affect individual tasks reporting, not the summary
const normalizeLevel = function({ options, reporter }) {
  const levelA = options.level || reporter.level || DEFAULT_LEVEL
  const levelB = LEVELS[levelA]
  return levelB
}

const DEFAULT_LEVEL = 'info'

module.exports = {
  normalizeLevel,
}
