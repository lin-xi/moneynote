define(function(require, exports, module){
	
	var _Event = require('leeme/event');

	function Select(opt){
		var DEFAULT_CONFIG = {
			node: '',
			data: []
		};
		this.cfg = $.extend(DEFAULT_CONFIG, opt);
		this.selected={};
		this._init();

		_Event.extend(this);
	}

	$.extend(Select.prototype, {
		_init: function(){
			var self = this, opt = self.cfg, node=$(opt.node),
				template = '<li title="{name}" value="{value}">{name}</li>',
				pattern = /\{(.*?)\}/g,
				selectTemp = '<div class="ui-select"><div class="clickarea clearfix"><span class="cur-text"></span><span class="triangle"></span></div></div>',
				ul=$('<ul class="select-option"></ul>');

			self.node = node;
			node.empty();
			for(var i=0, l=opt.data.length; i<l; i++){
				var li = $(template.replace(pattern, function(s0, s1){return opt.data[i][s1];}));
				li.appendTo(ul);
			}
			$(selectTemp).append(ul).appendTo(node);

			var sel = $('.ui-select', node);
			sel.find('.clickarea').on('click', function(e){
				ul.show();
				$(document.body).on('click', docClickHandler);
				
				function docClickHandler(){
					ul.hide();
					$(document.body).off('click', docClickHandler);
				}
				e.preventDefault();
				e.stopPropagation();
			});

			ul.bind('click', function(e){
				var item = $(e.target);
				var nn = e.target.nodeName.toLowerCase();
				if(nn == 'li'){
					node.find('.cur-text').text(item.text());
					self.selected = {value: item.attr('value'), name:item.text()};
					self.publish('change', self.selected);
					ul.hide();
				}
			});
		},

		reload: function(){
			this._init();
		},

		getSelectedValue: function(){
			return this.selected;
		},

		selectByIndex : function(index){
			var self = this, sel = $('.ui-select', self.node);
			var li = sel.find('li').eq(index);
			if(li){
				sel.find('.cur-text').text(li.text());
				self.selected = {value: li.attr('value'), name:li.text()};
				self.publish('change', self.selected);
			}
		},

		selectByValue : function(value){
			var self = this, sel = $('.ui-select', self.node);
			sel.find('li').each(function(index, item){
				var li = $(item);
				if(li.attr('value') == value){
					sel.find('.cur-text').text(li.text());
					self.selected = {value: li.attr('value'), name:li.text()};
					self.publish('change', self.selected);
				}
			});
		}
	});
	return Select;
});
