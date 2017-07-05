const path = require('path');

const ROOT = path.resolve(__dirname);

const root = (...args) => path.join(...[ROOT, ...args]);

module.exports = {
  root,
};
