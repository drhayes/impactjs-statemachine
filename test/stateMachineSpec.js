/*global require: true, global: true, describe: true, beforeEach: true,
  it: true */
var assert = require('assert');
var sinon = require('sinon');

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

  it('does not require named transitions', function() {
    var counter = 0;
    for (var key in sm.transitions) {
      counter += 1;
    }
    assert(!counter);

    sm.state('catpants', {});
    sm.state('doggyhat', {});

    sm.transition('catpants', 'doggyhat', function() {});

    counter = 0;
    for (key in sm.transitions) {
      counter += 1;
    }
    assert(counter === 1);
    assert(!sm.transitions.catpants);
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

  describe('update', function() {
    var definition;

    beforeEach(function() {
      definition = {
        enter: sinon.spy(),
        update: sinon.spy(),
        exit: sinon.spy()
      };
      sm.state('catpants', definition);
    });

    it('calls initialState.enter only on first call to update', function() {
      sm.update();
      sm.update();
      assert(definition.enter.calledOnce);
      assert(definition.update.calledTwice);
    });

    it('does not call enter on state if it does not exist', function() {
      definition.enter = null;
      sm.update();
      assert(definition.update.called);
    });

    it('does not call update on state if it does not exist', function() {
      definition.update = null;
      sm.update();
      assert(definition.enter.called);
    });

    it('iterates through transitions, seeing if they should fire', function() {
      // Add another couple of states to play with.
      sm.state('doggyhat', {});
      sm.state('horsepoo', {});
      var predicate1 = sinon.stub().returns(false);
      var predicate2 = sinon.stub().returns(false);
      sm.transition('one', 'catpants', 'doggyhat', predicate1);
      sm.transition('two', 'catpants', 'horsepoo', predicate2);

      sm.update();
      sm.update();
      assert(predicate1.calledTwice);
      assert(predicate2.calledTwice);
    });

    it('only calls predicates when they match the fromState', function() {
      // Add a couple of states to play with.
      sm.state('doggyhat', {});
      sm.state('horsepoo', {});
      var predicate1 = sinon.stub().returns(false);
      var predicate2 = sinon.stub().returns(false);
      sm.transition('one', 'catpants', 'doggyhat', predicate1);
      sm.transition('two', 'doggyhat', 'horsepoo', predicate2);

      sm.update();
      assert(predicate1.calledOnce);
      assert(!predicate2.called);
    });

    it('transitions to new state if predicate returns true', function() {
      var definition2 = {
        enter: sinon.spy(),
        update: sinon.spy()
      };
      sm.state('doggyhat', definition2);
      var predicate1 = sinon.stub().returns(true);
      sm.transition('one', 'catpants', 'doggyhat', predicate1);

      sm.update();
      assert(definition.enter.called);
      assert(definition.update.called);
      assert(definition.exit.called);
      assert(!definition2.enter.called);

      sm.update();
      assert(sm.currentState === 'doggyhat');
      assert(definition2.enter.called);
      assert(definition2.update.called);
    });

    it('does not call exit on state if it does not exist', function() {
      sm.state('doggyhat', {});
      var predicate1 = sinon.stub().returns(true);
      sm.transition('one', 'catpants', 'doggyhat', predicate1);

      definition.exit = null;

      sm.update();
      assert(definition.enter.called);
      assert(definition.update.called);
    });

    it('early exits after finding one transition', function() {
      var definition2 = {
        enter: sinon.spy(),
        update: sinon.spy()
      };
      var definition3 = {
        enter: sinon.spy(),
        update: sinon.spy()
      };
      sm.state('doggyhat', definition2);
      sm.state('horsepoo', definition3);

      var predicate1 = sinon.stub().returns(true);
      var predicate2 = sinon.stub().returns(true);
      sm.transition('one', 'catpants', 'doggyhat', predicate1);
      sm.transition('two', 'catpants', 'horsepoo', predicate2);

      // This call should transition to doggyhat.
      sm.update();
      assert(sm.currentState === 'doggyhat');
    });

    it('does not double-transition', function() {
      // Brief bug where it would jump from state1->state2->state3 because
      // of how the transition logic worked. Related to early exit above.
      var definition2 = {
        enter: sinon.spy(),
        update: sinon.spy()
      };
      var definition3 = {
        enter: sinon.spy(),
        update: sinon.spy()
      };
      sm.state('doggyhat', definition2);
      sm.state('horsepoo', definition3);

      var predicate1 = sinon.stub().returns(true);
      var predicate2 = sinon.stub().returns(true);
      sm.transition('one', 'catpants', 'doggyhat', predicate1);
      sm.transition('two', 'doggyhat', 'horsepoo', predicate2);

      // This call should transition to doggyhat.
      sm.update();
      assert(sm.currentState === 'doggyhat');
    });
  });

  describe('end-to-end', function() {
    it('works for simple case', function() {
      var sm = new StateMachine();

      // Define attacking state.
      var counter = 0;
      var fleeing = false;
      sm.state('attacking', {
        enter: function() {
          counter = 42;
        },
        update: function() {
          counter += 1;
        },
        exit: function() {
          fleeing = true;
        }
      });

      // Define running state.
      var distance = 0;
      sm.state('running', {
        enter: function() {
          counter = 0;
        },
        update: function() {
          distance += 1;
        }
      });

      // Define transition.
      sm.transition('cowardice', 'attacking', 'running', function() {
        return counter > 44;
      });

      // Step-by-step verification.
      assert(counter === 0);
      assert(distance === 0);

      sm.update();
      assert(counter === 43);
      assert(!fleeing);

      sm.update();
      assert(counter === 44);
      assert(!fleeing);

      sm.update();
      assert(counter === 45);
      assert(fleeing);

      sm.update();
      assert(counter === 0);
      assert(distance === 1);
      assert(fleeing);
    });
  });
});