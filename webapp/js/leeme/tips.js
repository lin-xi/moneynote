define('leeme/tips', ['jquery'], function(require, exports, module){

	function Tips(opt){
		var DEFAULT_CONFIG = {
			node: '',
			content: '',
			position: 'down',
			time: 2000
		};

		this.cfg = $.extend(DEFAULT_CONFIG, opt);
		this._init();
	}
	
	$.extend(Tips.prototype, {
		_init: function(){
			var self = this, cfg = self.cfg, node = $(cfg.node),
				uiTips = $('<div class="ui-tips"></div>'),
				img = $('<img src="/images/hey.gif" height="90px" width="90px"/>'),
				content = $('<span class="tips-content"></span>'),
				triangle = $('<span class="triangle-'+cfg.position+'"></span>');

			uiTips.append(triangle);
			uiTips.append(content);
			content.append(img);
			content.append($('<span>').html(cfg.content));
			
			uiTips.appendTo($(document.body)).fadeIn();

			var host = $(cfg.node),
				offset = host.offset(),
				w = host.outerWidth(),
				h = host.outerHeight(),
				tw = uiTips.outerWidth(),
				th = uiTips.outerHeight(),
				tleft, ttop;

			switch(cfg.position){
				case 'left':
					tleft = offset.left+w+20;
					ttop = offset.top+(h-th)/2;
				break;
				case 'right':
					tleft = offset.left-tw-20;
					ttop = offset.top+(h-th)/2;
				break;
				case 'up':
					tleft = offset.left+(w-tw)/2;
					ttop = offset.top+h+20;
				break;
				case 'down':
					tleft = offset.left+(w-tw)/2;
					ttop = offset.top-th-20;
				break;
			}
			uiTips.css({left: tleft, top: ttop});
			setTimeout(function(){
				uiTips.animate({opacity: 'hide'}, 'slow', 'swing', function(){
					uiTips.remove();
				});
			}, cfg.time);
		}
	});
	return Tips;
});
