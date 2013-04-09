# impactjs-statemachine

Provide a state machine implementation for use in ImpactJS games through one class, `StateMachine`.

## Overview

Instantiate a state machine:

  `var sm = new StateMachine();`

Add states:

	`sm.state('foo', {
		update: function() { console.log('foo'); }
	});

	sm.state('bar', {
		update: function() { console.log('bar'); }
	});`

Call in update:

	`sm.update();`


## StateMachine

### `state`

	`state('stateName', {})`
	`state('stateName')`

Two forms: first adds a new state by that name to the state machine. Second retrieves the state's definition for that name, if any.

The first state added will be the `initialState` when the state machine starts running.

#### State definition

	{
		enter: function() {},
		update: function() {},
		exit: function()
	}

All optional. `enter` called when state is transitioned to, `update` on every cycle of the state machine, `exit` before the state is transitioned out of.

All methods are called within the context of the state machine instance; any properties set on the state machine instance will be available as properties on `this` within the methods.

### `transition`

	`transition('transitionName', 'fromStateName', 'toStateName', function() {})`
	`transition('transitionName')`

Define a transition between two states with the given name. Retrieve the named transition.

The transition method should return `true` if the transition should be taken. Transition checking will short-circuit if one transition  returns true.

### `update`

Called every frame.

If `currentState !== nextState` set `currentState` to `nextState` and call `enter` on new `currentState`.

Calls `check` on each transition mapped for current state; if any transition returns true, set `nextState` to `toState` from transition map. Call `exit` on `currentState`. Set `currentState` to null.

If `currentState` is not null, call `update` on it.
