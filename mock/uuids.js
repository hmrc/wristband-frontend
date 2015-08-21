module.exports = {
  ids: [],
  push: function (id) {
    this.ids.push(id);
  },
  contains: function (id) {
    var i = this.ids.length;
    while (i--) {
        if (this.ids[i] === id) {
            return true;
        }
    }
    return false;
  },
  new: function () {
    return Math.ceil(Math.random() * 1000000) + '';
  }
};