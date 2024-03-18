const mix = require('laravel-mix');

mix
.options({ processCssUrls: false })
.disableNotifications()
.combine([
	'js/functions.js',
	'js/character-sheet.js',
	'js/character-editor.js',
	'js/trait-set-editor.js',
	'js/trait-editor.js',
	'js/sfx-editor.js',
	'js/app.js'
], 'js/app.min.js' )
.sass( 'css/app.scss', 'css/app.min.css', { sassOptions: { outputStyle: 'compressed' }} );
