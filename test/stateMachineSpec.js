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

  it('lets you define transitions', function() {
    assert(!sm.transitions.catpants);
    // Must define states before defining transition.
    sm.state('doggyhat', {});
    sm.state('horsepoo', {});
    sm.transition('catpants', 'doggyhat', 'horsepoo', function() {});
    assert(sm.transitions.catpants);
  });

  it('retrieves transitions by name', function() {
    // Must define states before defining transition.
    sm.state('fromState', {});
    sm.state('toState', {});
    var predicate = function() {};
    sm.transition('catpants', 'fromState', 'toState', predicate);
    var transition = sm.transition('catpants');
    assert(transition);
    assert(transition.fromState === 'fromState');
    assert(transition.toState === 'toState');
    assert(transition.predicate === predicate);
  });

  it('verifies states exist before creating transition', function() {
    assert(!sm.states.fromState);
    assert(!sm.states.toState);
    assert.throws(function() {
      sm.transition('catpants', 'fromState', 'toState', function() {});
    }, /fromState/);

    // Define fromState.
    sm.state('fromState', {});
    assert.throws(function() {
      sm.transition('catpants', 'fromState', 'toState', function() {});
    }, /toState/);

    // Define toState.
    sm.state('toState', {});
    assert.doesNotThrow(function() {
      sm.transition('catpants', 'fromState', 'toState', function() {});
    });

  });
});