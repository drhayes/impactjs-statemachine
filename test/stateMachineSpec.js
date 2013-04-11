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
  var sm;

  beforeEach(function() {
    sm = new StateMachine();
  });

  it('lets you define states', function() {
    assert(!sm.states.catpants);
    sm.state('catpants', {
      update: function() {}
    });
    assert(sm.states.catpants);
  });

  it('retrieves states by name', function() {
    var definition = {
      update: function() {}
    };
    sm.state('catpants', definition);
    assert(sm.state('catpants') === definition);
  });

  it('sets first defined state as initialState', function() {
    assert(!sm.initialState);
    sm.state('catpants', {
      update: function() {}
    });
    sm.state('doggyhat', {
      update: function() {}
    });
    assert(sm.initialState === 'catpants');
  });
});