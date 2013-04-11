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
  };

}).bind(this, this));
