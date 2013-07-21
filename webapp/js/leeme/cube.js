define('leeme/cube', ['jquery'], function(require, exports, module){

	function Cube(opt){
		this.cfg = $.extend(DEFAULT_CONFIG, opt);
		this.cache={};
		this._init();
	}
	
	var DEFAULT_CONFIG = {
		node: '',
		width: 200,
		height: 200,
		depth: 100,
		content:{
			front: '',
			left: '',
			right: '',
			back: '',
			top: '',
			right: ''
		}
	};
	
	$.extend(Cube.prototype, {
		_init: function(){
			var self = this, cfg = self.cfg;
				template = '<div class="cube-box"><div class="cube"><div class="face front">front</div><div class="face back">back</div><div class="face right">right</div><div class="face left">left</div><div class="face top">top</div><div class="face bottom">bottom</div></div>';
			
			var	node = typeof cfg.node == 'object' ? cfg.node : $(cfg.node);
			self.node = node;
			node.html(template);
			node.find('.cube-box').css({width: cfg.width, height: cfg.height});
			self.cache.currentClass = 'show-front';

			var front = node.find('.front'),
				left = node.find('.left'),
				right = node.find('.right'),
				top = node.find('.top'),
				bottom = node.find('.bottom'),
				back = node.find('.back');

			front.css({width: cfg.width, height: cfg.height});
			back.css({width: cfg.width, height: cfg.height});
			left.css({width: cfg.depth, height: cfg.height, left: (cfg.width-cfg.depth)/2});
			right.css({width: cfg.depth, height: cfg.height, left: (cfg.width-cfg.depth)/2});
			bottom.css({width: cfg.depth, height: cfg.depth, top: (cfg.height-cfg.depth)/2});
			top.css({width: cfg.depth, height: cfg.depth, top: (cfg.height-cfg.depth)/2});

			$.each(cfg.content, function(k, v){
				if(v == '') return;
				var obj = $(v);
					html = obj == null ? v : obj.html();
				switch(k){
					case 'front':
						front.empty().html(html);
					break;
					case 'left':
						left.empty().html(html);
					break;
					case 'right':
						right.empty().html(html);
					break;
					case 'top':
						top.empty().html(html);
					break;
					case 'bottom':
						bottom.empty().html(html);
					break;
					case 'back':
						back.empty().html(html);
					break;
				}
			});
		},
		
		showFront: function(){
			var cbox = this.node.find('.cube'),	cache = this.cache;
			cbox.removeClass(cache.currentClass);
			cbox.addClass('show-front');
			cache.currentClass = 'show-front';
		},
		
		showLeft: function(){
			var cbox = this.node.find('.cube'),	cache = this.cache;
			cbox.removeClass(cache.currentClass);
			cbox.addClass('show-left');
			cache.currentClass = 'show-left';
		},
		
		showRight: function(){
			var cbox = this.node.find('.cube'),	cache = this.cache;
			cbox.removeClass(cache.currentClass);
			cbox.addClass('show-right');
			cache.currentClass = 'show-right';
		},
		
		showTop: function(){
			var cbox = this.node.find('.cube'),	cache = this.cache;
			cbox.removeClass(cache.currentClass);
			cbox.addClass('show-top');
			cache.currentClass = 'show-top';
		},
		
		showBottom: function(){
			var cbox = this.node.find('.cube'),	cache = this.cache;
			cbox.removeClass(cache.currentClass);
			cbox.addClass('show-bottom');
			cache.currentClass = 'show-bottom';
		},
		
		showBack: function(){
			var cbox = this.node.find('.cube'),	cache = this.cache;
			cbox.removeClass(cache.currentClass);
			cbox.addClass('show-back');
			cache.currentClass = 'show-back';
		}
	});
	return Cube;
});
