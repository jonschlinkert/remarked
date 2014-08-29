/**
 * Merge `obj` into the given objects.
 *
 * @param {Object} `obj`
 * @return {Object}
 * @api public
 */

module.exports = function (obj) {
  var i = 1;
  var target;
  var key;
  var len = arguments.length;

  for (; i < len; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }
  return obj;
};