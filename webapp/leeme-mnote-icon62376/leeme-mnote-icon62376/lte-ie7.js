/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'leeme-mnote-icon\'">' + entity + '</span>' + html;
	}
	var icons = {
			'i-pop-out' : '&#xe000;',
			'i-pop-in' : '&#xe001;',
			'i-angle-left' : '&#xe002;',
			'i-angle-right' : '&#xe003;',
			'i-x-altx-alt' : '&#xe004;',
			'i-check-alt' : '&#xe005;',
			'i-trashcan' : '&#xe006;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/i-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};