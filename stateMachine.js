/*global ig: true */
ig.module(
  'game.system.stateMachine'
)
.requires(
  'impact.impact'
)
.defines((function(global) {
  'use strict';

  var unnamedTransitionCounter = 0;

  global.StateMachine = function() {
    this.states = {};
    this.transitions = {};
    // Track states by name.
    this.initialState = null;
    this.currentState = null;
    this.previousState = null;

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
      // Transitions don't require names.
      if (!predicate) {
        predicate = toState;
        toState = fromState;
        fromState = name;
        name = 'transition-' + unnamedTransitionCounter;
        unnamedTransitionCounter += 1;
      }
      if (!this.states[fromState]) {
        throw new Error('Missing from state: ' + fromState);
      }
      if (!this.states[toState]) {
        throw new Error('Missing to state: ' + toState);
      }
      var transition = {
        name: name,
        fromState: fromState,
        toState: toState,
        predicate: predicate
      };
      this.transitions[name] = transition;
      return transition;
    };

    this.update = function() {
      if (!this.currentState) {
        this.currentState = this.initialState;
      }
      var state = this.state(this.currentState);
      if (this.previousState !== this.currentState) {
        if (state.enter) {
          state.enter();
        }
        this.previousState = this.currentState;
      }
      if (state.update) {
        state.update();
      }
      // Iterate through transitions.
      for (var name in this.transitions) {
        var transition = this.transitions[name];
        if (transition.fromState === this.currentState &&
            transition.predicate()) {
          if (state.exit) {
            state.exit();
          }
          this.currentState = transition.toState;
          return;
        }
      }
    };
  };

}).bind(this, this));
