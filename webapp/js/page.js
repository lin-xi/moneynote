define(function(require, exports, module) {

	var $ = require('jquery');
	require('datapicker');

	var currentDate = 0;

	$(document).ready(function(){
		
		//----page1----
		var d = new Date();
		$('.c-month').text(d.getMonth()+1);
		$('.c-day').text(d.getDate());

		currentDate = formatDate(d);
	
		var Tips = require('leeme/tips');
		var Cube = require('leeme/cube');
		var ListBox = require('leeme/listbox');

		preload('/images/hey.gif');

		var cube = new Cube({
			node: '.contentCube',
			width: 900,
			height: 600,
			depth: 900,
			content:{
				front: '#consumeTable-model',
				left: '#add-panel-model',
				back: '#consumeItem-model'
			}
		});
		var Dialog = require('leeme/dialog');
		$('#add-btn').on('click', function(){
			cube.showLeft();
		});
		
		$('.close-left').on('click', function(){
			cube.showFront();
		});
		$('.close-back').on('click', function(){
			cube.showLeft();
		});

		$('#consumeItem-btn').on('click', function(){
			cube.showBack();
		});

		var ctl = new ListBox({
			node: '.consumeTypelist', 
			data: {url: '/api/consumeItem/queryAll'},
			editable: false
		});
		var	ciList = new ListBox({
			node: '#consumeItem-ul',
			editable: true,
			data: {url: '/api/consumeItem/queryAll'},
			editURL: '/api/consumeItem/update',
			deleteURL: '/api/consumeItem/delete',
			key: 'id'
		});

		var Table = require('leeme/table');
		var	table = new Table({
			node: '.contentTable',
			editable: true,
			data: {url: '/api/consumeAccount/queryByDay', param:{createtime: currentDate}},
			deleteURL: '/api/consumeAccount/delete',
			key: 'id',
			onSelect: $.noop,
			hasHeader: true,
			headers: ['分类', '物品', '金额'],
			columns: ['category_name', 'goods', 'amount'],
			hasSumBar: true,
			sumColumns: ['amount']
		});

		$('.date-wraper').datepicker({format: 'yyyy-mm-dd'}).on('changeDate', function(ev) {
		    var newDate = ev.date;
		    $('.c-month').text(newDate.getMonth()+1);
		    $('.c-day').text(newDate.getDate());

		    $('.calendar').fadeOut('slow');
		    $('.contentCube').fadeIn();
			$('.chart').fadeOut('slow');
			currentDate = formatDate(newDate);
		    table.reload({data: {url: '/api/consumeAccount/queryByDay', param:{createtime: currentDate}}});
		});

		$('#consumeItem-add').bind('click', function(){
			var name = $('#consumeItemName').val();
			if(name !=""){
				$.post('/api/consumeItem/add', {name: name}, function(re){
					if(re.Code == 200){
						$('#consumeItemName').val('')
						ciList.reload();
						ctl.reload();
					}
				}, 'json');
			}
		});

		$('#add-consume-btn').bind('click', function(){
			var type = ctl.getSelectedValue(),
				goods = $('#goods').val(),
				amount = $('#money').val();

			if(!type){
				new Tips({node: '.consumeTypelist', position: 'left', content:'亲，先选一个'});
				return;
			}
			if(amount == ""){
				new Tips({node: '#money', position: 'left', content:'亲，把金额填了'});
				return;
			} else {
				if(!/^\d+(\.\d+)?$/.test(amount)){
					new Tips({node: '#money', position: 'left', content:'亲，小学毕业了没？填数字啦'});
					return;
				}
			}
			$.post('/api/consumeAccount/add', {category: type, goods: goods, amount: amount, createtime: currentDate}, function(re){
				if(re.Code == 200){
					$('#goods').val('');
					$('#money').val('');
					table.reload();
					cube.showFront();
				}
			}, 'json');
		});
		//------------


		
		//----page2----
		var Calendar = require('leeme/calendar');
		$('.menu-time').on('click', function(){
			$('.contentCube').fadeOut('slow');
			$('.chart').fadeOut('slow');
			new Calendar({node: '.calendar', height: 660, dataUrl: '/api/consumeAccount/queryByMonth'});
		});
		//------------


		
		//----page3----
		$('.menu-type').on('click', function(){
			$('.contentCube').fadeOut('slow');
			$('.calendar').fadeOut('slow');
			$('.chart').fadeIn('slow');

			require('raphael/pieChart.js');

			var Select = require('leeme/select');
			var syear = new Select({node: '.select-year', data:[{name:2013, value:2013}]});
			var smonth = new Select({node: '.select-month', data:[{name:1, value:1}, {name:2, value:2}, {name:3, value:3}, {name:4, value:4}, {name:5, value:5}, {name:6, value:6}, {name:7, value:7}, {name:8, value:8}, {name:9, value:9}, {name:10, value:10}, {name:11, value:11}, {name:12, value:12}]});
			var dt = new Date();

			smonth.on('change', onChange);

			syear.selectByValue(dt.getFullYear());
			smonth.selectByValue(dt.getMonth()+1);
			
			syear.on('change', onChange);

			function onChange(){
				var selDate = new Date(syear.getSelectedValue().value, smonth.getSelectedValue().value-1, 1).getTime();
				$.get('/api/consumeAccount/queryByMonth', {createtime: selDate}, function(data){
					if(data.Code == 200 && data.Data){
						var map = {};
						for(var i=0, l=data.Data.length; i<l; i++){
							var obj = data.Data[i],
								key = obj.category_name;
							if(map[key]){
								map[key] += obj.amount;
							}else{
								map[key] = obj.amount;
							}
						}

						var labels=[], values=[];
						for(var k in map){
							labels.push(k);
							values.push(map[k]);
						}
						$('#pichart').empty();
						var r = Raphael("pichart", 800, 500).pieChart(400, 250, 200, values, labels, "#fff");
					} else {
						$('#pichart').empty();
					}
				}, 'json');
			}
		});
		//------------
		
		function preload(src){
			var img = new Image();
			img.src = src;
		}

		function formatDate(d){
			d.setHours(0, 0, 0, 0);
			return d.getTime();
		}
	});

});