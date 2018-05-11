'use strict'

const { isDeepStrictEqual } = require('util')

// Merge array values with a custom merge function and condition function
const mergeValues = function(array, merge = defaultMerge, condition = isDeepStrictEqual) {
  return array.map(mergeValue.bind(null, merge, condition)).filter(value => value !== undefined)
}

const mergeValue = function(merge, condition, valueA, index, array) {
  const nextSameValue = findSameValue(condition, array, valueA, index + 1)
  if (nextSameValue !== undefined) {
    return
  }

  const prevSameValue = findSameValue(condition, array, valueA, 0, index)
  if (prevSameValue !== undefined) {
    return merge(prevSameValue, valueA)
  }

  return valueA
}

const findSameValue = function(condition, array, valueA, start, length) {
  return array.slice(start, length).find(valueB => condition(valueA, valueB))
}

const defaultMerge = function(valueA, valueB) {
  return { ...valueA, ...valueB }
}

module.exports = {
  mergeValues,
}