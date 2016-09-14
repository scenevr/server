const microdom = require('micro-dom');

// Returns a function that returns the globals. Eventually
// this would be changed to create sandboxed globals to prevent
// bad user code changing code between scenes.
module.exports = function createGlobals () {
  return {
    HTMLElement: microdom.HTMLElement,
    MutationObserver: require('micro-dom').MutationObserver
  };
};
