const mix = require('laravel-mix');

mix
.options({ processCssUrls: false })
.disableNotifications()
.combine([ 'js/app.js' ], 'js/app.min.js' )
.sass( 'css/app.scss', 'css/app.min.css', { sassOptions: { outputStyle: 'compressed' }} );
