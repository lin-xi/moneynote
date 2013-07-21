define('leeme/calendar', ['jquery'], function(require, exports, module){

	function Calendar(opt){
		var DEFAULT_CONFIG = {
			node: '',
			width: 800,
			height: 550,
			maximum: true,
			data: {url:'', param:{}}
		};
		this.cfg = $.extend(DEFAULT_CONFIG, opt);
		this.cache = {};
		var now = new Date();
		now.year = now.getFullYear();
		now.month = now.getMonth()+1;
		now.day = now.getDate();
		this.cache.now = now; //当前时间
		this.current = now; //当前选中日期
		this._init();
	}
	
	$.extend(Calendar.prototype, {
		_init: function(){
			var self = this, template = '<div class="ui-calendar"><div class="header"><span class="prev" data-icon="&#xe002;"></span><span class="year"></span><span class="month"></span><span class="next" data-icon="&#xe003;"></span><span class="total-label">合计:</span><span class="total-money"></span><span class="min" data-icon="&#xe001;"></span><span class="max" data-icon="&#xe000;"></span></div><div class="weekday"><ul class="weekdaylist"><li>星期一</li><li>星期二</li><li>星期三</li><li>星期四</li><li>星期五</li><li>星期六</li><li>星期日</li></ul></div><ul class="days"><li><div class="calendar-item"><span class="ui-day-wraper">1</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">2</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">3</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">4</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">5</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">6</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">7</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">8</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">9</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">10</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">11</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">12</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">13</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">14</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">15</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">16</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">17</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">18</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">19</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">20</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">21</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">22</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">23</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">24</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">25</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">26</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">27</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">28</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">29</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">30</span></div></li><li><div class="calendar-item"><span class="ui-day-wraper">31</span></div></li></ul></div>',
				cfg = self.cfg, cur = self.current,
				node = typeof cfg.node == 'object' ? cfg.node : $(cfg.node);

			node.empty().hide();
			node.html(template);

			var cal = node.find('.ui-calendar'),
				header = cal.find('.header'),
				weekday = cal.find('.weekday'),
				days = cal.find('.days'),
				sy = cal.find('.year'),
				sm = cal.find('.month');

			self.node = node;
			if(!self.cache.max){
				node.width(cfg.width);
				days.height(cfg.height - header.outerHeight() - weekday.outerHeight());
			} else {
				node.width(node.parent().width()*0.98);
			}
			sy.text(cur.year);
			sm.text(cur.month);

			var rds = getRemoveDay(cur.year, cur.month), day_count=31;
			if(rds){
				day_count = 31-rds.length;
				for(; rds.length>0; ){
					days.find('li').eq(rds.shift()-1).remove();
				}
			}

			if(cfg.maximum){
				self.maximise();
			}

			var dnum  = getFirstWeekDay(cur.year, cur.month);
			days.find('li:first-child').css({'margin-left': (dnum-1)*14+'%'});
			
			node.show();

			if(day_count-36+dnum > 0){
				//显示6行的场合
				days.find('li').height('16%');
			}

			//绑定事件
			var prev = node.find('.prev'), 
				next = node.find('.next'),
				max = node.find('.max'),
				min = node.find('.min');

			if(!self.cache.max){
				max.css('display', 'inline-block');
				min.hide();
			} else {
				max.hide();
				min.css('display', 'inline-block');
			}

			prev.on('click', function(){
				if(cur.month == 1){
					self.showMonth(cur.year-1, 12);
				}else{
					self.showMonth(cur.year, cur.month-1);
				}
			});
			next.on('click', function(){
				if(cur.month == 12){
					self.showMonth(cur.year+1, 1);
				}else{
					self.showMonth(cur.year, cur.month+1);
				}
			});
			max.on('click', function(){
				self.maximise();
			});
			min.on('click', function(){
				self.cache.max = false;
				node.width(cfg.width);
				days.height(cfg.height - header.outerHeight() - weekday.outerHeight());
				max.css('display', 'inline-block');
				min.hide();
			});
			
			self._getData();
		},
		maximise: function(){
			var self = this, 
				node = self.node, days = node.find('.days'), 
				header = node.find('.header'), weekday = node.find('.weekday'),
				max = node.find('.max'), min = node.find('.min');
			self.cache.max = true;
			node.width(node.parent().width()*0.98);
			days.height($(window).height()- 40 - header.outerHeight() - weekday.outerHeight());
			max.hide();
			min.css('display', 'inline-block');
		},
		_getData: function(){
			var self = this, opt = self.cfg, cur = self.current;
			$.get(opt.dataUrl, {createtime: new Date(cur.year, cur.month-1, 1).getTime()}, function(result){
				if(result.Code == 200){
					var data = {};
					for(var i=0,l=result.Data.length; i<l; i++){
						var item = result.Data[i];
						var day = getDate(item.createtime);
						if(data[day]){
							data[day] += item.amount;
						}else{
							data[day] = item.amount;
						}
					}
					self.cache.data = data;
					self._computeTotalMoney();
				}
			}, 'json');
		},
		_computeTotalMoney: function(){
			var self = this, node = self.node, opt = self.cfg, cur = self.current; data = self.cache.data;
			var total = 0;
			for(var key in data){
				total += data[key];
				var money = $('<p>￥'+ toDecimal(data[key]) +'</p>');
				node.find('.calendar-item').eq(key-1).append(money);
			}
			node.find('.total-money').text('￥'+total+'元');
		},
		showMonth: function(year, month){
			var self= this;
			self.current.year = year;
			self.current.month = month;
			self._init();
		},
		showYear: function(year, month){
			var self= this;
			self.current.year = year;
			self.current.month = month;
			self._init();
		},
		render: function(opt){
			S.extend(this.cfg, opt);
			this._init();
		}
	});
	
	function toDecimal(x){
		var f = parseFloat(x);    
		if (isNaN(f)){    
			return;
		}
		f = Math.round(x*100)/100;    
		return f;
	}

	function getRemoveDay(year, month){
		var days = [null, null, null, [31], null, [31], null, null, [31], null, [31], null];
		if(month == 2){
			if((year%4 == 0 && year%100 != 0) || year%400 == 0){
				return [31, 30];
			} else {
				return [31, 30, 29];
			}
		}else{
			return days[month-1];
		}
	}

	function getFirstWeekDay(year, month){
		var da = new Date(year, month-1, 1),
			dn = da.getDay();
		return dn == 0 ? 7 : dn;
	}

	function formatDate(year, month){
		var d = new Date(year, month, 1, 0, 0, 0, 0);
		return d.getTime();
	}

	function getDate(timestamp){
		var d = new Date(timestamp);
		return d.getDate();
	}

	return Calendar;
});
