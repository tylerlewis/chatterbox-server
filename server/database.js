var messages = {};

messages.results = [];

messages.get = function(callback) {
  callback = callback || function() {
    console.log(this.results + " database");
    return this.results;
  };
  return callback(this.results);
};

messages.set = function(object, callback) {
  if(this.results.length >= 100) {
    this.results.pop();
    this.results.unshift(object);
  } else {
    this.results.unshift(object);
  }
  callback();
};

module.exports = messages;
