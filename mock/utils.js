function asArray(obj) {
  return Object.keys(obj).map(function(k) { return obj[k] });
}

module.exports = {
  asArray: asArray
};