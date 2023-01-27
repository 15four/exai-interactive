/**
 * The Exai Interactive Build System's Entrypoint.
 *
 * This file serves as a place to import all of the code that will eventually be bundled by Webpack to form the production-ready interactive.
 * Here, we can also specify configuration options since there aren't a lot of modules at play.
 *
 * @author Nick Patterson <nick@fifteen4.com>
 */

import '../stylesheets/style.scss';

import { $on } from './utils';

import ExaiSmoothScroll from './smooth-scroll';
import ExaiInteractive from './interactive';
import ExaiJobOpenings from './job-openings';


/**
 * Smooth scroll.
 */
const smoothScrollConfig = {
	smoothness : 0.75
};

window.ExaiSmoothScroll = new ExaiSmoothScroll( smoothScrollConfig );
$on( window, 'load', window.ExaiSmoothScroll.init.bind( window.ExaiSmoothScroll ) );

/**
 * Interactive.
 */
const interactiveConfig = {
	enabled : false
};

window.ExaiInteractive = new ExaiInteractive( interactiveConfig );
$on( window, 'smoothScrollSetup', window.ExaiInteractive.init.bind( window.ExaiInteractive ) );

/**
 * Job openings.
 */
const JobOpeningsConfig = {

};

window.ExaiJobOpenings = new ExaiJobOpenings( JobOpeningsConfig );
$on( window, 'load', window.ExaiJobOpenings.init.bind( window.ExaiJobOpenings ) );
