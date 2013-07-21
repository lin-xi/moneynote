define('leeme/table', ['jquery'], function(require, exports, module){
	var Dialog = require('leeme/dialog');

	function Table(opt){
		var DEFAULT_CONFIG = {
			node: '',
			editable: false,
			data: {url:'', param: {}},
			editURL: null,
			deleteURL: null,
			key: null,
			onSelect: $.noop,
			hasHeader: true,
			headers : [],
			columns: [],
			hasSumBar: true,
			sumColumns: []
		};
		this.cfg = $.extend(DEFAULT_CONFIG, opt);
		this.cache={};
		this._init();
	}

	$.extend(Table.prototype, {
		_init: function(){
			var self = this, opt = self.cfg, node=$(opt.node),
				template_edit = '<span title="edit" class="icon" data-icon="&#xf040;"></span>',
				template_delete = '<span title="delete" class="icon" data-icon="&#xe006;"></span>',
				pattern = /\{(.*?)\}/g,
				ul=$('<ul class="ui-table"></ul>');

			node.empty();

			if(opt.hasHeader){
				var headerLi = $('<li>'), hds = opt.headers;
				for(var i=0, l=hds.length; i<l; i++){
					$('<span class="text col'+(i+1)+'"></span>').text(hds[i]).appendTo(headerLi);
				}
				headerLi.appendTo(ul);
			}

			$.get(opt.data.url, opt.data.param, function(result){
				if(result.Code == 200){
					var data = result.Data, cols = opt.columns, sumCols = opt.sumColumns;
					if(data){
						var sums=[];
						for(var i=0, l=data.length; i<l; i++){
							var li = $('<li></li>');
							for(var j=0, n=cols.length; j<n; j++){
								var o = data[i];
								$('<span class="text col'+(j+1)+'"></span>').text(o[cols[j]]).appendTo(li);
							}
							if(opt.hasSumBar){
								for(var x=0, y=sumCols.length; x<y; x++){
									var key1 = sumCols[x];
									var ls = sums[x] || 0;
									ls = ls + (o[key1]-0);
									sums[x] = ls;
								}
							}
							if(opt.editable){
								//$(template_edit).appendTo(li);
								$(template_delete).appendTo(li)
							}
							li.data(opt.key, data[i][opt.key]);
							li.appendTo(ul);
						}

						if(opt.hasSumBar){
							var sumLi = $('<li></li>');
							for(var j=0, n= cols.length; j<n; j++){
								var curcol = cols[j];
								for(var k=0, m = sumCols.length; k<m; k++){
									var key1 = sumCols[k];
									if(curcol == key1){
										$('<span class="text col'+(j+1)+'"></span>').text(toDecimal(sums[k])).appendTo(li);
									} else {
										$('<span class="text col'+(j+1)+'"></span>').appendTo(li);
									}
								}
							}
							sumLi.appendTo(ul);
						}
					}
				}
			}, 'json');
			
			function toDecimal(x){
				var f = parseFloat(x);    
				if (isNaN(f)){    
					return;
				}
				f = Math.round(x*100)/100;    
				return f;
			}

			node.append(ul);

			ul.bind('click', function(e){
				var nn = e.target.nodeName.toLowerCase();
				if(nn == 'span'){
					var p = $(e.target).parent();
					if(e.target.className == 'edit'){
						
					} else if (e.target.title == 'delete') {
						if(opt.deleteURL){
							Dialog.confirm($(e.target), '亲，想好了？', function(){
								var param={};
								param[opt.key] = p.data(opt.key);
								$.post(opt.deleteURL, param, function(re){
									if(re.Code == 200){
										p.remove();
									}
								}, 'json');
							});
						}
					} else {
						ul.find('li').removeClass('li-selected');
						node.data('currentValue', p.title);
						p.addClass('li-selected');
						if(opt.onSelect){
							opt.onSelect(p.title);
						}
					}
				}
			});
		},

		reload: function(opt){
			$.extend(this.cfg, opt);
			this._init();
		},

		getSelectedValue: function(){
			return node.data('currentValue');
		}
	});
	return Table;
});
