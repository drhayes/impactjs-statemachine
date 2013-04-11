# impactjs-statemachine

[![Build Status](https://travis-ci.org/drhayes/impactjs-statemachine.png)](https://travis-ci.org/drhayes/impactjs-statemachine)

Provide a state machine implementation for use in ImpactJS games through one class, `StateMachine`.

## Overview

Sometimes you have to pull out the big guns.

If you have sections of your entity code that are tangles of if-then-else, you might need a state machine. State machines are great for:

  * **AI**. Enemies can get into an aggro state if the player attacks them but should "cool down" after five seconds.
  * **Animation**. The player entity should only play the `crouching` animation once, and then should show the `crouched` animation.

## Usage

Instantiate a state machine:

	var sm = new StateMachine();

Add states:

	sm.state('foo', {
		update: function() { console.log('foo'); }
	});

	sm.state('bar', {
		update: function() { console.log('bar'); }
	});

Call in update:

	sm.update();

### StateMachine

#### `state`

	state('stateName', {})
	state('stateName')

Two forms: first adds a new state by that name to the state machine. Second retrieves the state's definition for that name, if any.

The first state added will be the `initialState` when the state machine starts running.

##### State definition

	{
		enter: function() {},
		update: function() {},
		exit: function()
	}

All optional. `enter` called when state is transitioned to, `update` on every cycle of the state machine, `exit` before the state is transitioned out of.

All methods are called within the context of the state machine instance; any properties set on the state machine instance will be available as properties on `this` within the methods.

#### `transition`

	transition('transitionName', 'fromStateName', 'toStateName', function() {})
	transition('transitionName')

Define a transition between two states with the given name. Retrieve the named transition.

The transition method should return `true` if the transition should be taken. Transition checking will short-circuit if one transition returns true.

#### `update`

Call this every frame, possibly in an entity's `update` method.

If this is a new state, then the state's `enter` function will be called. The `update` method of the state will be called next. If any of the transitions' predicates return `true` then the current state's `exit` method will be called and the new state will be `enter`ed on the next call to `update`.

## License

Copyright (c) 2013 David Hayes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.