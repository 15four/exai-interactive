/**
 * The Exai Bio Smooth Scroller.
 *
 * Enables smooth, single-threaded, transform-based scrolling on pages with the prerequisite elements.
 * Also normalizes viewport heights across devices.
 */

import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
gsap.registerPlugin( ScrollSmoother );

import { qs, $on, mergeObj } from './utils';

export default class ExaiSmoothScroller {

	/* ------------------------------------------------------ */
	/* Setup & Initialization ------------------------------- */
	/* ------------------------------------------------------ */

	/**
	 * Constructor.
	 *
	 * Creates the class and configures all of the configuration options.
	 * This helps us define things like the animation speeds, eases, etc. without editing code.
	 */
	constructor( config = {} ) {

		// User config

		const defaultConfig = {
			smoothness : 0.75,
		};

		this.config = mergeObj( defaultConfig, config );

		// Internal config

		this.blockClassName         = 'exai-smooth-scroll';
		this.viewportHeightProperty = 'bettervh';
	}

	/**
	 * Initializer.
	 *
	 * Queries up the immutable variables needed under the hood.
	 * Fires off functionality if and only if the needed elements exist on the DOM.
	 */
	init() {

		this.selector = `.${this.blockClassName}`;
		this.element  = qs( this.selector );

		if ( this.element ) {

			this.content = qs( `${this.selector}__content`, this.element );

			this.theSaviorScrollSmoother = ScrollSmoother.create( {
				wrapper            : this.element,
				content            : this.content,
				smooth             : this.config.smoothness,
				normalizeScroll    : true,
				ignoreMobileResize : true
			} );
		}

		this.normalizeViewportHeight();
		window.dispatchEvent( new Event( 'smoothScrollSetup' ) );

		$on( window, 'resize', this.normalizeViewportHeight.bind( this ) );
	}

	/**
	 * Sets the viewport height unit to be an actual fucking viewport height unit.
	 */
	normalizeViewportHeight() {
		const viewportHeight = Math.max( document.documentElement.clientHeight, window.innerHeight || 0 );
		document.documentElement.style.setProperty( `--${this.viewportHeightProperty}`, `${viewportHeight / 100}px` );
	}
}

