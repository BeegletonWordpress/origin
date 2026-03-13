const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
	...defaultConfig,
	watchOptions: {
		...defaultConfig.watchOptions,
		ignored: [ '**/node_modules/**', path.resolve( __dirname, 'build' ) ],
	},
};
