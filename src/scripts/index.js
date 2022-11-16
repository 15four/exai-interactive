/**
 * The Exai Interactive Build System's Entrypoint.
 *
 * This file serves as a place to import all of the code that will eventually be bundled by Webpack to form the production-ready interactive.
 * Here, we can also specify configuration options since there aren't a lot of modules at play.
 */
import '../stylesheets/style.scss';

import { $on } from './utils';
import ExaiInteractive from './interactive';

/**
 * Interactive creation, configuration & initialization.
 *
 * Us the config object here to define things like the animation speeds, eases, etc. without editing code.
 * If you need the interactive to initialize on some event other than window load, you can change that here as well.
 */
const interactiveConfig = {
	rainbowImageStartingOpacity  : 0.35,
	shapeOriginCoordinatesSpread : 0.25
};

window.ExaiInteractive = new ExaiInteractive( interactiveConfig );
$on( window, 'load', window.ExaiInteractive.init.bind( window.ExaiInteractive ) );
