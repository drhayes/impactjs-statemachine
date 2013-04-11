/*global require: true, global: true, describe: true, beforeEach: true,
  it: true */
var assert = require('assert');

// Fake the Impact global namespace with good enough definitions.
var ig = global.ig = {
  // Impact module definition stuff.
  module: function() {
    return this;
  },
  requires: function() {
    return this;
  },
  defines: function(definition) {
    definition();
  }
};

// The module declares StateMachine globally.
var StateMachine = require('../stateMachine.js').StateMachine;

describe('StateMachine', function() {
});