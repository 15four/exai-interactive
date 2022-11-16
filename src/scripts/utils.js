/**
 * querySelector wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
export function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

/**
 * querySelectorAll wrapper
 *
 * @param {string} selector Selector to query
 * @param {Element} [scope] Optional scope element for the selector
 */
export function qsa(selector, scope) {
  return [...(scope || document).querySelectorAll(selector)];
}

/**
 * addEventListener wrapper
 *
 * @param {Element|Window} target Target Element
 * @param {string} type Event name to bind to
 * @param {Function} callback Event callback
 * @param {boolean} [capture] Capture the event
 */
export function $on(target, type, callback, capture) {
  target.addEventListener(type, callback, !!capture);
}

/**
 * Attach a handler to an event for all elements matching a selector.
 *
 * @param {Element} target Element which the event must bubble to
 * @param {string} selector Selector to match
 * @param {string} type Event name
 * @param {Function} handler Function called when the event bubbles to target
 *                           from an element matching selector
 * @param {boolean} [capture] Capture the event
 */
export function $delegate(target, selector, type, handler, capture) {
  const dispatchEvent = event => {
    const targetElement = event.target;
    const potentialElements = target.querySelectorAll(selector);

    for (let i = potentialElements.length; i >= 0; i--) {
      if (potentialElements[i] === targetElement) {
        handler.call(targetElement, event);
        break;
      }
    }
  };

  $on(target, type, dispatchEvent, !!capture);
}

/**
 * Gets a random number within a range.
 *
 * Optionally, you can specify whether or not to make it negativ as well.
 */
export function randInRange( min, max = null, randomizeSign = false, places = 3 ) {

	if ( max === null ) {
		max = Math.abs( min );
		min = -max;
	}

	const rando = Math.random() * ( max - min ) + min;
	const power = Math.pow( 10, places );

	let number = Math.floor( rando * power ) / power;

	if ( randomizeSign ) {
		number = Math.random() - 0.5 > 0
			? number
			: -number;
	}

	return number
}

/**
 * Creates a new object by merging the properties of multiple objects together.
 */
export function mergeObj( ...objects ) {
	return Object.assign( {}, ...objects );
}

/**
 * Capitalizes the first letter of a string.
 */
export function upperCaseFirst( string = '' ) {
  return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}

/**
 * Normalizes a bounding rectangle.
 *
 * Adds center coordinates, half-dimensions, etc.
 * Makes sure its a plain JS object rather than a DOMRect.
 */
export function normalizeBoundingRect( boundingRect ) {

	const normalizedRect = boundingRect instanceof DOMRect ? boundingRect.toJSON() : boundingRect;

	normalizedRect.cx         = normalizedRect.x + normalizedRect.width / 2;
	normalizedRect.cy         = normalizedRect.y + normalizedRect.height / 2;
	normalizedRect.halfWidth  = normalizedRect.width / 2;
	normalizedRect.halfHeight = normalizedRect.height / 2;

	return normalizedRect;
}

/**
 * Gets an bounding rectangle's coordinates relative another's.
 */
export function transformBoundingRect( rect1, rect2 ) {

	const propsToTransform = ['x', 'y', 'top', 'right', 'bottom', 'left'];
	const transformedRect = {};

	for ( const prop of propsToTransform ) {
		transformedRect[prop] = rect2[prop] - rect1[prop];
	}

	return normalizeBoundingRect( Object.assign( {}, rect2, transformedRect ) );
}

/**
 * Finds the absolute time of a label in a Grensock timeline.
 * Originally for nested labels because Jack Doyle is a genius.
 * Modified to include the parent timeline as well.
 *
 * @link http://codepen.io/GreenSock/pen/2d5986159030829fd9016a57f028d4e5/
 */

export function getLabelTime( timeline, label ) {

	if ( label === 'start' ) {
		return 0;
	}
	if ( label === 'end' ) {
		return timeline.totalDuration();
	}

	let bloodline = timeline.getChildren( true, false, true );
	bloodline.push( timeline );

	let i = bloodline.length;
	let tl, time;

	while ( i-- ) {
		if ( label in bloodline[i].labels ) {
			tl = bloodline[i];
			time = tl.labels[label];
			break;
		}
	}

	if ( tl ) {
		while ( tl !== timeline ) {
			time = tl.startTime() + time / tl.timeScale();
			tl = tl.parent;
		}
	}
	return time;
}
