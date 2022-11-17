/**
 * The Exai Bio Job Openings.
 * 
 * Retrieves open job postings from Exai's Workable account.
 * Iterates through them and creates an individual listing of each, based on a pre-configured example element.
 */
import axios from 'axios';
import axiosJsonpAdaptor from 'axios-jsonp';

import { qs, mergeObj } from './utils';

export default class ExaiJobOpenings {

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
			workableAccountName : 'exai-bio',
			defaultLimit        : 10,
		};

		this.config = mergeObj( defaultConfig, config );

		// Internal config

		this.blockClassName = 'exai-job-openings';

		this.endpoint      = 'https://www.workable.com/api/accounts/';
		this.limitDataAttr = 'limit';
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

			this.openings          = [];
			this.openingsToDisplay = this.element.dataset[this.limitDataAttr] || this.config.defaultLimit;

			this.exampleOpeningItemClassName = `${this.blockClassName}__list-item--example`;
			this.exampleOpeningItem          = qs( `.${this.exampleOpeningItemClassName}`, this.element );

			this.list           = qs( `${this.selector}__list`, this.element );
			this.loadingMessage = qs( `${this.selector}__loading`, this.element );
			this.emptyMessage   = qs( `${this.selector}__empty`, this.element );
			this.errorMessage   = qs( `${this.selector}__loading`, this.element );

			axios( { url: `${this.endpoint}${this.config.workableAccountName}`, adapter: axiosJsonpAdaptor } )
				.then( ( payload ) => this.handleSuccess( payload ) )
				.then( ( error ) => this.handleError( error ) )
				.finally( () => this.removeLoadingState() )
		}
	}

	/* ------------------------------------------------------ */
	/* Handling API Responses ------------------------------- */
	/* ------------------------------------------------------ */

	/**
	 * Parses a response from workable and converts the public jobs into HTML elements.
	 */
	handleSuccess( payload ) {

		this.openings = payload.data.jobs;

		if ( this.openings.length ) {

			for ( const opening of this.openings.slice( 0, this.openingsToDisplay ) ) {

				const openingItem    = this.exampleOpeningItem.cloneNode( true );
				const openingElement = qs( `${this.selector}__opening`, openingItem );
				const title          = qs( `${this.selector}__opening-title`, openingItem );

				openingItem.classList.remove( this.exampleOpeningItemClassName );
				openingElement.setAttribute( 'href', opening.url );
				title.innerHTML = opening.title;

				this.list.appendChild( openingItem );
			}

			this.list.style.display = 'block';
		}
		else {
			this.emptyMessage.style.display = 'block';
		}
	}

	/**
	 * Handles an error from the Workable API.
	 * Renders the error state.
	 */
	handleError( error ) {
		this.errorMessage.style.display = 'block';
	}

	/**
	 * Removes the loading state.
	 * Happens after any success or loading states are rendered.
	 */
	removeLoadingState() {
		this.loadingMessage.style.display = 'none';
	}

}

