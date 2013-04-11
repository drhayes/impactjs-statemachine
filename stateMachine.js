/*global ig: true */
ig.module(
  'game.system.stateMachine'
)
.requires(
  'impact.impact'
)
.defines((function(global) {
  'use strict';

  global.StateMachine = function() {
    this.states = {};
    this.transitions = {};
    this.initialState = null;

    this.state = function(name, definition) {
      if (!definition) {
        return this.states[name];
      }
      this.states[name] = definition;
      if (!this.initialState) {
        this.initialState = name;
      }
    };

    this.transition = function(name, fromState, toState, predicate) {
      if (!fromState && !toState && !predicate) {
        return this.transitions[name];
      }
      if (!this.states[fromState]) {
        throw new Error('Missing from state: ' + fromState);
      }
      if (!this.states[toState]) {
        throw new Error('Missing to state: ' + toState);
      }
      this.transitions[name] = {
        name: name,
        fromState: fromState,
        toState: toState,
        predicate: predicate
      };
    };
  };

}).bind(this, this));
