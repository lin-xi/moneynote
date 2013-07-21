define('leeme/dialog', ['jquery'], function(require, exports, module){

	function Dialog(opt){
	}
	
	Dialog.confirm = function(node, cont, func){

		var	node = typeof node == 'object' ? node : $(node),
			uiDialog = $('<div class="ui-dialog"></div>'),
			img = $('<img src="/images/hey.gif" height="90px" width="90px"/>'),
			content = $('<span class="tips-content"></span>'),
			btnArea = $('<div class="btnArea"><a class="ok-btn" data-icon="&#xe005;"></a><a class="cancel-btn" data-icon="&#xe004;"></a>'),
			triangle = $('<span class="triangle4"></span>');

		uiDialog.append(triangle);
		uiDialog.append(content);
		content.append(img);
		content.append($('<span>').html(cont));
		content.append(btnArea);
		uiDialog.appendTo($(document.body)).fadeIn();

		var host = node,
			offset = host.offset(),
			w = host.outerWidth(),
			h = host.outerHeight(),
			tw = uiDialog.outerWidth(),
			th = uiDialog.outerHeight(),
			tleft, ttop;
		tleft = offset.left+(w-tw)/2;
		ttop = offset.top-th-20;
		uiDialog.css({left: tleft, top: ttop});
		
		btnArea.find('.ok-btn').on('click', function(){
			func();
			uiDialog.remove();
		});
		btnArea.find('.cancel-btn').on('click', function(){
			uiDialog.remove();
		});
	}

	return Dialog;
});
