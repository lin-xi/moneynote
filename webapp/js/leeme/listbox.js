define('leeme/listbox', ['jquery'], function(require, exports, module){
	var Dialog = require('leeme/dialog');

	function ListBox(opt){
		var DEFAULT_CONFIG = {
			node: '',
			editable: false,
			data: {url:'', param: {}},
			editURL: null,
			deleteURL: null,
			onSelect: $.noop
		};
		this.cfg = $.extend(DEFAULT_CONFIG, opt);
		this.cache={};
		this._init();
	}

	$.extend(ListBox.prototype, {
		_init: function(){
			var self = this, opt = self.cfg, node=$(opt.node),
				template = '<li title="{id}"><span class="text">{name}</span></li>',
				template_edit = '<li><span class="command icon-remove"></span><span class="text">{name}</span></li>',
				pattern = /\{(.*?)\}/g,
				ul=$('<ul class="ui-listbox"></ul>');

			node.empty();
			$.get(opt.data.url, opt.param, function(result){
				if(result.Code == 200){
					var data = result.Data;
					if(data){
						for(var i=0, l=data.length; i<l; i++){
							var temp = opt.editable ? template_edit : template;
							var li = $(temp.replace(pattern, function(s0, s1){return data[i][s1];}));
							li.appendTo(ul);
							li.data('key', data[i][opt.key]);
						}
						node.append(ul);
					}
				}
			}, 'json');
					
			if(opt.editable){
				ul.bind('dblclick', function(e){
					if(e.target.nodeName.toLowerCase() == 'span' && e.target.className == 'text'){
						var tar = $(e.target.parentNode);
							
						if(!tar.data('editMode')){
							var	input = $('<input type="text"/>'),
								fp = tar.find('.text');
							input.val(fp.text());
							tar.children().hide();
							tar.prepend(input);
							tar.data('editMode', true);
								
							input.bind('keyup', function(e){
								if(e.keyCode == 13){
									var text = $.trim($(this).val());
									if( text != ""){
										fp.text(text);
										$(this).remove();
										tar.children().show();
										tar.data('editMode', false);
										if(opt.editURL){
											var param ={};
											param[opt.key] = tar.data('key');
											param.name = text;
											console.log(param);
											$.post(opt.editURL, param, function(re){
											}, 'json');
										}
									}
								}
							})
						}
					}
				});
			}
			ul.bind('click', function(e){
				var nn = e.target.nodeName.toLowerCase();
				if(nn == 'span'){
					var p = $(e.target).parent();
					if(e.target.className != 'text'){
						if(opt.deleteURL){
							Dialog.confirm($(e.target), '亲，想好了？', function(){
								var param ={};
								param[opt.key] = p.data('key');
								$.post(opt.deleteURL, param, function(re){
									if(re.Code == 200){
										p.remove();
									}
								}, 'json');
							});
						}
					}

					ul.find('li').removeClass('li-selected');
					node.data('currentValue', p.attr('title'));
					p.addClass('li-selected');
					if(opt.onSelect){
						opt.onSelect(p.title);
					}
				}
			});
		},

		reload: function(){
			this._init();
		},

		getSelectedValue: function(){
			var node = $(this.cfg.node);
			return node.data('currentValue');
		}
	});
	return ListBox;
});
