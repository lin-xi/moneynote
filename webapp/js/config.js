seajs.config({
	// 配置插件
	plugins: ['shim'],

	// 配置别名
	alias: {
		'jquery': {
			src: 'jquery/jquery-1.9.1.js',
			exports: 'jQuery'
		},

		datapicker: {
			src: 'bootstrap/datepicker.js',
			deps: ['jquery'],
			exports: 'datapicker'
		}
	},
		
	// 路径配置
	paths: {
		'jquery'    : '/js/open',
		'bootstrap' : '/js/bootstrap',
		'raphael'   : '/js/raphael'
	},

	charset: 'utf-8'
});