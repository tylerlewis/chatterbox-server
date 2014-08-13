var messages = {};

messages.results = [{
  username: 'Argle',
  text: 'Bargle',
  roomname: 'Lobby',
  objectId: 0,
  createdAt: Date.now()
}];

messages.objectId = 1;

messages.get = function(callback) {
  callback = callback || function() {
    return messages.results;
  };
  return callback(messages.results);
};

messages.set = function(object, callback) {
  callback = callback || function(){
    return undefined;
  };
  object.createdAt = Date.now();
  object.objectId = messages.objectId++;
  if(messages.results.length >= 100) {
    messages.results.pop();
    messages.results.unshift(object);
  } else {
    messages.results.unshift(object);
  }
  callback();
};

module.exports = messages;
