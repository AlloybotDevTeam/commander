module.exports = function(module, callback) {
  alloybot.get('modules').set(module.name, {
    commands: new Map(),
    metadata: new Map()
  });

  callback(1);
};
const path = require('path');

_loader(path.join(__dirname, 'commands'));
