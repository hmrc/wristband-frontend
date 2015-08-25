function asArray(obj) {
  return Object.keys(obj).map(function(k) { return obj[k] });
}

function contains(arr, item) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === item) {
            return true;
        }
    }
    return false;
}

function id() {
  return Math.ceil(Math.random() * 1000000) + '';
}

function find(arr, propName, propValue) {
  for (var i=0; i < arr.length; i++) {
    if (arr[i][propName] == propValue) {
      return arr[i];
    }
  }
}

module.exports = {
  asArray: asArray,
  contains: contains,
  id: id,
  find: find
};